import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { EvidenceProvider } from './context/EvidenceContext';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Upload from './pages/Upload';
import GraphView from './pages/GraphView';
import Notes from './pages/Notes';
import Report from './pages/Report';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const App = () => {
  const [aiEngineActive, setAiEngineActive] = useState<boolean>(true);
  const [systemStatus, setSystemStatus] = useState<string>('INITIALIZING...');

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setSystemStatus('SYSTEM ONLINE');
    }, 1200);

    return () => clearTimeout(bootTimer);
  }, []);

  const toggleAiEngine = () => {
    setAiEngineActive((prev) => !prev);
  };

  return (
    <EvidenceProvider>
      <HashRouter>
        <div className="relative min-h-screen w-full bg-slate-950 font-mono text-slate-200 overflow-hidden">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[150px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[150px]" />

          {/* Fixed header */}
          <header className="fixed top-0 left-0 z-50 flex h-14 w-full items-center justify-between border-b border-slate-800 bg-slate-950/90 px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold tracking-widest text-cyan-300">
                PWNDORA DFIR WORKBENCH
              </span>
              <span
                className={`text-xs tracking-wide ${
                  systemStatus === 'SYSTEM ONLINE' ? 'text-emerald-400' : 'text-amber-400 animate-pulse'
                }`}
              >
                ● {systemStatus}
              </span>
            </div>

            <button
              onClick={toggleAiEngine}
              className={`rounded border px-3 py-1 text-xs font-semibold tracking-wide transition-colors ${
                aiEngineActive
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                  : 'border-slate-700 bg-slate-900 text-slate-400'
              }`}
            >
              HEURISTIC AI ENGINE: {aiEngineActive ? 'ACTIVE (99% CAP)' : 'STANDBY'}
            </button>
          </header>

          {/* Main content */}
          <div className="relative z-10 pt-14">
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="upload" element={<Upload />} />
                <Route path="graph" element={<GraphView />} />
                <Route path="timeline" element={<Timeline />} />
                <Route path="notes" element={<Notes />} />
                <Route path="report" element={<Report />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </div>
        </div>
      </HashRouter>
    </EvidenceProvider>
  );
};

export default App;