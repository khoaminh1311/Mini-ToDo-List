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
// 1. LocalStorage: Data Loading, Validation & Errors
// ─────────────────────────────────────────────────────────────
describe('LocalStorage — Data Loading, Validation & Errors', () => {
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
    expect(screen.getByText('Done task')).toBeInTheDocument()
  })

  it('shows a storage error banner when setItem throws', async () => {
    const user = userEvent.setup()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    render(<App />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Test task{Enter}')

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/storage is full or disabled/i)).toBeInTheDocument()
  })

  it('closes the storage error banner when X is clicked', async () => {
    const user = userEvent.setup()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    render(<App />)
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Test task{Enter}')

    // Dismiss the banner
    await user.click(screen.getByRole('button', { name: /close warning/i }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// 2. Theme Management & Accessibility
// ─────────────────────────────────────────────────────────────
describe('Theme Management & Accessibility', () => {
  it('reads initial dark theme from localStorage if previously stored', () => {
    localStorage.setItem('todo-theme', 'true')
    render(<App />)

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    const toggleButton = screen.getByRole('button', { name: /switch to light mode/i })
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('updates localStorage and dynamically changes aria attributes when theme is toggled', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Initial state: light mode
    const toggleButton = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(toggleButton).toBeInTheDocument()
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Click to switch to dark mode
    await user.click(toggleButton)
    expect(localStorage.getItem('todo-theme')).toBe('true')
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to light mode')
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Click again to switch back to light mode
    await user.click(toggleButton)
    expect(localStorage.getItem('todo-theme')).toBe('false')
    expect(toggleButton).toHaveAttribute('aria-label', 'Switch to dark mode')
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

// ─────────────────────────────────────────────────────────────
// 3. CRUD — Add Task
// ─────────────────────────────────────────────────────────────
describe('CRUD — Add Task', () => {
  it('adds a new task and clears the input when user types and clicks add button', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)
    const addButton = screen.getByRole('button', { name: /add task/i })

    await user.type(input, 'Write unit tests')
    await user.click(addButton)

    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('adds a new task when user presses Enter key in the input and trims whitespace', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)

    await user.type(input, '   Trimmed task   {Enter}')

    expect(screen.getByText('Trimmed task')).toBeInTheDocument()
    expect(screen.queryByText('   Trimmed task   ')).not.toBeInTheDocument()
    expect(input).toHaveValue('')
  })

  it('does not add an empty or whitespace-only task', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)

    await user.type(input, '     {Enter}') // Whitespace only
    expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// 4. CRUD — Delete Task
// ─────────────────────────────────────────────────────────────
describe('CRUD — Delete Task', () => {
  it('deletes a task when the delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByPlaceholderText(/what needs to be done/i)

    await user.type(input, 'Task to delete{Enter}')

    const deleteBtn = screen.getByRole('button', { name: /delete "Task to delete"/i })
    await user.click(deleteBtn)

    expect(screen.queryByText('Task to delete')).not.toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// 5. CRUD — Edit Task
// ─────────────────────────────────────────────────────────────
describe('CRUD — Edit Task', () => {
  it('saves edited text and trims whitespace when user presses Enter', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Old text{Enter}')
    await user.click(screen.getByRole('button', { name: /edit "Old text"/i }))

    const editInput = screen.getByRole('textbox', { name: /edit task text/i })
    await user.clear(editInput)
    await user.type(editInput, '   New text   {Enter}')

    expect(screen.getByText('New text')).toBeInTheDocument()
    expect(screen.queryByText('Old text')).not.toBeInTheDocument()
  })

  it('saves edited text on blur (clicking outside the input)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Initial text{Enter}')
    await user.click(screen.getByRole('button', { name: /edit "Initial text"/i }))

    const editInput = screen.getByRole('textbox', { name: /edit task text/i })
    await user.clear(editInput)
    await user.type(editInput, 'Saved on blur')

    // Simulate user clicking outside to trigger onBlur
    await user.click(document.body)

    expect(screen.getByText('Saved on blur')).toBeInTheDocument()
    expect(screen.queryByText('Initial text')).not.toBeInTheDocument()
  })

  it('cancels edit and restores original text when user presses Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Original{Enter}')
    await user.click(screen.getByRole('button', { name: /edit "Original"/i }))

    const editInput = screen.getByRole('textbox', { name: /edit task text/i })
    await user.clear(editInput)
    await user.type(editInput, 'Something new{Escape}')

    expect(screen.getByText('Original')).toBeInTheDocument()
    expect(screen.queryByText('Something new')).not.toBeInTheDocument()
  })

  it('does not save and retains original text if edited value is empty or only spaces', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Non-empty{Enter}')
    await user.click(screen.getByRole('button', { name: /edit "Non-empty"/i }))

    const editInput = screen.getByRole('textbox', { name: /edit task text/i })
    await user.clear(editInput)
    await user.type(editInput, '     {Enter}') // Whitespace only

    // Text should remain unchanged
    expect(screen.getByText('Non-empty')).toBeInTheDocument()
  })
})

// ─────────────────────────────────────────────────────────────
// 6. CRUD — Toggle, Progress & Filtering
// ─────────────────────────────────────────────────────────────
describe('CRUD — Toggle, Progress & Filtering', () => {
  it('toggles a task and synchronizes state to localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Toggle me{Enter}')
    
    let storedData = JSON.parse(localStorage.getItem('todos') || '[]')
    expect(storedData).toHaveLength(1)
    expect(storedData[0].completed).toBe(false)

    const checkbox = screen.getByRole('checkbox', { name: /mark "Toggle me"/i })
    await user.click(checkbox)

    expect(checkbox).toHaveAttribute('aria-checked', 'true')
    storedData = JSON.parse(localStorage.getItem('todos') || '[]')
    expect(storedData[0].completed).toBe(true)
  })

  it('updates task completion counter dynamically', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Task 1{Enter}')
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Task 2{Enter}')

    let counterElements = screen.getAllByText((content, element) => element.textContent === '0 of 2 tasks completed')
    expect(counterElements.length).toBeGreaterThan(0)

    await user.click(screen.getByRole('checkbox', { name: /mark "Task 1"/i }))
    counterElements = screen.getAllByText((content, element) => element.textContent === '1 of 2 tasks completed')
    expect(counterElements.length).toBeGreaterThan(0)

    await user.click(screen.getByRole('checkbox', { name: /mark "Task 2"/i }))
    counterElements = screen.getAllByText((content, element) => element.textContent === '2 of 2 tasks completed')
    expect(counterElements.length).toBeGreaterThan(0)
  })

  it('filters to show only active tasks', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Active task{Enter}')
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Completed task{Enter}')

    await user.click(screen.getByRole('checkbox', { name: /mark "Completed task"/i }))
    await user.click(screen.getByRole('button', { name: 'Active' }))

    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument()
  })

  it('filters to show only completed tasks', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Pending task{Enter}')
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Finished task{Enter}')

    await user.click(screen.getByRole('checkbox', { name: /mark "Finished task"/i }))
    await user.click(screen.getByRole('button', { name: 'Completed' }))

    expect(screen.getByText('Finished task')).toBeInTheDocument()
    expect(screen.queryByText('Pending task')).not.toBeInTheDocument()
  })

  it('clears all completed tasks when "Clear completed" is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Keep me{Enter}')
    await user.type(screen.getByPlaceholderText(/what needs to be done/i), 'Remove me{Enter}')

    await user.click(screen.getByRole('checkbox', { name: /mark "Remove me"/i }))
    await user.click(screen.getByRole('button', { name: /clear completed/i }))

    expect(screen.getByText('Keep me')).toBeInTheDocument()
    expect(screen.queryByText('Remove me')).not.toBeInTheDocument()
  })
})
