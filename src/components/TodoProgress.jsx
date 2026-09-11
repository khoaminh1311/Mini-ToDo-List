export default function TodoProgress({ completedCount = 0, totalCount = 0 }) {
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <section className="mt-7">
      <div className="text-sm font-medium text-slate-500">
        <span className="text-blue-600 font-semibold">{completedCount}</span> of{' '}
        <span className="text-blue-600 font-semibold">{totalCount}</span> completed
      </div>
      <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </section>
  )
}
