import React, { useState } from 'react';
import { useEvidence } from '../context/EvidenceContext';
import { AttackGraph } from '../components/graph/AttackGraph';
import { TimelineGraph } from '../components/graph/TimelineGraph';
import { MitreMatrix } from '../components/graph/MitreMatrix';
import { ForensicFinding } from '../utils/parsers';

export default function GraphView() {
  const { findings, loadSampleCase, activeCaseId } = useEvidence();
  const [selectedFinding, setSelectedFinding] = useState<ForensicFinding | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-cyan-500/30 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold tracking-wider text-cyan-300">
              FORENSIC GRAPH &amp; ATTACK VECTOR MATRIX
            </h1>
            <span className="rounded border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-cyan-400">
              CASE #{activeCaseId}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Node-link relationship graph and threat density telemetry derived from in-browser binary parsers.
          </p>
        </div>

        <button
          onClick={loadSampleCase}
          className="rounded-lg border border-cyan-400/50 bg-cyan-400/10 px-4 py-2 text-xs font-bold tracking-wider text-cyan-300 transition-all hover:bg-cyan-400/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]"
        >
          LOAD SAMPLE PHISHING INVESTIGATION CASE
        </button>
      </div>

      {/* Main Interactive Attack Graph */}
      <AttackGraph findings={findings} onSelectFinding={(f) => setSelectedFinding(f)} />

      {/* Grid: Timeline Graph & MITRE Matrix */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TimelineGraph findings={findings} onTimeSelect={(f) => setSelectedFinding(f)} />
        <MitreMatrix findings={findings} />
      </div>

      {/* Selected Finding Detail Drawer */}
      {selectedFinding && (
        <div className="rounded-xl border border-cyan-500/40 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-cyan-300">SELECTED ARTIFACT TELEMETRY INSPECTOR</h3>
            <button
              onClick={() => setSelectedFinding(null)}
              className="text-xs text-slate-400 hover:text-cyan-300 font-mono font-bold"
            >
              [CLOSE INSPECTOR]
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
            <div>
              <span className="text-slate-500 uppercase font-bold">Source File:</span>
              <p className="font-mono text-slate-200 font-semibold">{selectedFinding.sourceFile}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold">Extracted Field:</span>
              <p className="font-mono text-cyan-400 font-semibold">{selectedFinding.extractedField}</p>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold">Heuristic Threat Score:</span>
              <p className="font-mono font-bold text-red-400">{selectedFinding.threatScore}%</p>
            </div>
            <div className="md:col-span-3">
              <span className="text-slate-500 uppercase font-bold">Extracted Value:</span>
              <p className="mt-1 font-mono text-slate-100 bg-slate-950 p-2.5 rounded border border-slate-800 break-all">
                {selectedFinding.value}
              </p>
            </div>
            <div className="md:col-span-3">
              <span className="text-slate-500 uppercase font-bold">Forensic Significance:</span>
              <p className="mt-1 text-slate-300 leading-relaxed">{selectedFinding.significance}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
