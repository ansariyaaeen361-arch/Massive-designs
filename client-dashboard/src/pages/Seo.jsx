import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../lib/api.js';
import { Card, Spinner } from '../components/ui.jsx';

const RANGES = [
  { label: 'Today', ms: 24 * 60 * 60 * 1000 },
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All Time', ms: null },
];

const ISSUE_LABELS = {
  missing_title: 'Missing title',
  missing_meta_description: 'Missing meta description',
  missing_h1: 'Missing H1',
  multiple_h1: 'Multiple H1 tags',
  missing_canonical: 'Missing canonical tag',
  canonical_mismatch: "Canonical doesn't match URL",
  noindex: 'Marked noindex',
  images_missing_alt: 'Images missing alt text',
};

function StatusPill({ label, result }) {
  const color = result.checked ? (result.available ? '#22c55e' : '#ef4444') : '#94a3b8';
  const text = result.checked ? (result.available ? `Available (${result.status})` : `Missing (${result.status ?? 'no response'})`) : 'Could not check';
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-slate-400">{result.url}</p>
      </div>
      <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: `${color}22`, color }}>
        {text}
      </span>
    </div>
  );
}

export default function Seo() {
  const [rangeIdx, setRangeIdx] = useState(1);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  const since = useMemo(() => {
    const ms = RANGES[rangeIdx].ms;
    return ms ? Date.now() - ms : null;
  }, [rangeIdx]);

  const load = useCallback(() => {
    setStatus('loading');
    const params = new URLSearchParams();
    if (since) params.set('since', since);
    apiGet(`/api/seo?${params.toString()}`)
      .then((d) => {
        setData(d);
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
        <Spinner /> Running checks…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load SEO data.</p>;
  }

  const pagesWithIssues = data.pages.filter((p) => p.issues.length > 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">SEO &amp; Technical</h1>
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

      <p className="mt-2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-500 dark:bg-slate-900 dark:text-slate-400">{data.note}</p>

      <div className="mt-4">
        <Card title="Site Basics">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <StatusPill label="robots.txt" result={data.robotsTxt} />
            <StatusPill label="sitemap.xml" result={data.sitemapXml} />
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Card title={`Pages With Issues (${pagesWithIssues.length} of ${data.pages.length} audited)`}>
          {pagesWithIssues.length ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {pagesWithIssues.map((p) => (
                <div key={p.page} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">{p.page}</p>
                    <p className="shrink-0 text-xs text-slate-400">{p.pageViews} page views</p>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.issues.map((issue) => (
                      <span
                        key={issue}
                        className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                      >
                        {ISSUE_LABELS[issue] || issue}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : data.pages.length ? (
            <p className="px-4 py-6 text-sm text-slate-400">No issues found on any audited page. Nice.</p>
          ) : (
            <p className="px-4 py-6 text-sm text-slate-400">No pages audited yet in this range.</p>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Broken Internal Links">
          {data.brokenLinkSources.length ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.brokenLinkSources.map((r) => (
                <div key={r.page} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <span>{r.page}</span>
                  <span className="font-semibold text-red-500">{r.count} link(s) to a 404</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-4 py-6 text-sm text-slate-400">
              None detected in this range. This needs your site's 404 page to call{' '}
              <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">maTrackEvent('404_view')</code> — a
              page's own HTTP status can't be read from JavaScript otherwise.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
