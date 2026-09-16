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
  return (
    <section aria-label="Todo list" className="flex-1 mt-4 sm:mt-5">
      {todos.length === 0 ? (
        /* Original Clean Empty State */
        <div className="py-20 sm:py-24 flex items-center justify-center text-center">
          <p className="text-sm sm:text-base text-slate-400 dark:text-slate-500 select-none">
            No tasks yet. Add one above!
          </p>
        </div>
      ) : (
        /* Render list using .map() with equal 0 padding on both sides */
        <ul className="space-y-2 sm:space-y-2.5 max-h-[380px] sm:max-h-[420px] overflow-y-auto px-0 py-1 scroll-smooth">
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

      {/* Status tracking total tasks */}
      {totalTodosCount > 0 && (
        <div className="mt-5 sm:mt-6 flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium px-1">
          <span>
            {totalTodosCount} {totalTodosCount === 1 ? 'task' : 'tasks'} total
          </span>
        </div>
      )}
    </section>
  )
}
