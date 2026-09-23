import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../lib/api.js';
import { Tile, Card, RankList, Spinner } from '../components/ui.jsx';

const RANGES = [
  { label: 'Today', ms: 24 * 60 * 60 * 1000 },
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All Time', ms: null },
];

export default function Errors() {
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
    apiGet(`/api/errors?${params.toString()}`)
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
        <Spinner /> Loading errors…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load error data.</p>;
  }

  const totalErrors = data.summary.jsErrors + data.summary.http404 + data.summary.http500 + data.summary.brokenResources;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Errors</h1>
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

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="JS Errors" value={data.summary.jsErrors} />
        <Tile label="404 Errors" value={data.summary.http404} />
        <Tile label="500 Errors" value={data.summary.http500} />
        <Tile label="Broken Resources" value={data.summary.brokenResources} />
      </div>

      {totalErrors === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
          No errors observed in this range — nice. This tracks real JavaScript errors and failed resource loads seen
          by actual visitors' browsers.
        </div>
      ) : (
        <>
          <div className="mt-4">
            <Card title="JavaScript Errors">
              {data.jsErrorsByMessage.length ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.jsErrorsByMessage.map((e) => (
                    <div key={e.message} className="px-4 py-3">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-medium">{e.message}</p>
                        <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-500/10">
                          {e.count}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {e.samplePage}
                        {e.source ? ` · ${e.source}` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-6 text-sm text-slate-400">No JavaScript errors in this range.</p>
              )}
            </Card>
          </div>

          <div className="mt-4">
            <Card title="Broken / Failed Resources">
              {data.resourceErrorsByUrl.length ? (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data.resourceErrorsByUrl.map((e) => (
                    <div key={e.url} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium" title={e.url}>
                          {e.url}
                        </p>
                        <p className="text-xs text-slate-400">
                          on {e.samplePage} {e.status ? `· HTTP ${e.status}` : '· status unknown'}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:bg-amber-500/10">
                        {e.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-4 py-6 text-sm text-slate-400">No broken resources in this range.</p>
              )}
            </Card>
          </div>

          <div className="mt-4">
            <Card title="Errors by Page">
              <RankList rows={data.errorsByPage.map((r) => ({ count: r.count, label: r.page }))} renderLabel={(r) => r.label} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
