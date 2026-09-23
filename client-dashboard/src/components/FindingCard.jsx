const SEVERITY_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#0ea5e9' };

// Shared by Opportunities and Anomalies — same evidence-backed narrative
// shape (whatHappened/evidence/whyItMatters/suggestedAction), just produced
// by two different detection methods.
export default function FindingCard({ finding }) {
  const color = SEVERITY_COLOR[finding.severity] || '#94a3b8';
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color }}>
          {finding.severity} priority
        </span>
        {finding.page && <span className="ml-auto truncate text-xs text-slate-400">{finding.page}</span>}
      </div>
      <div className="px-4 py-3">
        <p className="font-medium">{finding.whatHappened}</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Evidence</dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-300">{finding.evidence}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Why it matters</dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-300">{finding.whyItMatters}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-accent">Suggested action</dt>
            <dd className="mt-0.5 text-slate-600 dark:text-slate-300">{finding.suggestedAction}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
