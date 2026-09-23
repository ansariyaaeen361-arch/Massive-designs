import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost, setSession } from '../lib/api.js';
import { applyTheme, applyBranding } from '../lib/theme.js';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiPost('/api/auth/login', { email, password });
      setSession(data.token, data.site);
      applyTheme(data.site.theme);
      applyBranding(data.site.branding, data.site.name);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Analytics</p>
        <h1 className="mt-2 text-xl font-semibold">Sign in</h1>

        <label className="mt-6 block text-sm font-medium text-slate-600 dark:text-slate-300">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-slate-600 dark:text-slate-300">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-6 text-center text-xs text-slate-300 dark:text-slate-700">
          <Link to="/agency/login" className="hover:text-slate-400 dark:hover:text-slate-600">
            Agency admin
          </Link>
        </p>
      </form>
    </div>
  );
}
