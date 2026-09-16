import { useState } from 'react'

export default function TodoItem({
  todo,
  isEditing,
  onToggleTodo,
  onDeleteTodo,
  onStartEdit,
  onCancelEdit,
  onSaveTodo,
}) {
  // Local state for the controlled input during editing
  const [draftText, setDraftText] = useState(todo.text)

  // Switch to edit mode and populate draft text with current todo text
  const handleEditClick = () => {
    setDraftText(todo.text)
    onStartEdit(todo.id)
  }

  // Cancel editing and discard any unsaved changes
  const handleCancelClick = () => {
    setDraftText(todo.text)
    onCancelEdit()
  }

  // Save changes on form submit (clicking Save or pressing Enter)
  const handleSaveSubmit = (e) => {
    e.preventDefault()
    const trimmed = draftText.trim()

    // If text is empty or whitespace-only, cancel edit mode instead of doing nothing
    if (!trimmed) {
      handleCancelClick()
      return
    }

    onSaveTodo(todo.id, trimmed)
  }

  return (
    <li className="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50/70 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-100 hover:border-slate-200/80 dark:border-slate-700/80 dark:hover:border-slate-600 hover:shadow-xs transition-all duration-150 group">
      {isEditing ? (
        /* Editing Mode Form */
        <form onSubmit={handleSaveSubmit} className="flex items-center gap-1.5 sm:gap-2 w-full">
          <input
            type="text"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleCancelClick()
            }}
            autoFocus
            aria-label="Edit task text"
            className="flex-1 min-w-0 px-3 py-1.5 bg-white dark:bg-slate-800 border border-blue-500 rounded-xl text-sm sm:text-base text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/20 transition-all shadow-xs"
          />
          <button
            type="submit"
            aria-label="Save changes"
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs sm:text-sm font-semibold transition-all duration-150 shadow-xs cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancelClick}
            aria-label="Cancel editing"
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-700 dark:hover:bg-slate-600 active:scale-95 text-slate-600 dark:text-slate-300 dark:hover:text-slate-100 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-slate-900"
          >
            Cancel
          </button>
        </form>
      ) : (
        /* Normal View Mode */
        <>
          {/* Checkbox button to toggle completed status */}
          <button
            type="button"
            role="checkbox"
            aria-checked={todo.completed}
            aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
            onClick={() => onToggleTodo(todo.id)}
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 cursor-pointer active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${todo.completed
                ? 'bg-blue-600 border-2 border-blue-600 text-white shadow-xs'
                : 'border-2 border-slate-300 dark:border-slate-500 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 bg-white dark:bg-slate-800'
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

          {/* Task text with proper word breaking and strike-through */}
          <span
            className={`flex-1 min-w-0 text-sm sm:text-base font-normal leading-relaxed break-words [overflow-wrap:anywhere] transition-all duration-200 ${todo.completed
                ? 'text-slate-400 line-through decoration-slate-300 dark:text-slate-500 dark:decoration-slate-600'
                : 'text-slate-700 dark:text-slate-200'
              }`}
          >
            {todo.text}
          </span>

          <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
            {/* Edit button */}
            <button
              type="button"
              aria-label={`Edit "${todo.text}"`}
              onClick={handleEditClick}
              className="text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 dark:hover:bg-slate-700 active:scale-90 p-1.5 rounded-lg transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 stroke-[2]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            {/* Delete button */}
            <button
              type="button"
              aria-label={`Delete "${todo.text}"`}
              onClick={() => onDeleteTodo(todo.id)}
              className="text-slate-400 hover:text-red-500 hover:bg-red-50/80 dark:hover:bg-slate-700 active:scale-90 p-1.5 rounded-lg transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 stroke-[2]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </>
      )}
    </li>
  )
}
