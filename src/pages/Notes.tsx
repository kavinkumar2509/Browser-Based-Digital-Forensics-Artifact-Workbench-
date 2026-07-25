import React, { useState } from 'react';
import { useEvidence } from '../context/EvidenceContext';

interface ThreatItem {
  id: string;
  indicator: string;
  type: 'IP Address' | 'File Hash' | 'Domain' | 'Executable';
  artifact: string;
  mitre: string;
  status: 'Verified' | 'Pending';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}

const Notes = () => {
  const { findings, notes, addNote, deleteNote } = useEvidence();

  const [threats, setThreats] = useState<ThreatItem[]>([
    {
      id: '1',
      indicator: 'powershell.exe',
      type: 'Executable',
      artifact: 'invoice.lnk',
      mitre: 'T1059.001',
      status: 'Verified',
      severity: 'CRITICAL',
    },
    {
      id: '2',
      indicator: '192.168.1.145',
      type: 'IP Address',
      artifact: 'Security.evtx',
      mitre: 'T1021.001',
      status: 'Verified',
      severity: 'WARNING',
    },
    {
      id: '3',
      indicator: 'update_agent.exe',
      type: 'Executable',
      artifact: 'POWERSHELL.EXE.PF',
      mitre: 'T1105',
      status: 'Verified',
      severity: 'CRITICAL',
    },
  ]);

  const [newIndicator, setNewIndicator] = useState('');
  const [newType, setNewType] = useState<'IP Address' | 'File Hash' | 'Domain' | 'Executable'>('File Hash');
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'WARNING' | 'INFO'>('CRITICAL');

  const [selectedFindingId, setSelectedFindingId] = useState('');
  const [mitreCode, setMitreCode] = useState('T1204.002 - User Execution');
  const [noteText, setNoteText] = useState('');

  const handleAddIoC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIndicator.trim()) return;

    const newItem: ThreatItem = {
      id: Date.now().toString(),
      indicator: newIndicator.trim(),
      type: newType,
      artifact: 'Manual Entry',
      mitre: 'Pending',
      status: 'Pending',
      severity: newSeverity,
    };

    setThreats([newItem, ...threats]);
    setNewIndicator('');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addNote(selectedFindingId || null, noteText.trim(), mitreCode);
    setNoteText('');
  };

  return (
    <div className="flex flex-col gap-6 py-2 min-h-[calc(100vh-3.5rem)]">
      <div>
        <h1 className="text-xl font-bold tracking-wider text-cyan-300 uppercase">
          Threat Intel &amp; Analyst Scratchpad
        </h1>
        <p className="text-sm text-slate-400">
          Isolate Indicators of Compromise (IoCs) and log tactical analyst observations linked to parsed findings.
        </p>
      </div>

      {/* IOC Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-slate-500">Total IOCs</p>
          <h2 className="mt-2 text-3xl font-bold text-cyan-400">{threats.length}</h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-slate-500">Critical</p>
          <h2 className="mt-2 text-3xl font-bold text-rose-400">
            {threats.filter((t) => t.severity === 'CRITICAL').length}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-slate-500">Warning</p>
          <h2 className="mt-2 text-3xl font-bold text-amber-400">
            {threats.filter((t) => t.severity === 'WARNING').length}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-slate-500">Logged Analyst Notes</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-400">{notes.length}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: IoC Log and Feed */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Add IoC Form */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
              // Log New Indicator of Compromise (IoC)
            </h2>
            <form onSubmit={handleAddIoC} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Enter Hash, IP, Domain, or Exe..."
                value={newIndicator}
                onChange={(e) => setNewIndicator(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="File Hash">File Hash</option>
                <option value="Executable">Executable</option>
                <option value="IP Address">IP Address</option>
                <option value="Domain">Domain</option>
              </select>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="CRITICAL">Critical</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
              </select>
              <button
                type="submit"
                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 px-5 py-2 rounded-lg text-sm font-semibold tracking-wide transition-colors"
              >
                LOG IOC
              </button>
            </form>
          </div>

          {/* IOC Investigation Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden backdrop-blur-sm">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex justify-between items-center">
              <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                IOC Investigation Table
              </h2>
              <span className="text-xs text-slate-500">{threats.length} Indicators</span>
            </div>

            <table className="w-full text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-left uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-4 py-3">IOC</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Artifact</th>
                  <th className="px-4 py-3">MITRE</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Severity</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((item) => (
                  <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition">
                    <td className="px-4 py-3 font-mono text-cyan-300 font-bold">{item.indicator}</td>
                    <td className="px-4 py-3 text-slate-400">{item.type}</td>
                    <td className="px-4 py-3 text-slate-400">{item.artifact}</td>
                    <td className="px-4 py-3 text-purple-400 font-mono">{item.mitre}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.severity === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-400'
                            : item.severity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Logged Notes Feed */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur-sm">
            <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
              // Logged Analyst Notes ({notes.length})
            </h2>

            {notes.length === 0 ? (
              <div className="text-xs text-slate-500 italic py-4 text-center">
                No analyst notes logged yet. Use the form on the right to log observations.
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3.5 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <span className="font-mono text-purple-400 font-bold">{note.mitreCode}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500">{new Date(note.timestamp).toLocaleString()}</span>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-slate-500 hover:text-red-400 text-[10px] font-bold"
                        >
                          [DELETE]
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-slate-300 font-mono leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Note Form */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col backdrop-blur-sm">
            <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
              // Log Analyst Observation
            </h2>

            <form onSubmit={handleSaveNote} className="flex flex-col gap-3">
              <select
                value={selectedFindingId}
                onChange={(e) => setSelectedFindingId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="">Link Finding (Optional)...</option>
                {findings.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.artifactType} — {f.extractedField}: {f.value.slice(0, 30)}...
                  </option>
                ))}
              </select>

              <select
                value={mitreCode}
                onChange={(e) => setMitreCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value="T1204.002 - User Execution: Malicious File">T1204.002 - User Execution</option>
                <option value="T1059.001 - PowerShell">T1059.001 - PowerShell Execution</option>
                <option value="T1105 - Ingress Tool Transfer">T1105 - Ingress Tool Transfer</option>
                <option value="T1218.011 - System Binary Proxy (Rundll32)">T1218.011 - Rundll32 Proxy</option>
                <option value="T1021.001 - Remote Services (RDP)">T1021.001 - Remote Desktop (RDP)</option>
              </select>

              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Log tactical analyst finding..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-400 resize-none min-h-[140px]"
              />

              <button
                type="submit"
                className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-colors w-full uppercase"
              >
                LOG NOTE TO INCIDENT RECORD
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;