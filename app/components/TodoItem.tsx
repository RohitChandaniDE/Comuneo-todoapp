import { useState } from 'react';
import type { Todo } from '~/types';

interface TodoItemProps {
  todo: Todo;
  allTodos: Todo[];
  onAdd: (parentId: string, title: string) => Promise<void>;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  depth?: number;
}

export function TodoItem({
  todo,
  allTodos,
  onAdd,
  onToggle,
  onDelete,
  depth = 0,
}: TodoItemProps) {
  const [newSubTask, setNewSubTask] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Find children of this todo (RECURSION!)
  const children = allTodos.filter((t) => t.parentId === todo.$id);

  const handleAddSubTask = async () => {
    if (newSubTask.trim()) {
      setIsLoading(true);
      try {
        await onAdd(todo.$id, newSubTask.trim());
        setNewSubTask('');
        setShowInput(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSubTask();
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setNewSubTask('');
    }
  };

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      await onToggle(todo.$id, !todo.completed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(todo.$id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="todo-item" data-testid={`todo-item-${todo.$id}`}>
      <div className="todo-row" style={{ paddingLeft: `${depth * 20}px` }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          disabled={isLoading}
          className="todo-checkbox"
          aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span className={`todo-title ${todo.completed ? 'completed' : ''}`}>
          {todo.title}
        </span>
        <div className="todo-actions">
          <button
            onClick={() => setShowInput(!showInput)}
            className="btn-add-sub"
            title="Add sub-task"
            disabled={isLoading}
          >
            + Sub
          </button>
          <button
            onClick={handleDelete}
            className="btn-delete"
            title="Delete task"
            disabled={isLoading}
          >
            ×
          </button>
        </div>
      </div>

      {showInput && (
        <div className="add-subtask" style={{ paddingLeft: `${(depth + 1) * 20}px` }}>
          <input
            value={newSubTask}
            onChange={(e) => setNewSubTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter sub-task title..."
            className="subtask-input"
            autoFocus
            disabled={isLoading}
          />
          <button
            onClick={handleAddSubTask}
            className="btn-confirm"
            disabled={isLoading || !newSubTask.trim()}
          >
            Add
          </button>
          <button
            onClick={() => {
              setShowInput(false);
              setNewSubTask('');
            }}
            className="btn-cancel"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      )}

      {/* RECURSION: Render children */}
      {children.length > 0 && (
        <ul className="sub-todos">
          {children.map((child) => (
            <TodoItem
              key={child.$id}
              todo={child}
              allTodos={allTodos}
              onAdd={onAdd}
              onToggle={onToggle}
              onDelete={onDelete}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
