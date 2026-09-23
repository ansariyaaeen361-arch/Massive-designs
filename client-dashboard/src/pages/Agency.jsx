import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminGet, adminPost, clearAdminKey } from '../lib/adminApi.js';
import { Card, Spinner, Tile } from '../components/ui.jsx';

const HEALTH_STYLES = {
  healthy: { label: 'Healthy', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' },
  attention: { label: 'Needs attention', className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' },
};

function HealthBadge({ health }) {
  const style = HEALTH_STYLES[health?.status] || HEALTH_STYLES.healthy;
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${style.className}`}
      title={health?.reasons?.join('; ')}
    >
      {style.label}
    </span>
  );
}

function NewClientForm({ onCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', domain: '', ownerEmail: '', password: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = await adminPost('/api/admin/sites', form);
      setResult(data.site);
      setForm({ name: '', domain: '', ownerEmail: '', password: '' });
      onCreated();
    } catch (err) {
      setError(err.message || 'Failed to create client.');
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        + Add client
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">New client</h2>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-slate-400 hover:text-slate-600">
          Close
        </button>
      </div>

      {result ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-accent">Client created.</p>
          <p className="text-xs text-slate-500">Embed this snippet on {result.domain} (before &lt;/body&gt;):</p>
          <pre className="overflow-x-auto rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800">{`<script src="${
            import.meta.env.VITE_API_URL
          }/track.js" data-site="${result.siteKey}"></script>`}</pre>
          <button type="button" onClick={() => setResult(null)} className="text-xs text-primary hover:underline">
            Add another
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Client name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="text-sm font-medium">
            Domain
            <input
              required
              placeholder="client.com"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="text-sm font-medium">
            Owner email
            <input
              required
              type="email"
              value={form.ownerEmail}
              onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label className="text-sm font-medium">
            Login password
            <input
              required
              type="password"
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          {error && <p className="text-sm text-red-500 sm:col-span-2">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 sm:col-span-2"
          >
            {saving ? 'Creating…' : 'Create client'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function Agency() {
  const navigate = useNavigate();
  const [sites, setSites] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    adminGet('/api/admin/sites')
      .then((d) => setSites(d.sites))
      .catch((err) => {
        setError(err.message);
        if (err.status === 403) navigate('/agency/login');
      });
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  function logout() {
    clearAdminKey();
    navigate('/agency/login');
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Agency</p>
          <h1 className="mt-1 text-xl font-semibold">Client sites</h1>
        </div>
        <button type="button" onClick={logout} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700">
          Log out
        </button>
      </div>

      <div className="mt-6">
        <NewClientForm onCreated={load} />
      </div>

      <div className="mt-6">
        {error && !sites && <p className="text-sm text-red-500">{error}</p>}
        {!sites && !error && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Spinner /> Loading…
          </div>
        )}
        {sites && sites.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3">
            <Tile label="Healthy" value={sites.filter((s) => s.health?.status === 'healthy').length} />
            <Tile label="Needs attention" value={sites.filter((s) => s.health?.status === 'attention').length} />
            <Tile label="Critical" value={sites.filter((s) => s.health?.status === 'critical').length} />
          </div>
        )}
        {sites && (
          <Card title={`${sites.length} client${sites.length === 1 ? '' : 's'}`}>
            {sites.length === 0 ? (
              <p className="px-4 py-6 text-sm text-slate-400">No clients yet — add your first one above.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-400 dark:border-slate-800">
                      <th className="px-4 py-2 font-medium">Client</th>
                      <th className="px-4 py-2 font-medium">Owner</th>
                      <th className="px-4 py-2 font-medium">Health</th>
                      <th className="px-4 py-2 font-medium">Views (24h)</th>
                      <th className="px-4 py-2 font-medium">Views (7d)</th>
                      <th className="px-4 py-2 font-medium">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sites.map((s) => (
                      <tr key={s.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                        <td className="px-4 py-3">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-slate-400">{s.domain}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-500">{s.ownerEmail}</td>
                        <td className="px-4 py-3">
                          <HealthBadge health={s.health} />
                        </td>
                        <td className="px-4 py-3">{s.pageViews24h}</td>
                        <td className="px-4 py-3">{s.pageViews7d}</td>
                        <td className="px-4 py-3 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
