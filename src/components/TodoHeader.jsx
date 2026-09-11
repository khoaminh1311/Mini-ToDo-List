export default function TodoHeader() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Blue rounded-square check icon */}
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 stroke-[2.5]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          Mini Todo
        </h1>
      </div>

      {/* Theme toggle icon button */}
      <button
        type="button"
        aria-label="Toggle theme"
        className="text-slate-400 hover:text-slate-600 p-2 rounded-lg transition-colors cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 stroke-[1.8]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </button>
    </header>
  )
}
