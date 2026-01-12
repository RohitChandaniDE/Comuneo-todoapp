import { Link } from '@remix-run/react';

export function meta() {
  return [
    { title: "Recursive Todo App" },
    { name: "description", content: "A powerful todo app with nested subtasks" },
  ];
}

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Recursive Todo App
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Organize your tasks with unlimited nesting. Break down complex projects into manageable subtasks.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link
            to="/signup"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-lg border border-gray-300 dark:border-gray-600"
          >
            Login
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Infinite Nesting</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Create subtasks within subtasks - no limits to how deep you can go
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">☁️</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Cloud Sync</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Your todos are securely stored and synced across all your devices
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Fast & Simple</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Clean interface with instant updates - focus on what matters
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}