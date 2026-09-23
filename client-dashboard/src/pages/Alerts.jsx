import { useCallback, useEffect, useState } from 'react';
import { apiGet, apiPatch } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';

const SEVERITY_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#0ea5e9' };

function timeAgo(date) {
  const diffMs = Date.now() - new Date(date).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function AlertRow({ alert, onAcknowledge }) {
  const color = SEVERITY_COLOR[alert.severity] || '#94a3b8';
  return (
    <div className={`px-4 py-3 ${alert.acknowledged ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
          <div>
            <p className="text-sm font-medium">{alert.whatHappened}</p>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{alert.evidence}</p>
            {alert.suggestedAction && <p className="mt-1 text-xs text-accent">{alert.suggestedAction}</p>}
            <p className="mt-1 text-[11px] text-slate-400">
              {timeAgo(alert.createdAt)}
              {alert.emailSent ? ' · emailed' : ''}
              {alert.webhookSent ? ' · webhook sent' : ''}
            </p>
          </div>
        </div>
        {!alert.acknowledged && (
          <button
            type="button"
            onClick={() => onAcknowledge(alert._id)}
            className="shrink-0 rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-500 hover:border-primary hover:text-primary dark:border-slate-700"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

export default function Alerts() {
  const [alerts, setAlerts] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = useCallback(() => {
    apiGet('/api/alerts')
      .then((d) => {
        setAlerts(d.alerts);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function acknowledge(id) {
    setAlerts((prev) => prev.map((a) => (a._id === id ? { ...a, acknowledged: true } : a)));
    await apiPatch(`/api/alerts/${id}`, { acknowledged: true });
  }

  if (status === 'loading' && !alerts) {
    return (
      <div className="flex items-center gap-2 py-16 text-slate-400">
        <Spinner /> Loading alerts…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load alerts.</p>;
  }

  const unacknowledged = alerts.filter((a) => !a.acknowledged);
  const acknowledged = alerts.filter((a) => a.acknowledged);

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold">Alerts</h1>
        <p className="mt-1 text-xs text-slate-400">
          Checked automatically roughly every 30 minutes. Manage which conditions notify you (and by email/webhook) in
          Settings.
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {alerts.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-slate-400">No alerts yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {unacknowledged.map((a) => (
              <AlertRow key={a._id} alert={a} onAcknowledge={acknowledge} />
            ))}
            {acknowledged.map((a) => (
              <AlertRow key={a._id} alert={a} onAcknowledge={acknowledge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
