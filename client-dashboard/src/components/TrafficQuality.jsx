import { Card } from './ui.jsx';

// Semantic traffic-light colors on purpose, independent of the client's own
// brand theme (--color-primary/--color-accent) — "is this good or bad"
// should read the same regardless of what color scheme the client picked.
const TIERS = [
  { key: 'human', label: 'Human', color: '#22c55e' },
  { key: 'likely_human', label: 'Likely Human', color: '#0ea5e9' },
  { key: 'suspicious', label: 'Suspicious', color: '#f59e0b' },
  { key: 'bot', label: 'Bot', color: '#ef4444' },
];

function scoreColor(score) {
  if (score === null) return '#94a3b8';
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

export default function TrafficQuality({ quality }) {
  if (!quality || quality.total === 0) {
    return (
      <Card title="Traffic Quality">
        <p className="px-4 py-6 text-sm text-slate-400">No classified traffic yet in this range.</p>
      </Card>
    );
  }

  const score = quality.averageScore === null ? null : Math.round(quality.averageScore);
  const countFor = (key) => quality.byClassification.find((r) => r.classification === key)?.count || 0;
  const pctFor = (key) => quality.byClassification.find((r) => r.classification === key)?.pct || 0;

  return (
    <Card title="Traffic Quality">
      <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center justify-center sm:pr-6 sm:border-r sm:border-slate-100 dark:sm:border-slate-800">
          <p className="text-4xl font-bold" style={{ color: scoreColor(score) }}>
            {score === null ? 'N/A' : score}
            {score !== null && <span className="text-lg text-slate-400">/100</span>}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">Quality Score</p>
        </div>

        <div>
          {/* Stacked bar: at-a-glance proportion of each tier. */}
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {TIERS.map((tier) => {
              const pct = pctFor(tier.key) * 100;
              if (!pct) return null;
              return <div key={tier.key} style={{ width: `${pct}%`, backgroundColor: tier.color }} />;
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TIERS.map((tier) => (
              <div key={tier.key}>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tier.color }} />
                  {tier.label}
                </div>
                <p className="mt-0.5 text-lg font-semibold">{Math.round(pctFor(tier.key) * 100)}%</p>
                <p className="text-xs text-slate-400">{countFor(tier.key)} page views</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {quality.topReasons.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">What's affecting the score</p>
          <ul className="mt-2 space-y-1.5">
            {quality.topReasons.map((r) => (
              <li key={r.reason} className="flex items-center justify-between text-sm">
                <span>{r.reason}</span>
                <span className="text-xs font-semibold text-slate-400">{r.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
