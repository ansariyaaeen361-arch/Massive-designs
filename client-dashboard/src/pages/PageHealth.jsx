import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';

const RANGES = [
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All Time', ms: null },
];

const DIMENSION_LABELS = {
  traffic: 'Traffic',
  engagement: 'Engagement',
  conversion: 'Conversion',
  performance: 'Performance',
  seo: 'SEO',
  errors: 'Errors',
};

function scoreColor(score) {
  if (score === null) return '#94a3b8';
  if (score >= 80) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function pct(n) {
  return n === null || n === undefined ? 'N/A' : `${Math.round(n * 100)}%`;
}

function DimensionChip({ name, score }) {
  const color = scoreColor(score);
  return (
    <div className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-center dark:border-slate-800">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{DIMENSION_LABELS[name]}</p>
      <p className="text-sm font-semibold" style={{ color }}>
        {score === null ? 'N/A' : score}
      </p>
    </div>
  );
}

function explain(page) {
  const b = page.breakdown;
  const lines = [];
  if (page.dimensions.traffic !== null) {
    lines.push(`Traffic: first half of visits ${b.trafficTrend.firstHalf}, second half ${b.trafficTrend.secondHalf}.`);
  }
  if (page.dimensions.engagement !== null) {
    lines.push(`Engagement: ${pct(b.bounceRate)} bounce rate over ${b.landingSessions} landing sessions.`);
  }
  if (page.dimensions.conversion !== null) {
    lines.push(`Conversion: ${pct(b.pageConversionRate)} of visiting sessions converted vs. ${pct(b.siteAvgConversionRate)} site average.`);
  }
  if (page.dimensions.performance !== null && b.vitals) {
    const v = b.vitals;
    lines.push(
      `Performance: LCP ${v.lcp.p75 ?? 'N/A'}${v.lcp.p75 ? 'ms' : ''} (${v.lcp.rating ?? 'n/a'}), CLS ${v.cls.p75 ?? 'N/A'} (${v.cls.rating ?? 'n/a'}).`
    );
  }
  if (page.dimensions.seo !== null) {
    lines.push(b.seoIssues.length ? `SEO: ${b.seoIssues.length} issue(s) found.` : 'SEO: no issues found.');
  }
  if (page.dimensions.errors !== null) {
    lines.push(`Errors: ${b.errorCount} error(s) across ${page.pageViews} page views.`);
  }
  return lines;
}

export default function PageHealth() {
  const [rangeIdx, setRangeIdx] = useState(1);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [expanded, setExpanded] = useState(null);

  const since = useMemo(() => {
    const ms = RANGES[rangeIdx].ms;
    return ms ? Date.now() - ms : null;
  }, [rangeIdx]);

  const load = useCallback(() => {
    setStatus('loading');
    const params = new URLSearchParams();
    if (since) params.set('since', since);
    apiGet(`/api/page-health?${params.toString()}`)
      .then((d) => {
        setData(d.pages);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [since]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading' && !data) {
    return (
      <div className="flex items-center gap-2 py-16 text-slate-400">
        <Spinner /> Scoring pages…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load page health.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Page Health</h1>
          <p className="mt-1 text-xs text-slate-400">
            Combines Traffic, Engagement, Conversion, Performance, SEO, and Errors — sorted worst first. A dimension
            shows "N/A" when there isn't enough data yet, not a guessed number.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {RANGES.map((r, i) => (
            <button
              key={r.label}
              type="button"
              onClick={() => setRangeIdx(i)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                i === rangeIdx
                  ? 'bg-primary text-white'
                  : 'border border-slate-300 text-slate-500 hover:border-primary hover:text-primary dark:border-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {data.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
            No pages with enough data yet in this range.
          </div>
        )}
        {data.map((page) => (
          <div key={page.page} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setExpanded(expanded === page.page ? null : page.page)}
              className="flex w-full flex-wrap items-center gap-4 px-4 py-3 text-left"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold" style={{ backgroundColor: `${scoreColor(page.overall)}22`, color: scoreColor(page.overall) }}>
                {page.overall ?? '—'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{page.page}</p>
                <p className="text-xs text-slate-400">{page.pageViews} page views in this range</p>
              </div>
              <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                {Object.entries(page.dimensions).map(([name, score]) => (
                  <DimensionChip key={name} name={name} score={score} />
                ))}
              </div>
            </button>
            {expanded === page.page && (
              <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <ul className="space-y-1">
                  {explain(page).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                  {!explain(page).length && <li>Not enough data for any dimension yet in this range.</li>}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
