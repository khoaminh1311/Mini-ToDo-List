export default function TodoProgress({ completedCount = 0, totalCount = 0 }) {

  return (
    <section className="mt-6 sm:mt-7" aria-label="Task progress">
      <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
        <div>
          <span className="text-blue-600 dark:text-blue-500 font-bold">{completedCount}</span> of{' '}
          <span className="text-blue-600 dark:text-blue-500 font-bold">{totalCount}</span> tasks completed
        </div>
      </div>

      <div className="mt-2.5 h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          role="progressbar"
        />
      </div>
    </section>
  )
}
