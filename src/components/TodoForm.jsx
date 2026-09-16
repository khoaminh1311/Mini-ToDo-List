import { useState } from 'react'

export default function TodoForm({ onAddTodo }) {
  // State for the controlled input
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    // Prevent adding empty or whitespace-only tasks
    if (!text.trim()) return

    // Call parent handler to create and add the new todo
    onAddTodo(text)

    // Clear the input field
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-1.5 pl-4 sm:pl-5 focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-blue-500/20 transition-all duration-200 shadow-xs">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="What needs to be done?"
          className="w-full bg-transparent text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none py-1"
        />
        <button
          type="submit"
          aria-label="Add task"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center shrink-0 transition-all duration-150 shadow-sm shadow-blue-500/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 stroke-[2.5]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </form>
  )
}
