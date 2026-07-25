import React, { useMemo } from 'react';
import { ForensicFinding } from '../../utils/parsers';

interface TimelineGraphProps {
  findings: ForensicFinding[];
  onTimeSelect?: (finding: ForensicFinding) => void;
}

export const TimelineGraph: React.FC<TimelineGraphProps> = ({ findings, onTimeSelect }) => {
  const buckets = useMemo(() => {
    if (!findings || findings.length === 0) return [];

    const sorted = [...findings].sort((a, b) => {
      const ta = a.rawDate ? a.rawDate.getTime() : 0;
      const tb = b.rawDate ? b.rawDate.getTime() : 0;
      return ta - tb;
    });

    return sorted;
  }, [findings]);

  if (buckets.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 text-xs text-slate-500">
        No findings parsed to render timeline graph.
      </div>
    );
  }

  const maxThreat = Math.max(...buckets.map((b) => b.threatScore || 10), 100);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            INCIDENT CHRONOLOGY & THREAT DENSITY HISTOGRAM
          </h3>
          <p className="text-xs text-slate-400">Chronological artifact activity frequency and threat weight</p>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          EVENTS PARSED: <span className="text-emerald-400 font-mono">{buckets.length}</span>
        </div>
      </div>

      <div className="relative h-44 w-full rounded-lg border border-slate-800/80 bg-slate-950 p-4">
        <svg className="h-full w-full overflow-visible">
          {/* Baseline */}
          <line x1="0" y1="120" x2="100%" y2="120" stroke="#334155" strokeWidth="1.5" />

          {/* Grid lines */}
          <line x1="0" y1="30" x2="100%" y2="30" stroke="#1e293b" strokeDasharray="4,4" />
          <line x1="0" y1="75" x2="100%" y2="75" stroke="#1e293b" strokeDasharray="4,4" />

          {/* Histogram Bars */}
          {buckets.map((finding, idx) => {
            const step = 100 / Math.max(buckets.length, 1);
            const xPos = idx * step + step / 2;
            const barHeight = Math.max((finding.threatScore / maxThreat) * 90, 18);
            const yPos = 120 - barHeight;

            const isHighRisk = finding.threatScore >= 75;

            return (
              <g
                key={finding.id || idx}
                onClick={() => onTimeSelect && onTimeSelect(finding)}
                className="cursor-pointer transition-all duration-200 hover:opacity-100"
              >
                {/* Bar */}
                <rect
                  x={`${xPos - step * 0.35}%`}
                  y={yPos}
                  width={`${Math.max(step * 0.7, 1.5)}%`}
                  height={barHeight}
                  rx={2}
                  fill={isHighRisk ? '#ef4444' : finding.threatScore >= 40 ? '#f59e0b' : '#10b981'}
                  fillOpacity={0.8}
                  stroke={isHighRisk ? '#f87171' : '#34d399'}
                  strokeWidth={1}
                />

                {/* Point Marker */}
                <circle
                  cx={`${xPos}%`}
                  cy={yPos}
                  r={3}
                  fill="#ffffff"
                />

                {/* Time Label on hover */}
                <title>{`${finding.timestamp}\nArtifact: ${finding.sourceFile}\nThreat: ${finding.threatScore}%\n${finding.mitreTactic}`}</title>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-500" /> CRITICAL (&gt;75%)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" /> SUSPICIOUS (40-75%)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" /> INFORMATIONAL (&lt;40%)
            </span>
          </div>
          <div>Hover bar for timestamp details</div>
        </div>
      </div>
    </div>
  );
};
