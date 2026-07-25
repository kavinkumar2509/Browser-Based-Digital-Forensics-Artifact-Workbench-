import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvidence } from '../context/EvidenceContext';
import { AttackGraph } from '../components/graph/AttackGraph';
import { MitreMatrix } from '../components/graph/MitreMatrix';

const Dashboard = () => {
  const navigate = useNavigate();
  const { findings, activeCaseId, loadSampleCase, clearCase } = useEvidence();

  const handleLogout = () => {
    sessionStorage.removeItem('pwndora_findings');
    clearCase();
    navigate('/login');
  };

  const highThreatCount = findings.filter((f) => f.threatScore >= 75).length;
  const parsedFilesCount = new Set(findings.map((f) => f.sourceFile)).size;

  return (
    <div className="flex flex-col gap-6 py-2 min-h-[calc(100vh-3.5rem)]">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-400 tracking-widest">
              CASE: <span className="text-cyan-300 font-bold">{activeCaseId}</span>
            </span>
          </div>
          <button
            onClick={loadSampleCase}
            className="rounded border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:bg-cyan-500/20"
          >
            LOAD SAMPLE INVESTIGATION
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="rounded border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-mono font-semibold tracking-widest text-rose-400 transition-colors hover:bg-rose-500/20"
        >
          LOGOUT / PURGE
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-wider text-cyan-300 uppercase">
          Case Overview // Operations Center
        </h1>
        <p className="text-sm text-slate-400">
          Real-time digital forensics telemetry, automated threat scoring, and interactive graph visualizations.
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-emerald-400/20 text-3xl font-mono font-bold">01</div>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Extracted Findings</p>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-2">{findings.length}</p>
          <p className="text-[10px] text-slate-500 mt-1 tracking-wider">{parsedFilesCount} binary artifact(s) parsed</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-rose-400/20 text-3xl font-mono font-bold">02</div>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Critical Threat Alerts</p>
          <p className="text-2xl font-bold font-mono text-rose-400 mt-2">{highThreatCount.toString().padStart(2, '0')}</p>
          <p className="text-[10px] text-slate-500 mt-1 tracking-wider">Threat Score &gt; 75% detected</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-cyan-400/20 text-3xl font-mono font-bold">03</div>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Parsing Engine</p>
          <p className="text-2xl font-bold font-mono text-cyan-400 mt-2">100% NATIVE</p>
          <p className="text-[10px] text-slate-500 mt-1 tracking-wider">MS-SHLLINK &amp; Prefetch live</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 text-amber-400/20 text-3xl font-mono font-bold">04</div>
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">Attack Network Graph</p>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-2">ACTIVE</p>
          <p className="text-[10px] text-slate-500 mt-1 tracking-wider">Interactive SVG relationships</p>
        </div>
      </div>

      {/* Main Graph Highlight Section */}
      <AttackGraph findings={findings} onSelectFinding={() => navigate('/graph')} />

      {/* System Briefing & Case Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xs font-semibold tracking-widest text-slate-300 uppercase">
                System Briefing &amp; Investigation Directive
              </h2>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              An employee in Accounts Payable received a phishing email containing <code className="text-cyan-300 bg-slate-950 px-1.5 py-0.5 rounded">invoice.lnk</code>.
              Executing the link invoked an obfuscated PowerShell payload. Upload raw artifacts in the Evidence Vault or inspect the interactive Attack Graph to analyze execution flow.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <button
              onClick={() => navigate('/graph')}
              className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-colors"
            >
              &gt; OPEN ATTACK GRAPH VIEW
            </button>
            <button
              onClick={() => navigate('/upload')}
              className="bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700/80 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-colors"
            >
              &gt; LAUNCH EVIDENCE VAULT
            </button>
            <button
              onClick={() => navigate('/timeline')}
              className="bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700/80 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-colors"
            >
              &gt; VIEW TIMELINE LOGS
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
              // Incident Brief &amp; Target Host
            </h2>
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Case Identifier:</span>
                <span className="text-cyan-300">#{activeCaseId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Host Target:</span>
                <span className="text-emerald-400">AP-WORKSTATION-01</span>
              </div>
              <div className="flex flex-col border-b border-slate-800 pb-2 gap-1">
                <span className="text-slate-500">Vector:</span>
                <span className="text-rose-400 leading-relaxed text-right">
                  LNK Phishing Attachment $\rightarrow$ PowerShell Execution $\rightarrow$ Persistence
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[10px] tracking-widest text-slate-600 text-center uppercase">
            100% Client-Side Ingestion // Zero Server Latency
          </div>
        </div>
      </div>

      {/* MITRE Matrix Breakdown */}
      <MitreMatrix findings={findings} />
    </div>
  );
};

export default Dashboard;