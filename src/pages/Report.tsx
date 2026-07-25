import React from 'react';
import { useEvidence } from '../context/EvidenceContext';
import { exporter } from '../utils/exporter';

const Report = () => {
  const { findings, notes, activeCaseId } = useEvidence();

  const highThreatCount = findings.filter((f) => f.threatScore >= 75).length;
  const artifactFilesCount = new Set(findings.map((f) => f.sourceFile)).size;

  const handleExportCSV = () => exporter.toCSV(findings);
  const handleExportJSON = () => exporter.toJSON(findings);
  const handlePrint = () => window.print();

  return (
    <div className="mx-auto max-w-5xl space-y-6 text-slate-200">
      {/* Executive Briefing Card */}
      <div className="rounded-xl border border-cyan-500/40 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="rounded border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-300">
              Scenario: OPERATION PHISHING TRIAGE
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-wide text-slate-100">
              Executive Forensic Incident Report
            </h1>
          </div>
          <div className="text-right font-mono text-xs text-slate-400">
            <p>
              Case Identifier: <span className="font-bold text-cyan-300">#{activeCaseId}</span>
            </p>
            <p className="mt-1">
              Status: <span className="font-bold text-emerald-400">Triage &amp; Graph Complete</span>
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs leading-relaxed text-slate-300">
          <p>
            <strong>SITREP Summary:</strong> An automated phishing attack was launched targeting employee workstation{' '}
            <code className="text-cyan-300">AP-WORKSTATION-01</code>. The user executed a malicious link shortcut artifact (
            <code className="text-cyan-300">invoice.lnk</code>) triggering an obfuscated PowerShell payload. Client-side binary
            parsing of Windows Shell Link headers and Prefetch traces confirmed subsequent execution and dropped payloads.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4 text-xs sm:grid-cols-4">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[10px]">Extracted Findings</span>
            <p className="font-mono text-xl font-bold text-cyan-300">{findings.length}</p>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-bold text-[10px]">Critical Threat Alerts</span>
            <p className="font-mono text-xl font-bold text-rose-400">{highThreatCount}</p>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-bold text-[10px]">Parsed Artifact Files</span>
            <p className="font-mono text-xl font-bold text-emerald-400">{artifactFilesCount}</p>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-bold text-[10px]">Analyst Notes Logged</span>
            <p className="font-mono text-xl font-bold text-purple-400">{notes.length}</p>
          </div>
        </div>
      </div>

      {/* Export & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-base font-bold uppercase tracking-wider text-cyan-300">
          Evidence Handoff &amp; Export Controls
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 font-mono text-xs font-bold text-slate-300 transition-colors hover:bg-slate-800"
          >
            PRINT / SAVE PDF
          </button>
          <button
            onClick={handleExportCSV}
            className="rounded-lg border border-cyan-500/50 bg-cyan-500/10 px-4 py-2 font-mono text-xs font-bold text-cyan-300 transition-colors hover:bg-cyan-500/20"
          >
            DOWNLOAD CSV REPORT
          </button>
          <button
            onClick={handleExportJSON}
            className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-2 font-mono text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
          >
            DOWNLOAD JSON REPORT
          </button>
        </div>
      </div>

      {/* Analyst Notes Logged Section */}
      {notes.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
            // Analyst Tactical Observations ({notes.length})
          </h3>
          <div className="space-y-3">
            {notes.map((n) => (
              <div key={n.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-xs">
                <div className="flex justify-between font-mono text-purple-400 font-bold mb-1">
                  <span>{n.mitreCode}</span>
                  <span className="text-slate-500 text-[10px]">{new Date(n.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-slate-300 font-mono">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured JSON Telemetry Output */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          // Raw Forensic Telemetry Output ({findings.length} findings)
        </h3>
        <pre className="max-h-80 overflow-auto rounded border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-emerald-400">
          {JSON.stringify({ caseId: activeCaseId, findings, notes }, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Report;