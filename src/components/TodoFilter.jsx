export default function TodoFilter({ currentFilter = 'all', onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ]

  return (
    <div
      role="group"
      aria-label="Filter tasks"
      className="mt-5 flex items-center gap-2 sm:gap-2.5"
    >
      {filters.map((filter) => {
        const isActive = currentFilter === filter.id

        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange(filter.id)}
            className={`text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm shadow-slate-900/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
            }`}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
