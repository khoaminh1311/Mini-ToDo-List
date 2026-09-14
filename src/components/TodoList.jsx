import TodoItem from './TodoItem'

export default function TodoList({
  todos = [],
  filter = 'all',
  totalTodosCount = 0,
  editingId,
  onToggleTodo,
  onDeleteTodo,
  onStartEdit,
  onCancelEdit,
  onSaveTodo,
}) {
  // Determine appropriate empty state message
  const getEmptyMessage = () => {
    if (totalTodosCount === 0) return 'No tasks yet. Add one above!'
    if (filter === 'active') return 'No active tasks!'
    if (filter === 'completed') return 'No completed tasks!'
    return 'No tasks yet. Add one above!'
  }

  return (
    <section aria-label="Todo list" className="flex-1 mt-5">
      {todos.length === 0 ? (
        /* Empty State */
        <div className="py-20 sm:py-24 flex items-center justify-center text-center">
          <p className="text-sm sm:text-base text-slate-400 select-none">
            {getEmptyMessage()}
          </p>
        </div>
      ) : (
        /* Render list using .map() */
        <ul className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingId === todo.id}
              onToggleTodo={onToggleTodo}
              onDeleteTodo={onDeleteTodo}
              onStartEdit={onStartEdit}
              onCancelEdit={onCancelEdit}
              onSaveTodo={onSaveTodo}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
