import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Comuneo Todo - Recursive Task Manager' },
    { name: 'description', content: 'A recursive to-do list application built with Remix and Appwrite' },
  ];
};

export default function Index() {
  return (
    <div className="landing-page">
      <div className="hero">
        <h1>📝 Recursive Todo</h1>
        <p className="tagline">
          Organize your tasks with infinite nesting. Break down complex projects into manageable sub-tasks.
        </p>
        
        <div className="features">
          <div className="feature">
            <span className="feature-icon">🔄</span>
            <h3>Infinite Recursion</h3>
            <p>Create sub-tasks within sub-tasks, as deep as you need</p>
          </div>
          <div className="feature">
            <span className="feature-icon">✅</span>
            <h3>Easy Management</h3>
            <p>Add, complete, and delete tasks with simple clicks</p>
          </div>
          <div className="feature">
            <span className="feature-icon">☁️</span>
            <h3>Cloud Synced</h3>
            <p>Your tasks are saved securely with Appwrite</p>
          </div>
        </div>

        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
