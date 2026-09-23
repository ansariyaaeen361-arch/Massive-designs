export function Tile({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 truncate text-2xl font-semibold" title={String(value)}>
        {value}
      </p>
    </div>
  );
}

export function Card({ title, actions, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-primary">{title}</h2>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function RankList({ rows, renderLabel }) {
  if (!rows.length) {
    return <p className="px-4 py-6 text-sm text-slate-400">No data yet.</p>;
  }
  const max = rows[0]?.count || 1;
  const total = rows.reduce((sum, r) => sum + r.count, 0) || 1;
  return (
    <div className="max-h-64 overflow-y-auto">
      {rows.map((row, i) => {
        const label = renderLabel(row);
        const pct = Math.round((row.count / total) * 100);
        return (
          <div key={i} className="flex items-center gap-3 border-b border-slate-100 px-4 py-2 last:border-0 dark:border-slate-800">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                i === 0 ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate" title={label}>
                  {label}
                </span>
                <span className="shrink-0 text-slate-400">{pct}%</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-accent" style={{ width: `${(row.count / max) * 100}%` }} />
                </div>
                <span className="shrink-0 text-xs font-semibold text-accent">{row.count}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Spinner() {
  return <div className="animate-spin rounded-full border-2 border-slate-300 border-t-primary h-5 w-5" />;
}
