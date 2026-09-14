import { useState, useEffect } from 'react'
import TodoHeader from './components/TodoHeader'
import TodoProgress from './components/TodoProgress'
import TodoForm from './components/TodoForm'
import TodoFilter from './components/TodoFilter'
import TodoList from './components/TodoList'

export default function App() {
  // 1. Original todos state holding all created tasks
  const [todos, setTodos] = useState(() => {
    try {
      const savedTodos = localStorage.getItem('todos')
      if (savedTodos) {
        return JSON.parse(savedTodos)
      }
    } catch (error) {
      console.error('Failed to parse todos from localStorage', error)
    }
    return []
  })

  // Save effect: Runs whenever the `todos` state changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // 2. Filter state: 'all' | 'active' | 'completed'
  const [filter, setFilter] = useState('all')

  // 3. Editing state: id of todo currently being edited
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

  // Start editing a specific todo
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

  // Derived data: filter todos according to current filter ('all' | 'active' | 'completed')
  // The original `todos` state is NEVER modified here.
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // Derived count for completed todos (derived from the original todos state)
  const completedCount = todos.filter((todo) => todo.completed).length

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Centered White Card Container */}
      <main className="w-full max-w-[480px] bg-white rounded-3xl shadow-[0_12px_40px_-15px_rgba(0,0,0,0.07)] border border-slate-100 p-6 sm:p-8 flex flex-col">
        <TodoHeader />
        <TodoProgress totalCount={todos.length} completedCount={completedCount} />
        <TodoForm onAddTodo={handleAddTodo} />
        <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
        <TodoList
          todos={filteredTodos}
          filter={filter}
          totalTodosCount={todos.length}
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
