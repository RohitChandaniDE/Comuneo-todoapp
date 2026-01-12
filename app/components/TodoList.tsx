import { useState } from 'react';
import { TodoItem } from './TodoItem';
import type { Todo } from '~/types';

interface TodoListProps {
  todos: Todo[];
  onAdd: (parentId: string | null, title: string) => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoList({ todos, onAdd, onToggle, onDelete }: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Get root todos (no parent)
  const rootTodos = todos.filter((t) => !t.parentId);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      setIsAdding(true);
      try {
        await onAdd(null, newTodo.trim());
        setNewTodo('');
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  return (
    <div className="todo-list-container" data-testid="todo-list">
      <div className="add-todo">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="todo-input"
          disabled={isAdding}
        />
        <button
          onClick={handleAddTodo}
          className="btn-add"
          disabled={isAdding || !newTodo.trim()}
        >
          {isAdding ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      {rootTodos.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Add your first task above!</p>
        </div>
      ) : (
        <ul className="todo-list">
          {rootTodos.map((todo) => (
            <TodoItem
              key={todo.$id}
              todo={todo}
              allTodos={todos}
              onAdd={onAdd}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <div className="todo-stats">
          <span>
            {todos.filter((t) => t.completed).length} of {todos.length} tasks completed
          </span>
        </div>
      )}
    </div>
  );
}
