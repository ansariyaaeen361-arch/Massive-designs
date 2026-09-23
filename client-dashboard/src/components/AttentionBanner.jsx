const SEVERITY_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#0ea5e9' };

// The first thing a client should see — a condensed, evidence-backed "what
// needs attention" list (or a clear all-clear state), not a wall of charts.
export default function AttentionBanner({ attention }) {
  if (!attention) return null;

  if (attention.allClear) {
    return (
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-accent">
        <span className="h-2 w-2 rounded-full bg-accent" />
        Everything looks normal — no issues need your attention right now.
      </div>
    );
  }

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
        <p className="font-semibold">
          {attention.count} thing{attention.count === 1 ? '' : 's'} need{attention.count === 1 ? 's' : ''} attention
        </p>
      </div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {attention.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 px-4 py-2.5 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: SEVERITY_COLOR[item.severity] || '#94a3b8' }} />
            <span>{item.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
