export default function TodoItem({ todo, onToggleTodo }) {
  return (
    <li className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 transition-all">
      {/* Checkbox button to toggle completed status */}
      <button
        type="button"
        role="checkbox"
        aria-checked={todo.completed}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        onClick={() => onToggleTodo(todo.id)}
        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
          todo.completed
            ? 'bg-blue-600 border-2 border-blue-600 text-white'
            : 'border-2 border-slate-300 hover:border-blue-400 bg-transparent'
        }`}
      >
        {/* Conditional rendering: show checkmark icon only when completed */}
        {todo.completed && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3 h-3 stroke-[3]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      {/* Task text with conditional styling for completed state */}
      <span
        className={`text-sm md:text-base font-medium break-all transition-all ${
          todo.completed ? 'text-slate-400 line-through' : 'text-slate-700'
        }`}
      >
        {todo.text}
      </span>
    </li>
  )
}
