import React, { useState, useMemo } from 'react';
import { useEvidence } from '../context/EvidenceContext';
import { TimelineGraph } from '../components/graph/TimelineGraph';
import { exporter } from '../utils/exporter';

const Timeline = () => {
  const { findings, loadSampleCase } = useEvidence();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterArtifact, setFilterArtifact] = useState('ALL');
  const [sortAsc, setSortAsc] = useState(true);

  const artifactTypes = useMemo(() => {
    const set = new Set(findings.map((f) => f.artifactType));
    return ['ALL', ...Array.from(set)];
  }, [findings]);

  const filteredFindings = useMemo(() => {
    return findings
      .filter((f) => {
        if (filterArtifact !== 'ALL' && f.artifactType !== filterArtifact) return false;
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        return (
          f.value.toLowerCase().includes(q) ||
          f.extractedField.toLowerCase().includes(q) ||
          f.sourceFile.toLowerCase().includes(q) ||
          f.mitreTactic.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const ta = a.rawDate ? a.rawDate.getTime() : 0;
        const tb = b.rawDate ? b.rawDate.getTime() : 0;
        return sortAsc ? ta - tb : tb - ta;
      });
  }, [findings, searchTerm, filterArtifact, sortAsc]);

  const handleExportCSV = () => {
    exporter.toCSV(filteredFindings);
  };

  const handleExportJSON = () => {
    exporter.toJSON(filteredFindings);
  };

  const getScoreBadge = (score?: number) => {
    if (score === undefined) return <span className="text-slate-500">N/A</span>;
    if (score > 75) {
      return (
        <span className="rounded-md border border-red-500 bg-red-500/20 px-2 py-0.5 text-xs font-mono font-bold text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
          {score}% CRITICAL
        </span>
      );
    }
    if (score > 40) {
      return (
        <span className="rounded-md border border-amber-500 bg-amber-500/20 px-2 py-0.5 text-xs font-mono font-bold text-amber-400">
          {score}% HIGH
        </span>
      );
    }
    return (
      <span className="rounded-md border border-cyan-500 bg-cyan-500/20 px-2 py-0.5 text-xs font-mono font-bold text-cyan-400">
        {score}% LOW
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-cyan-300 uppercase">
            Forensic Findings &amp; Event Timeline
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Chronological reconstruction of extracted artifact telemetry with heuristic threat scores.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="rounded-md border border-slate-700 bg-slate-900 px-3.5 py-1.5 font-mono text-xs font-semibold text-cyan-400 transition-colors hover:border-cyan-500 hover:bg-slate-800 uppercase"
          >
            Export CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="rounded-md border border-slate-700 bg-slate-900 px-3.5 py-1.5 font-mono text-xs font-semibold text-cyan-400 transition-colors hover:border-cyan-500 hover:bg-slate-800 uppercase"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Timeline Histogram Component */}
      <TimelineGraph findings={findings} />

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search findings (value, field, MITRE)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />

          <select
            value={filterArtifact}
            onChange={(e) => setFilterArtifact(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-cyan-400 focus:outline-none"
          >
            {artifactTypes.map((type) => (
              <option key={type} value={type}>
                Filter: {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>SORT CHRONOLOGY:</span>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="rounded border border-slate-700 bg-slate-950 px-2.5 py-1 font-bold text-cyan-300 hover:border-cyan-400"
          >
            {sortAsc ? 'ASCENDING ▲' : 'DESCENDING ▼'}
          </button>
        </div>
      </div>

      {/* Findings Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/90 font-mono text-[11px] uppercase tracking-widest text-cyan-400">
              <th className="p-3.5 font-semibold">Timestamp</th>
              <th className="p-3.5 font-semibold">Artifact Type</th>
              <th className="p-3.5 font-semibold">Extracted Field</th>
              <th className="p-3.5 font-semibold">Value</th>
              <th className="p-3.5 font-semibold">MITRE Tactic</th>
              <th className="p-3.5 font-semibold">Threat Score</th>
            </tr>
          </thead>
          <tbody>
            {filteredFindings.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500 text-xs">
                  No artifacts match the specified filter or query.{' '}
                  <button onClick={loadSampleCase} className="text-cyan-400 underline font-semibold">
                    Load sample investigation
                  </button>
                </td>
              </tr>
            ) : (
              filteredFindings.map((finding) => (
                <tr
                  key={finding.id}
                  className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/50"
                >
                  <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">{finding.timestamp}</td>
                  <td className="p-3.5 font-semibold text-cyan-300 whitespace-nowrap">{finding.artifactType}</td>
                  <td className="p-3.5 font-semibold text-emerald-400 whitespace-nowrap">{finding.extractedField}</td>
                  <td className="p-3.5 font-mono text-slate-200 break-all max-w-sm" title={finding.value}>
                    {finding.value}
                  </td>
                  <td className="p-3.5 font-mono text-purple-400 whitespace-nowrap">{finding.mitreTactic}</td>
                  <td className="p-3.5 whitespace-nowrap">{getScoreBadge(finding.threatScore)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timeline;