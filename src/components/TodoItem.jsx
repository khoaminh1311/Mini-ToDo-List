export default function TodoItem({ todo }) {
  return (
    <li className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 transition-all">
      {/* Visual checkbox indicator (incomplete for this phase) */}
      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center shrink-0" />

      {/* Task text */}
      <span className="text-sm md:text-base text-slate-700 font-medium break-all">
        {todo.text}
      </span>
    </li>
  )
}
