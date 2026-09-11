export default function TodoFilter() {
  return (
    <div
      role="group"
      aria-label="Filter tasks"
      className="mt-5 flex items-center gap-2.5"
    >
      <button
        type="button"
        aria-pressed="true"
        className="bg-slate-900 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer"
      >
        All
      </button>

      <button
        type="button"
        aria-pressed="false"
        className="bg-slate-100/90 text-slate-600 hover:bg-slate-200 text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer"
      >
        Active
      </button>

      <button
        type="button"
        aria-pressed="false"
        className="bg-slate-100/90 text-slate-600 hover:bg-slate-200 text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer"
      >
        Completed
      </button>
    </div>
  )
}
