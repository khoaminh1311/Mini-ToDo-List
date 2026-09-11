import { useState } from 'react'
import TodoHeader from './components/TodoHeader'
import TodoProgress from './components/TodoProgress'
import TodoForm from './components/TodoForm'
import TodoFilter from './components/TodoFilter'
import TodoList from './components/TodoList'

export default function App() {
  // Main state holding the list of todos
  const [todos, setTodos] = useState([])

  // Function to create a new todo and append it to the todos state
  const handleAddTodo = (text) => {
    const trimmedText = text.trim()
    if (!trimmedText) return

    // 1. Create a new todo object
    const newTodo = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text: trimmedText,
      completed: false, // Starts as incomplete
    }

    // 2. Update array state immutably using the spread operator
    setTodos((prevTodos) => [...prevTodos, newTodo])
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Centered White Card Container */}
      <main className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_12px_40px_-15px_rgba(0,0,0,0.07)] border border-slate-100 p-6 sm:p-8 flex flex-col">
        <TodoHeader />
        <TodoProgress totalCount={todos.length} completedCount={0} />
        <TodoForm onAddTodo={handleAddTodo} />
        <TodoFilter />
        <TodoList todos={todos} />
      </main>
    </div>
  )
}
