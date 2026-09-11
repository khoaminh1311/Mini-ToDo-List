import TodoItem from './TodoItem'

export default function TodoList({ todos = [], onToggleTodo }) {
  return (
    <section aria-label="Todo list" className="flex-1 mt-5">
      {todos.length === 0 ? (
        /* Empty State */
        <div className="py-20 sm:py-24 flex items-center justify-center text-center">
          <p className="text-sm sm:text-base text-slate-400 select-none">
            No tasks yet. Add one above!
          </p>
        </div>
      ) : (
        /* Render list using .map() */
        <ul className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleTodo={onToggleTodo}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
