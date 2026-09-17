export default function TodoHeader({ isDarkMode, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Blue rounded-square check icon */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20 transition-transform duration-200 hover:scale-105">
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
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            Mini Todo
          </h1>
        </div>
      </div>

      {/* Theme toggle icon button */}
      <button
        type="button"
        onClick={onToggleTheme}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-pressed={isDarkMode}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-xl transition-all duration-150 active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400"
      >
        {isDarkMode ? (
          /* Sun icon for dark mode */
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
        ) : (
          /* Moon icon for light mode */
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-5 h-5 stroke-[1.8]"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </button>
    </header>
  )
}
