interface NavbarProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Navbar({ toggleSidebar, isSidebarOpen }: NavbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={isSidebarOpen}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-800 text-slate-300 transition-colors hover:bg-slate-800 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex min-w-0 items-center gap-2" aria-label="System status: client-side engine active">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="truncate font-mono text-xs text-slate-400 sm:text-sm">Client-Side Engine Active</span>
        </div>
      </div>

      <div className="ml-4 flex items-center gap-4">
        <span className="hidden rounded-md border border-slate-800 px-2.5 py-1 font-mono text-xs text-cyan-400 sm:inline-flex">
          PWNDORA v2.6.0
        </span>
        <div className="flex items-center gap-2.5">
          <div className="hidden text-right sm:block">
            <p className="font-mono text-xs font-medium text-slate-200">Analyst Mode</p>
            <p className="font-mono text-[10px] text-slate-500">LOCAL SESSION</p>
          </div>
          <div className="rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 p-[2px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-cyan-300">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm0 2.125c-4.14 0-7.5 2.35-7.5 5.25v1.125h15v-1.125c0-2.9-3.36-5.25-7.5-5.25Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
