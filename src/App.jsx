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

  // 3. Theme state: Load from localStorage or default to false (Light mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('todo-theme')
      if (savedTheme !== null) {
        return JSON.parse(savedTheme)
      }
    } catch (error) {
      console.error('Failed to parse theme from localStorage', error)
    }
    return false // Default to light mode
  })

  // Theme effect: Save to localStorage and toggle 'dark' class on <html>
  useEffect(() => {
    localStorage.setItem('todo-theme', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

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
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-slate-900 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 md:p-8 overflow-x-hidden transition-colors duration-200">
      {/* Centered White Card Container with stable min-height and symmetrical padding */}
      <main className="w-full max-w-[480px] mx-auto min-h-[480px] sm:min-h-[520px] bg-white dark:bg-slate-800 rounded-3xl shadow-[0_16px_45px_-15px_rgba(0,0,0,0.07)] border border-slate-100 dark:border-slate-700 p-5 sm:p-7 md:p-8 flex flex-col transition-colors duration-200">
        <TodoHeader 
          isDarkMode={isDarkMode} 
          onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
        />
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
