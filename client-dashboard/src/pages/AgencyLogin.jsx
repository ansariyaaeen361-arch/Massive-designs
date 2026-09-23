import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGet, setAdminKey } from '../lib/adminApi.js';

export default function AgencyLogin() {
  const navigate = useNavigate();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAdminKey(key);
    try {
      await adminGet('/api/admin/sites');
      navigate('/agency');
    } catch (err) {
      setError(err.message || 'Invalid admin key.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Agency</p>
        <h1 className="mt-2 text-xl font-semibold">Admin access</h1>
        <p className="mt-1 text-xs text-slate-400">This is separate from client logins — enter the server's admin key.</p>

        <label className="mt-6 block text-sm font-medium text-slate-600 dark:text-slate-300">
          Admin key
          <input
            type="password"
            required
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Checking…' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
