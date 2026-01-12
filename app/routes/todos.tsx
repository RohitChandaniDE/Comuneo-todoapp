import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { account, databases, DATABASE_ID, TODOS_COLLECTION_ID } from '~/lib/appwrite';
import { ID, Query } from 'appwrite';
import { TodoList } from '~/components/TodoList';
import type { Todo, User } from '~/types';

export const meta: MetaFunction = () => {
  return [
    { title: 'My Tasks - Comuneo Todo' },
    { name: 'description', content: 'Manage your recursive to-do list' },
  ];
};

export default function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch todos from Appwrite
  const fetchTodos = useCallback(async (userId: string) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        TODOS_COLLECTION_ID,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );
      setTodos(response.documents as unknown as Todo[]);
    } catch (err) {
      console.error('Error fetching todos:', err);
      setError('Failed to load tasks. Please refresh the page.');
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser as unknown as User);
        await fetchTodos(currentUser.$id);
      } catch (err) {
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate, fetchTodos]);

  // Add a new todo
  const addTodo = async (parentId: string | null, title: string) => {
    if (!user) return;

    try {
      const newDoc = await databases.createDocument(
        DATABASE_ID,
        TODOS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          title,
          completed: false,
          parentId,
        }
      );
      setTodos((prev) => [newDoc as unknown as Todo, ...prev]);
    } catch (err) {
      console.error('Error adding todo:', err);
      throw new Error('Failed to add task');
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      await databases.updateDocument(DATABASE_ID, TODOS_COLLECTION_ID, id, {
        completed,
      });
      setTodos((prev) =>
        prev.map((t) => (t.$id === id ? { ...t, completed } : t))
      );
    } catch (err) {
      console.error('Error toggling todo:', err);
      throw new Error('Failed to update task');
    }
  };

  // Get all descendant IDs recursively
  const getDescendantIds = useCallback(
    (parentId: string): string[] => {
      const children = todos.filter((t) => t.parentId === parentId);
      return children.flatMap((c) => [c.$id, ...getDescendantIds(c.$id)]);
    },
    [todos]
  );

  // Delete a todo and all its children
  const deleteTodo = async (id: string) => {
    try {
      // Get all descendants to delete
      const toDelete = [id, ...getDescendantIds(id)];

      // Delete all in parallel
      await Promise.all(
        toDelete.map((docId) =>
          databases.deleteDocument(DATABASE_ID, TODOS_COLLECTION_ID, docId)
        )
      );

      setTodos((prev) => prev.filter((t) => !toDelete.includes(t.$id)));
    } catch (err) {
      console.error('Error deleting todo:', err);
      throw new Error('Failed to delete task');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="todos-page">
      <header className="app-header">
        <h1>📝 My Tasks</h1>
        <div className="header-actions">
          <span className="user-email">{user?.email}</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </header>

      <main className="todos-main">
        {error && (
          <div className="error-banner" role="alert">
            {error}
          </div>
        )}

        <TodoList
          todos={todos}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </main>
    </div>
  );
}
