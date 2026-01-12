import { useState, useEffect } from 'react';
import { useNavigate, Link } from '@remix-run/react';
import type { MetaFunction } from '@remix-run/node';
import { account } from '~/lib/appwrite';

export const meta: MetaFunction = () => {
  return [
    { title: 'Login - Comuneo Todo' },
    { name: 'description', content: 'Log in to your account' },
  ];
};

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await account.get();
        navigate('/todos');
      } catch {
        // Not logged in, stay on login page
      }
    };
    checkAuth();
  }, [navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await account.createEmailPasswordSession(email, password);
      navigate('/todos');
    } catch (err: unknown) {
      const error = err as { message?: string; code?: number };
      
      if (error.code === 401) {
        setErrors({ general: 'Invalid email or password' });
      } else {
        setErrors({ general: error.message || 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">Log in to manage your tasks</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {errors.general && (
            <div className="error-banner" role="alert">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={errors.email ? 'input-error' : ''}
              disabled={isLoading}
              autoComplete="email"
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <span id="email-error" className="error-text" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={errors.password ? 'input-error' : ''}
              disabled={isLoading}
              autoComplete="current-password"
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            {errors.password && (
              <span id="password-error" className="error-text" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
