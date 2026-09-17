import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'

// --- Helpers ---
// Reset DOM and localStorage between each test to avoid state leaking
beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

// ─────────────────────────────────────────────────────────────
// 1. LocalStorage: Loading & Validation
// ─────────────────────────────────────────────────────────────
describe('localStorage — loading & validation', () => {
  it('renders with empty list when localStorage has no data', () => {
    render(<App />)
    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })

  it('restores valid todos from localStorage on mount', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([{ id: 'abc-1', text: 'Buy groceries', completed: false }])
    )
    render(<App />)
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
  })

  it('ignores corrupted localStorage data (non-array) and starts fresh', () => {
    // This used to crash the whole app — bug #1 fix verification
    localStorage.setItem('todos', '{}')
    render(<App />)
    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })

  it('ignores null localStorage value and starts fresh', () => {
    localStorage.setItem('todos', 'null')
    render(<App />)
    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })

  it('filters out invalid todo items (missing id or text) from localStorage', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([
        { id: 'good-1', text: 'Valid task', completed: false },
        { text: 'Missing id' },          // no id → should be removed
        { id: 'bad-2' },                  // no text → should be removed
        null,                             // null entry → should be removed
      ])
    )
    render(<App />)
    expect(screen.getByText('Valid task')).toBeInTheDocument()
    expect(screen.queryByText('Missing id')).not.toBeInTheDocument()
  })

  it('coerces completed field to Boolean from localStorage', () => {
    localStorage.setItem(
      'todos',
      JSON.stringify([{ id: 'abc-1', text: 'Done task', completed: 1 }])
    )
    render(<App />)
    // The task should render (completed=true after coercion), not crash
    expect(screen.getByText('Done task')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// 2. CRUD — Add, Delete
// ─────────────────────────────────────────────────────────────
describe('CRUD — add & delete', () => {
  it('adds a new task when user types and submits the form', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    const addButton = screen.getByRole('button', { name: /add task/i })

    await user.type(input, 'Write unit tests')
    await user.click(addButton)

    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
  })

  it('does not add an empty or whitespace-only task', async () => {
    const user = userEvent.setup()
    render(<App />)
    const addButton = screen.getByRole('button', { name: /add task/i })

    await user.click(addButton)
    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })

  it('deletes a task when the delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)

    await user.type(input, 'Task to delete')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    const deleteBtn = screen.getByRole('button', { name: /delete "Task to delete"/i })
    await user.click(deleteBtn)

    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// 3. CRUD — Toggle & Filtering
// ─────────────────────────────────────────────────────────────
describe('CRUD — toggle & filtering', () => {
  it('toggles a task to completed when the checkbox is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Toggle me')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    const checkbox = screen.getByRole('checkbox', { name: /mark "Toggle me"/i })
    await user.click(checkbox)

    expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })

  it('filters to show only active tasks', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Active task')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Completed task')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    // Complete the second task
    await user.click(screen.getByRole('checkbox', { name: /mark "Completed task"/i }))

    // Switch to Active filter — use exact text to avoid matching Edit/Delete buttons of "Active task"
    await user.click(screen.getByRole('button', { name: 'Active' }))

    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument()
  })

  it('clears all completed tasks when "Clear completed" is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Keep me')
    await user.click(screen.getByRole('button', { name: /add task/i }))
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Remove me')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('checkbox', { name: /mark "Remove me"/i }))
    await user.click(screen.getByRole('button', { name: /clear completed/i }))

    expect(screen.getByText('Keep me')).toBeInTheDocument()
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// 4. CRUD — Edit (keyboard: Enter & Escape)
// ─────────────────────────────────────────────────────────────
describe('CRUD — inline edit', () => {
  it('saves edited text when user presses Enter', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Old text')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /edit "Old text"/i }))

    const editInput = screen.getByRole('textbox', { name: /edit task text/i })
    await user.clear(editInput)
    await user.type(editInput, 'New text')
    await user.keyboard('{Enter}')

    expect(screen.getByText('New text')).toBeInTheDocument()
    expect(screen.queryByText('Old text')).not.toBeInTheDocument()
  })

  it('cancels edit and restores original text when user presses Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Original')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /edit "Original"/i }))

    const editInput = screen.getByRole('textbox', { name: /edit task text/i })
    await user.clear(editInput)
    await user.type(editInput, 'Something new')
    await user.keyboard('{Escape}')

    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.queryByText('Something new')).not.toBeInTheDocument()
  })

  it('does not save if the edited text is empty', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Non-empty')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await user.click(screen.getByRole('button', { name: /edit "Non-empty"/i }))

    const editInput = screen.getByRole('textbox', { name: /edit task text/i })
    await user.clear(editInput)
    await user.keyboard('{Enter}')

    // Text should remain unchanged
    expect(screen.getByText('Non-empty')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// 5. localStorage: Write-error handling (Bug #2 fix verification)
// ─────────────────────────────────────────────────────────────
describe('localStorage — write error handling', () => {
  it('shows a storage error banner when setItem throws', async () => {
    const user = userEvent.setup()
    // Simulate storage full / blocked
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    render(<App />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Test task')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/storage is full or disabled/i)).toBeInTheDocument()
  })

  it('closes the storage error banner when X is clicked', async () => {
    const user = userEvent.setup()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    render(<App />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Test task')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    // Dismiss the banner
    await user.click(screen.getByRole('button', { name: /close warning/i }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
