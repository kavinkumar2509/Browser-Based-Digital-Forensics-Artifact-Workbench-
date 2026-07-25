import React from 'react';
import { NavLink } from 'react-router-dom';

// We map out the exact paths to match your App.tsx routes
const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'File Upload', path: '/upload' },
  { label: 'Forensic Timeline', path: '/timeline' },
  { label: 'Analyst Notes', path: '/notes' }, 
  { label: 'Export Report', path: '/report' }
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col font-mono">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-emerald-400 tracking-wider">PWNDORA</h1>
        <p className="text-xs text-slate-500 mt-1">DFIR Module // v1.0</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.path} 
            className={({ isActive }) => 
              `block px-4 py-3 rounded-md transition-colors border ${
                isActive 
                  ? 'bg-slate-900 text-cyan-400 border-slate-700' // Highlight the active page
                  : 'border-transparent hover:bg-slate-900 hover:text-cyan-400 hover:border-slate-700 text-slate-400'
              }`
            }
          >
            &gt; {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-semibold text-slate-400">Analyst: Team Karur</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;