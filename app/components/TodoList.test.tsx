import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoList } from '~/components/TodoList';
import type { Todo } from '~/types';

// Mock todos for testing
const mockTodos: Todo[] = [
  {
    $id: '1',
    userId: 'user1',
    title: 'Parent Task',
    completed: false,
    parentId: null,
  },
  {
    $id: '2',
    userId: 'user1',
    title: 'Child Task',
    completed: false,
    parentId: '1',
  },
  {
    $id: '3',
    userId: 'user1',
    title: 'Grandchild Task',
    completed: true,
    parentId: '2',
  },
];

describe('TodoList Component', () => {
  const mockOnAdd = vi.fn().mockResolvedValue(undefined);
  const mockOnToggle = vi.fn().mockResolvedValue(undefined);
  const mockOnDelete = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the todo list container', () => {
    render(
      <TodoList
        todos={[]}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
  });

  it('shows empty state when no todos', () => {
    render(
      <TodoList
        todos={[]}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('renders root todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Parent Task')).toBeInTheDocument();
  });

  it('renders nested todos (recursion)', () => {
    render(
      <TodoList
        todos={mockTodos}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Child Task')).toBeInTheDocument();
    expect(screen.getByText('Grandchild Task')).toBeInTheDocument();
  });

  it('allows adding a new todo', async () => {
    render(
      <TodoList
        todos={[]}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const input = screen.getByPlaceholderText(/What needs to be done/i);
    const addButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith(null, 'New Task');
    });
  });

  it('does not add todo with empty title', async () => {
    render(
      <TodoList
        todos={[]}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const addButton = screen.getByText('Add Task');
    expect(addButton).toBeDisabled();
  });

  it('shows task completion stats', () => {
    render(
      <TodoList
        todos={mockTodos}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // One completed out of three
    expect(screen.getByText(/1 of 3 tasks completed/i)).toBeInTheDocument();
  });

  it('shows completed todo with strikethrough style', () => {
    render(
      <TodoList
        todos={mockTodos}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const completedTask = screen.getByText('Grandchild Task');
    expect(completedTask).toHaveClass('completed');
  });

  it('allows adding todo with Enter key', async () => {
    render(
      <TodoList
        todos={[]}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const input = screen.getByPlaceholderText(/What needs to be done/i);

    fireEvent.change(input, { target: { value: 'New Task' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith(null, 'New Task');
    });
  });
});

describe('TodoItem Component (via TodoList)', () => {
  const mockOnAdd = vi.fn().mockResolvedValue(undefined);
  const mockOnToggle = vi.fn().mockResolvedValue(undefined);
  const mockOnDelete = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('toggles todo completion', async () => {
    render(
      <TodoList
        todos={mockTodos}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockOnToggle).toHaveBeenCalledWith('1', true);
    });
  });

  it('deletes a todo', async () => {
    render(
      <TodoList
        todos={mockTodos}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const deleteButtons = screen.getAllByTitle('Delete task');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  it('shows sub-task input when clicking "+ Sub" button', async () => {
    render(
      <TodoList
        todos={mockTodos}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    const addSubButtons = screen.getAllByTitle('Add sub-task');
    fireEvent.click(addSubButtons[0]);

    expect(screen.getByPlaceholderText(/Enter sub-task title/i)).toBeInTheDocument();
  });

  it('adds a sub-task', async () => {
    render(
      <TodoList
        todos={mockTodos}
        onAdd={mockOnAdd}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    );

    // Click "+ Sub" on first todo
    const addSubButtons = screen.getAllByTitle('Add sub-task');
    fireEvent.click(addSubButtons[0]);

    // Fill in sub-task title
    const subtaskInput = screen.getByPlaceholderText(/Enter sub-task title/i);
    fireEvent.change(subtaskInput, { target: { value: 'New Sub Task' } });

    // Click Add button
    const addButton = screen.getByRole('button', { name: /^Add$/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith('1', 'New Sub Task');
    });
  });
});
