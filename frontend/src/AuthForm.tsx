import { useState, type FormEvent } from 'react';
import { useAuth } from './AuthContext';

export default function AuthForm() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ email, password, firstName, lastName });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Pomodoro</h1>
      <div className="auth-tabs">
        <button
          type="button"
          className={mode === 'login' ? 'active' : ''}
          onClick={() => setMode('login')}
        >
          Log in
        </button>
        <button
          type="button"
          className={mode === 'register' ? 'active' : ''}
          onClick={() => setMode('register')}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'register' && (
          <>
            <label>
              First name
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </label>
            <label>
              Last name
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </label>
          </>
        )}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>
    </div>
  );
}
