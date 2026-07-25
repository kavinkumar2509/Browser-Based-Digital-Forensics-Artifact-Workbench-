import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ForensicFinding } from '../../utils/parsers';

interface Node {
  id: string;
  label: string;
  type: 'host' | 'artifact' | 'target' | 'mitre';
  x: number;
  y: number;
  score: number;
  findingRef?: ForensicFinding;
}

interface Link { source: string; target: string; label?: string; }
interface Viewport { x: number; y: number; zoom: number; }
interface AttackGraphProps { findings: ForensicFinding[]; onSelectFinding?: (finding: ForensicFinding) => void; }

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 5;
const DEFAULT_VIEWPORT: Viewport = { x: 0, y: 0, zoom: 1 };
const ZOOM_DURATION = 240;

export const AttackGraph: React.FC<AttackGraphProps> = ({ findings, onSelectFinding }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [viewport, setViewport] = useState<Viewport>(DEFAULT_VIEWPORT);
  const svgRef = useRef<SVGSVGElement>(null);
  const viewportRef = useRef(DEFAULT_VIEWPORT);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const dragRef = useRef<{ x: number; y: number; viewX: number; viewY: number } | null>(null);
  const pinchRef = useRef<{ distance: number; center: { x: number; y: number }; x: number; y: number; zoom: number } | null>(null);
  const frameRef = useRef<number | null>(null);
  const pendingViewRef = useRef<Viewport | null>(null);
  const animationRef = useRef<number | null>(null);
  const draggedRef = useRef(false);

  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, Node>();
    const linkList: Link[] = [];
    findings?.forEach((f) => {
      const hostId = `host-${f.machineId || 'WORKSTATION-01'}`;
      if (!nodeMap.has(hostId)) nodeMap.set(hostId, { id: hostId, label: f.machineId || 'WORKSTATION-01', type: 'host', x: 120, y: 180 + (nodeMap.size % 4) * 80, score: 30 });
      const fileId = `file-${f.sourceFile}`;
      if (!nodeMap.has(fileId)) {
        nodeMap.set(fileId, { id: fileId, label: f.sourceFile, type: 'artifact', x: 320, y: 100 + nodeMap.size * 55, score: f.threatScore, findingRef: f });
        linkList.push({ source: hostId, target: fileId, label: 'contains' });
      }
      const targetVal = f.value.length > 30 ? `${f.value.slice(0, 27)}...` : f.value;
      const targetId = `target-${f.id}`;
      if (!nodeMap.has(targetId)) {
        nodeMap.set(targetId, { id: targetId, label: `${f.extractedField}: ${targetVal}`, type: 'target', x: 580, y: 80 + nodeMap.size * 48, score: f.threatScore, findingRef: f });
        linkList.push({ source: fileId, target: targetId, label: 'extracted' });
      }
      if (f.mitreTactic && f.mitreTactic !== 'None') {
        const mitreCode = f.mitreTactic.split(' ')[0];
        const mitreId = `mitre-${mitreCode}`;
        if (!nodeMap.has(mitreId)) nodeMap.set(mitreId, { id: mitreId, label: f.mitreTactic, type: 'mitre', x: 820, y: 120 + nodeMap.size * 60, score: f.threatScore });
        linkList.push({ source: targetId, target: mitreId, label: 'maps to' });
      }
    });
    return { nodes: Array.from(nodeMap.values()), links: linkList };
  }, [findings]);

  const filteredNodes = useMemo(() => filterType === 'all' ? nodes : nodes.filter((node) => node.type === filterType), [nodes, filterType]);
  const filteredLinks = useMemo(() => {
    const ids = new Set(filteredNodes.map((node) => node.id));
    return links.filter((link) => ids.has(link.source) && ids.has(link.target));
  }, [links, filteredNodes]);
  const nodesById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  const clampViewport = useCallback((next: Viewport): Viewport => {
    const rect = svgRef.current?.getBoundingClientRect();
    const limitX = Math.max(900, (rect?.width ?? 900) * 3);
    const limitY = Math.max(700, (rect?.height ?? 440) * 3);
    return { x: Math.max(-limitX, Math.min(limitX, next.x)), y: Math.max(-limitY, Math.min(limitY, next.y)), zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next.zoom)) };
  }, []);

  const applyViewport = useCallback((next: Viewport) => {
    const clamped = clampViewport(next);
    viewportRef.current = clamped;
    setViewport(clamped);
  }, [clampViewport]);

  const queueViewport = useCallback((next: Viewport) => {
    pendingViewRef.current = next;
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      if (pendingViewRef.current) applyViewport(pendingViewRef.current);
      pendingViewRef.current = null;
    });
  }, [applyViewport]);

  const animateViewport = useCallback((target: Viewport) => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    const start = viewportRef.current;
    const end = clampViewport(target);
    const startedAt = performance.now();
    const animate = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / ZOOM_DURATION);
      const eased = 1 - Math.pow(1 - progress, 3);
      applyViewport({ x: start.x + (end.x - start.x) * eased, y: start.y + (end.y - start.y) * eased, zoom: start.zoom + (end.zoom - start.zoom) * eased });
      if (progress < 1) animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  }, [applyViewport, clampViewport]);

  const localPoint = useCallback((clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    return { x: clientX - (rect?.left ?? 0), y: clientY - (rect?.top ?? 0) };
  }, []);

  const zoomAt = useCallback((zoom: number, point?: { x: number; y: number }, animate = true) => {
    const current = viewportRef.current;
    const rect = svgRef.current?.getBoundingClientRect();
    const anchor = point ?? { x: (rect?.width ?? 0) / 2, y: (rect?.height ?? 0) / 2 };
    const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
    const graphX = (anchor.x - current.x) / current.zoom;
    const graphY = (anchor.y - current.y) / current.zoom;
    const next = { x: anchor.x - graphX * nextZoom, y: anchor.y - graphY * nextZoom, zoom: nextZoom };
    if (animate) animateViewport(next); else queueViewport(next);
  }, [animateViewport, queueViewport]);

  const fitToScreen = useCallback(() => {
    if (!filteredNodes.length) return;
    const rect = svgRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 900;
    const height = rect?.height ?? 440;
    const padding = 70;
    const xs = filteredNodes.map((node) => node.x);
    const ys = filteredNodes.map((node) => node.y);
    const minX = Math.min(...xs) - 35, maxX = Math.max(...xs) + 220;
    const minY = Math.min(...ys) - 35, maxY = Math.max(...ys) + 35;
    const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min((width - padding * 2) / Math.max(1, maxX - minX), (height - padding * 2) / Math.max(1, maxY - minY))));
    animateViewport({ x: width / 2 - ((minX + maxX) / 2) * zoom, y: height / 2 - ((minY + maxY) / 2) * zoom, zoom });
  }, [animateViewport, filteredNodes]);

  const centerGraph = useCallback(() => {
    if (!filteredNodes.length) return;
    const rect = svgRef.current?.getBoundingClientRect();
    const centerX = (Math.min(...filteredNodes.map((n) => n.x)) + Math.max(...filteredNodes.map((n) => n.x))) / 2;
    const centerY = (Math.min(...filteredNodes.map((n) => n.y)) + Math.max(...filteredNodes.map((n) => n.y))) / 2;
    animateViewport({ x: (rect?.width ?? 900) / 2 - centerX * viewportRef.current.zoom, y: (rect?.height ?? 440) / 2 - centerY * viewportRef.current.zoom, zoom: viewportRef.current.zoom });
  }, [animateViewport, filteredNodes]);

  useEffect(() => () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); if (animationRef.current) cancelAnimationFrame(animationRef.current); }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;
      if (event.key === '0') { event.preventDefault(); animateViewport(DEFAULT_VIEWPORT); }
      if (event.key === '+' || event.key === '=') { event.preventDefault(); zoomAt(viewportRef.current.zoom * 1.2); }
      if (event.key === '-') { event.preventDefault(); zoomAt(viewportRef.current.zoom / 1.2); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [animateViewport, zoomAt]);

  const getNodeColor = (node: Node) => node.type === 'host' ? { bg: '#3b82f6', border: '#60a5fa', text: '#93c5fd' } : node.type === 'artifact' ? { bg: '#06b6d4', border: '#22d3ee', text: '#67e8f9' } : node.type === 'target' ? node.score > 80 ? { bg: '#ef4444', border: '#f87171', text: '#fca5a5' } : { bg: '#f59e0b', border: '#fbbf24', text: '#fde68a' } : { bg: '#8b5cf6', border: '#a78bfa', text: '#c4b5fd' };
  const pointerPair = () => Array.from(pointersRef.current.values()).slice(0, 2);

  return <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
      <div><h2 className="flex items-center gap-2 text-base font-bold text-cyan-300"><span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />INTERACTIVE FORENSIC ATTACK NETWORK GRAPH</h2><p className="text-xs text-slate-400">Visual attack vector relationship mapping (Host → Artifact → Extracted Value → MITRE Tactic)</p></div>
      <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 p-1">{['all', 'host', 'artifact', 'target', 'mitre'].map((type) => <button key={type} onClick={() => setFilterType(type)} className={`rounded border px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${filterType === type ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>{type}</button>)}</div>
    </div>
    <div className="relative min-h-[420px] w-full overflow-hidden rounded-lg border border-slate-800/80 bg-slate-950/90">
      <div className="pointer-events-none absolute left-3 top-3 z-10 rounded border border-cyan-500/30 bg-slate-950/90 px-2.5 py-1.5 font-mono text-[10px] leading-5 text-cyan-200 shadow-lg">ZOOM: {Math.round(viewport.zoom * 100)}%<br />NODES: {filteredNodes.length} &nbsp; LINKS: {filteredLinks.length}</div>
      <div className="absolute right-3 top-3 z-10 flex overflow-hidden rounded-lg border border-cyan-500/30 bg-slate-950/95 shadow-lg">
        <button aria-label="Zoom in" title="Zoom In (Ctrl + +)" onClick={() => zoomAt(viewport.zoom * 1.2)} className="border-r border-slate-700 px-3 py-2 font-mono text-cyan-300 hover:bg-cyan-500/15">+</button>
        <button aria-label="Zoom out" title="Zoom Out (Ctrl + -)" onClick={() => zoomAt(viewport.zoom / 1.2)} className="border-r border-slate-700 px-3 py-2 font-mono text-cyan-300 hover:bg-cyan-500/15">−</button>
        <button title="Reset View (Ctrl + 0)" onClick={() => animateViewport(DEFAULT_VIEWPORT)} className="border-r border-slate-700 px-2.5 py-2 text-[10px] font-bold text-slate-300 hover:bg-cyan-500/15">RESET</button>
        <button title="Fit visible graph to screen" onClick={fitToScreen} className="border-r border-slate-700 px-2.5 py-2 text-[10px] font-bold text-slate-300 hover:bg-cyan-500/15">FIT</button>
        <button title="Center visible graph" onClick={centerGraph} className="px-2.5 py-2 text-[10px] font-bold text-slate-300 hover:bg-cyan-500/15">CENTER</button>
      </div>
      <svg ref={svgRef} className="h-[440px] w-full touch-none select-none" onWheel={(event) => { event.preventDefault(); zoomAt(viewportRef.current.zoom * (event.deltaY < 0 ? 1.12 : 1 / 1.12), localPoint(event.clientX, event.clientY)); }} onPointerDown={(event) => { if (event.button !== 0 && event.pointerType === 'mouse') return; event.currentTarget.setPointerCapture(event.pointerId); const point = localPoint(event.clientX, event.clientY); pointersRef.current.set(event.pointerId, point); draggedRef.current = false; if (pointersRef.current.size === 1) dragRef.current = { x: point.x, y: point.y, viewX: viewportRef.current.x, viewY: viewportRef.current.y }; if (pointersRef.current.size === 2) { const [a, b] = pointerPair(); pinchRef.current = { distance: Math.hypot(b.x - a.x, b.y - a.y), center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, x: viewportRef.current.x, y: viewportRef.current.y, zoom: viewportRef.current.zoom }; } }} onPointerMove={(event) => { if (!pointersRef.current.has(event.pointerId)) return; const point = localPoint(event.clientX, event.clientY); pointersRef.current.set(event.pointerId, point); if (pointersRef.current.size === 1 && dragRef.current) { const dx = point.x - dragRef.current.x, dy = point.y - dragRef.current.y; if (Math.abs(dx) + Math.abs(dy) > 3) draggedRef.current = true; queueViewport({ ...viewportRef.current, x: dragRef.current.viewX + dx, y: dragRef.current.viewY + dy }); } else if (pointersRef.current.size >= 2 && pinchRef.current) { const [a, b] = pointerPair(); const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; const distance = Math.hypot(b.x - a.x, b.y - a.y); const base = pinchRef.current; const zoom = base.zoom * (distance / Math.max(1, base.distance)); const graphX = (base.center.x - base.x) / base.zoom, graphY = (base.center.y - base.y) / base.zoom; draggedRef.current = true; queueViewport({ x: center.x - graphX * zoom, y: center.y - graphY * zoom, zoom }); } }} onPointerUp={(event) => { pointersRef.current.delete(event.pointerId); dragRef.current = null; pinchRef.current = null; }} onPointerCancel={(event) => { pointersRef.current.delete(event.pointerId); dragRef.current = null; pinchRef.current = null; }}>
        <defs><linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" /><stop offset="100%" stopColor="#ef4444" stopOpacity="0.6" /></linearGradient><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="blur" /><feComposite in="SourceGraphic" in2="blur" operator="over" /></filter></defs>
        <g transform={`translate(${viewport.x} ${viewport.y}) scale(${viewport.zoom})`}>
          {filteredLinks.map((link, index) => { const source = nodesById.get(link.source), target = nodesById.get(link.target); if (!source || !target) return null; const highlighted = selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target); return <line key={`${link.source}-${link.target}-${index}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={highlighted ? '#22d3ee' : 'url(#lineGrad)'} strokeWidth={highlighted ? 2.5 : 1.2} strokeDasharray={highlighted ? '6,3' : 'none'} className={highlighted ? 'animate-pulse' : ''} />; })}
          {filteredNodes.map((node) => { const colors = getNodeColor(node), selected = selectedNode?.id === node.id; return <g key={node.id} transform={`translate(${node.x} ${node.y})`} onMouseEnter={() => setHoveredNode(node)} onMouseLeave={() => setHoveredNode(null)} onClick={() => { if (draggedRef.current) return; setSelectedNode(node); if (node.findingRef && onSelectFinding) onSelectFinding(node.findingRef); }} className="cursor-pointer"><circle r={selected ? 26 : 20} fill={colors.bg} fillOpacity={selected ? 0.35 : 0.15} stroke={colors.border} strokeWidth={selected ? 3 : 1.5} filter={selected ? 'url(#glow)' : undefined} /><circle r={selected ? 8 : 6} fill={colors.border} /><text x={26} y={4} fill={colors.text} fontSize={11} fontWeight={selected ? 'bold' : 'normal'} className="pointer-events-none font-mono select-none drop-shadow-md">{node.label}</text></g>; })}
        </g>
      </svg>
      {hoveredNode && <div className="pointer-events-none absolute bottom-4 right-4 z-10 rounded border border-slate-700 bg-slate-900/95 px-3 py-2 font-mono text-xs text-slate-200 shadow-xl"><span className="text-cyan-400">{hoveredNode.type.toUpperCase()}</span> · Threat score: {hoveredNode.score}%</div>}
      {selectedNode && <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border border-cyan-500/40 bg-slate-900/95 p-3 text-xs shadow-xl backdrop-blur-md"><div><span className="font-bold uppercase tracking-wider text-cyan-400">[{selectedNode.type}]</span> <span className="font-semibold text-slate-200">{selectedNode.label}</span>{selectedNode.score > 0 && <span className="ml-3 rounded border border-red-800/60 bg-red-950 px-2 py-0.5 font-mono font-bold text-red-400">THREAT SCORE: {selectedNode.score}%</span>}</div><button onClick={() => setSelectedNode(null)} className="font-bold text-slate-400 hover:text-cyan-300">[CLOSE]</button></div>}
    </div>
  </div>;
};
