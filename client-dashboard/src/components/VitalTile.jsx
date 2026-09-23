const RATING_COLORS = {
  good: '#22c55e',
  'needs-improvement': '#f59e0b',
  poor: '#ef4444',
};
const RATING_LABELS = {
  good: 'Good',
  'needs-improvement': 'Needs Improvement',
  poor: 'Poor',
};

function formatValue(key, value) {
  if (value === null || value === undefined) return 'N/A';
  if (key === 'cls') return value.toFixed(3);
  return `${Math.round(value)}ms`;
}

export default function VitalTile({ label, metricKey, stat }) {
  const color = stat?.rating ? RATING_COLORS[stat.rating] : '#94a3b8';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{formatValue(metricKey, stat?.p75)}</p>
      {stat?.rating ? (
        <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ backgroundColor: `${color}22`, color }}>
          {RATING_LABELS[stat.rating]}
        </span>
      ) : (
        <p className="mt-1 text-[11px] text-slate-400">Not enough data</p>
      )}
    </div>
  );
}
