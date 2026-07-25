import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/80 p-8 backdrop-blur-md shadow-2xl text-center">
        <h2 className="text-2xl font-bold tracking-widest text-emerald-400 mb-2">PWNDORA</h2>
        <p className="text-xs text-slate-400 font-mono mb-8 uppercase tracking-widest border-b border-slate-800 pb-4">
          Restricted DFIR Access
        </p>
        
        <p className="text-sm text-rose-400 font-mono mb-8 animate-pulse">
          SESSION PURGED SUCCESSFULLY
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full rounded-md border border-cyan-500/30 bg-cyan-500/10 py-3 text-xs font-bold tracking-widest text-cyan-300 transition-colors hover:bg-cyan-500/20"
        >
          INITIALIZE NEW SESSION
        </button>
      </div>
    </div>
  );
};

export default Login;