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
      className="mt-5 flex items-center gap-2.5"
    >
      {filters.map((filter) => {
        const isActive = currentFilter === filter.id

        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onFilterChange(filter.id)}
            className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}
