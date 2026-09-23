import { useCallback, useEffect, useState } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '../lib/api.js';
import { Card, Spinner } from '../components/ui.jsx';

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function GoalRow({ item, onChange }) {
  const [label, setLabel] = useState(item.goal?.label || item.suggestedLabel);
  const [value, setValue] = useState(item.goal?.estimatedValue ?? '');
  const [busy, setBusy] = useState(false);
  const isEnabled = Boolean(item.goal?.enabled);

  async function enable() {
    setBusy(true);
    try {
      await apiPost('/api/goals', { event: item.event, label });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function toggle() {
    setBusy(true);
    try {
      await apiPatch(`/api/goals/${item.goal.id}`, { enabled: !isEnabled });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function saveLabel() {
    if (!item.goal || label === item.goal.label) return;
    setBusy(true);
    try {
      await apiPatch(`/api/goals/${item.goal.id}`, { label });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function saveValue() {
    if (!item.goal) return;
    const parsed = value === '' ? null : Number(value);
    if (parsed !== null && (Number.isNaN(parsed) || parsed < 0)) return;
    if (parsed === (item.goal.estimatedValue ?? null)) return;
    setBusy(true);
    try {
      await apiPatch(`/api/goals/${item.goal.id}`, { estimatedValue: parsed });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await apiDelete(`/api/goals/${item.goal.id}`);
      onChange();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 dark:border-slate-800">
      <span className={`h-2 w-2 shrink-0 rounded-full ${isEnabled ? 'bg-accent' : 'bg-slate-300 dark:bg-slate-700'}`} />

      <div className="min-w-[180px] flex-1">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={saveLabel}
          disabled={!item.goal}
          className="w-full rounded-md border border-transparent bg-transparent px-1 py-0.5 text-sm font-medium focus:border-slate-300 focus:bg-white focus:outline-none disabled:opacity-70 dark:focus:bg-slate-950 dark:focus:border-slate-700"
        />
        <p className="px-1 text-xs text-slate-400">
          event: <code>{item.event}</code>
        </p>
      </div>

      <div className="text-xs text-slate-400">
        {item.count} in this period{item.lastSeen ? ` · last seen ${formatDate(item.lastSeen)}` : ''}
      </div>

      {item.goal && (
        <label className="flex items-center gap-1.5 text-xs text-slate-400">
          Value
          <input
            type="number"
            min="0"
            placeholder="e.g. 50"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={saveValue}
            className="w-20 rounded-md border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      )}

      {item.goal ? (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={toggle}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-primary hover:text-primary disabled:opacity-50 dark:border-slate-700 dark:text-slate-300"
          >
            {isEnabled ? 'Disable' : 'Enable'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={remove}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-red-500 hover:border-red-400 disabled:opacity-50 dark:border-slate-700"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={enable}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          Enable as Goal
        </button>
      )}
    </div>
  );
}

export default function Goals() {
  const [discovered, setDiscovered] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = useCallback(() => {
    apiGet('/api/goals/discovered')
      .then((data) => {
        setDiscovered(data.discovered);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 py-16 text-slate-400">
        <Spinner /> Scanning tracked activity…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load goals.</p>;
  }

  const enabledGoals = discovered.filter((d) => d.goal?.enabled);
  const notYetGoals = discovered.filter((d) => !d.goal?.enabled);

  return (
    <div>
      <h1 className="text-xl font-semibold">Goals</h1>
      <p className="mt-1 text-sm text-slate-400">
        These are the interactions actually seen on your site. Nothing counts as a conversion until you enable it here.
      </p>

      <div className="mt-4">
        <Card title={`Enabled Goals (${enabledGoals.length})`}>
          {enabledGoals.length ? (
            enabledGoals.map((item) => <GoalRow key={item.event} item={item} onChange={load} />)
          ) : (
            <p className="px-4 py-6 text-sm text-slate-400">No goals enabled yet — pick one from "Possible Goals" below.</p>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Possible Goals">
          {notYetGoals.length ? (
            notYetGoals.map((item) => <GoalRow key={item.event} item={item} onChange={load} />)
          ) : (
            <p className="px-4 py-6 text-sm text-slate-400">
              No other tracked activity to suggest yet — goals appear here automatically once real visitors interact with
              your site (clicks, form submits, downloads, etc.).
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
