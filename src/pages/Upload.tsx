import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvidence } from '../context/EvidenceContext';

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFiles, errors, loadSampleCase } = useEvidence();

  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('');

  const processFileList = async (files: FileList | File[]) => {
    setIsLoading(true);
    setStatusText(`Parsing ${files.length} file(s) client-side...`);

    try {
      await handleFiles(files);
      setStatusText('Binary extraction complete! Redirecting to Forensic Graph...');
      setTimeout(() => {
        setIsLoading(false);
        navigate('/graph');
      }, 600);
    } catch (e) {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFileList(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFileList(e.dataTransfer.files);
    }
  };

  const handleSampleClick = () => {
    loadSampleCase();
    navigate('/graph');
  };

  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-xl font-bold tracking-wide text-cyan-300">
          Client-Side Evidence Vault (100% Browser Native)
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Drop Windows Shell Link shortcuts (.lnk) or Prefetch files (.pf) for real-time binary parsing.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept=".lnk,.pf,.evtx"
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`group relative flex w-full max-w-4xl cursor-pointer flex-col items-center justify-center rounded-2xl border-[3px] border-dashed p-12 transition-all duration-300 ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : isLoading
            ? 'pointer-events-none border-emerald-500 bg-emerald-500/[.04]'
            : 'border-slate-700 bg-slate-900/50 hover:border-emerald-500'
        }`}
        style={{ minHeight: '320px' }}
      >
        {!isLoading ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              ⚡
            </div>
            <p className="text-base font-bold tracking-wider text-slate-200 uppercase">
              DROP FORENSIC ARTIFACT HERE
            </p>
            <p className="mt-2 text-xs text-slate-400">
              or <span className="text-emerald-400 underline font-semibold">click to browse</span> — .lnk / .pf / .evtx
            </p>
            <span className="mt-5 inline-block rounded border border-slate-800 bg-slate-950 px-3.5 py-1.5 font-mono text-[11px] font-semibold text-cyan-400">
              ZERO SERVER UPLOAD // 100% LOCAL BROWSER INGESTION
            </span>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-3 border-emerald-400 border-t-transparent" />
            <p className="text-sm font-medium text-emerald-300">{statusText}</p>
          </div>
        )}
      </div>

      {/* Parse Errors Panel if any */}
      {errors.length > 0 && (
        <div className="mt-6 w-full max-w-4xl rounded-xl border border-red-500/40 bg-red-950/30 p-4 text-xs text-red-300">
          <div className="font-bold text-red-400 uppercase tracking-wider mb-2">⚠ PARSE WARNINGS / ERRORS</div>
          {errors.map((err, idx) => (
            <div key={idx} className="font-mono mt-1">
              <span className="font-bold text-slate-200">{err.file}:</span> {err.message}
            </div>
          ))}
        </div>
      )}

      {/* Quick Sample Action for Demo / Judges */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={handleSampleClick}
          className="flex items-center gap-2 rounded-lg border border-cyan-400/50 bg-cyan-400/10 px-5 py-2.5 font-mono text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-400/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
        >
          <span>⚡ LOAD SAMPLE PHISHING INVESTIGATION CASE</span>
        </button>
      </div>
    </section>
  );
};

export default Upload;