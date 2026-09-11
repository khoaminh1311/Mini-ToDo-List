import { useState } from 'react'
import TodoHeader from './components/TodoHeader'
import TodoProgress from './components/TodoProgress'
import TodoForm from './components/TodoForm'
import TodoFilter from './components/TodoFilter'
import TodoList from './components/TodoList'

export default function App() {
  // Main state holding the list of todos
  const [todos, setTodos] = useState([])

  // State tracking which todo is currently being edited (null when no todo is being edited)
  const [editingId, setEditingId] = useState(null)

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

  // Function to delete a todo by id immutably using filter()
  const handleDeleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
    if (editingId === id) {
      setEditingId(null)
    }
  }

  // Start editing a specific todo (ensures only one is edited at a time)
  const handleStartEdit = (id) => {
    setEditingId(id)
  }

  // Cancel editing mode
  const handleCancelEdit = () => {
    setEditingId(null)
  }

  // Save the edited todo text immutably
  const handleSaveTodo = (id, newText) => {
    const trimmedText = newText.trim()
    if (!trimmedText) return

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: trimmedText } : todo
      )
    )
    setEditingId(null)
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
        <TodoList
          todos={todos}
          editingId={editingId}
          onToggleTodo={handleToggleTodo}
          onDeleteTodo={handleDeleteTodo}
          onStartEdit={handleStartEdit}
          onCancelEdit={handleCancelEdit}
          onSaveTodo={handleSaveTodo}
        />
      </main>
    </div>
  )
}
