import React from 'react';
import { ForensicFinding } from '../../utils/parsers';

interface MitreMatrixProps {
  findings: ForensicFinding[];
}

const TACTIC_COLUMNS = [
  { id: 'T1204', name: 'User Execution', category: 'Execution' },
  { id: 'T1059', name: 'Command & Scripting', category: 'Execution' },
  { id: 'T1027', name: 'Obfuscation', category: 'Defense Evasion' },
  { id: 'T1218', name: 'System Binary Proxy', category: 'Defense Evasion' },
  { id: 'T1105', name: 'Ingress Tool Transfer', category: 'Command & Control' },
  { id: 'T1021', name: 'Remote Services', category: 'Lateral Movement' },
  { id: 'T1490', name: 'Inhibit Recovery', category: 'Impact' },
];

export const MitreMatrix: React.FC<MitreMatrixProps> = ({ findings }) => {
  const detectedTactics = new Map<string, { count: number; maxScore: number }>();

  findings.forEach((f) => {
    if (f.mitreTactic) {
      TACTIC_COLUMNS.forEach((col) => {
        if (f.mitreTactic.includes(col.id)) {
          const current = detectedTactics.get(col.id) || { count: 0, maxScore: 0 };
          detectedTactics.set(col.id, {
            count: current.count + 1,
            maxScore: Math.max(current.maxScore, f.threatScore || 50),
          });
        }
      });
    }
  });

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
      <div className="mb-4 border-b border-slate-800 pb-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-purple-400">
          <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
          MITRE ATT&amp;CK THREAT TACTIC HEATMAP
        </h3>
        <p className="text-xs text-slate-400">Automated mapping of artifact telemetry to ATT&amp;CK framework techniques</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {TACTIC_COLUMNS.map((col) => {
          const info = detectedTactics.get(col.id);
          const isDetected = !!info && info.count > 0;
          const isHighRisk = info && info.maxScore >= 75;

          return (
            <div
              key={col.id}
              className={`flex flex-col justify-between rounded-lg border p-3 transition-all ${
                isDetected
                  ? isHighRisk
                    ? 'border-red-500/50 bg-red-950/30 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                    : 'border-amber-500/50 bg-amber-950/30 text-amber-300'
                  : 'border-slate-800/80 bg-slate-950/60 text-slate-600'
              }`}
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-75">{col.category}</div>
                <div className="mt-1 font-mono text-xs font-bold">{col.id}</div>
                <div className="mt-0.5 text-[11px] leading-tight font-semibold">{col.name}</div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-current/20 pt-2 text-[10px]">
                <span>STATUS:</span>
                <span className="font-bold font-mono">
                  {isDetected ? `${info.count} HIT(S)` : 'CLEAN'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
