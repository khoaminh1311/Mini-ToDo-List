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

    const newTodo = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      text: trimmedText,
      completed: false, // Starts as incomplete
    }

    setTodos((prevTodos) => [...prevTodos, newTodo])
  }

  // Function to toggle a todo's completed status immutably
  const handleToggleTodo = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  // Derived count for completed todos
  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Centered White Card Container */}
      <main className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_12px_40px_-15px_rgba(0,0,0,0.07)] border border-slate-100 p-6 sm:p-8 flex flex-col">
        <TodoHeader />
        <TodoProgress totalCount={todos.length} completedCount={completedCount} />
        <TodoForm onAddTodo={handleAddTodo} />
        <TodoFilter />
        <TodoList todos={todos} onToggleTodo={handleToggleTodo} />
      </main>
    </div>
  )
}
