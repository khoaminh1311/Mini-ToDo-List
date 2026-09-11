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
    <form onSubmit={handleSubmit} className="mt-6">
      <div className="flex items-center justify-between bg-slate-50/90 border border-slate-100 rounded-2xl p-1.5 pl-4 sm:pl-5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="What needs to be done?"
          className="w-full bg-transparent text-sm md:text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Add task"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-400 hover:bg-indigo-500 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm cursor-pointer"
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
