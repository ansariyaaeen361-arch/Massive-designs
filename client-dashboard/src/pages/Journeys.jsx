import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../lib/api.js';
import { Card, RankList, Spinner } from '../components/ui.jsx';
import JourneyChain from '../components/JourneyChain.jsx';

const RANGES = [
  { label: 'Today', ms: 24 * 60 * 60 * 1000 },
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All Time', ms: null },
];

export default function Journeys() {
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
    apiGet(`/api/journeys?${params.toString()}`)
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
        <Spinner /> Loading journeys…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load journeys.</p>;
  }

  const pathRows = data.commonPaths.map((r) => ({ count: r.count, label: r.path }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Visitor Journeys</h1>
          <p className="mt-1 text-xs text-slate-400">Based on {data.sessionsAnalyzed} sessions in this range.</p>
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

      <div className="mt-4">
        <Card title="Common Paths">
          {pathRows.length ? (
            <RankList rows={pathRows} renderLabel={(r) => r.label} />
          ) : (
            <p className="px-4 py-6 text-sm text-slate-400">No multi-page sessions yet in this range.</p>
          )}
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card title="Landing Pages">
          <RankList rows={data.landingPages} renderLabel={(r) => r.page} />
        </Card>
        <Card title="Exit Pages">
          <RankList rows={data.exitPages} renderLabel={(r) => r.page} />
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Pages Right Before a Conversion">
          {data.preConversionPages.length ? (
            <RankList rows={data.preConversionPages} renderLabel={(r) => r.page} />
          ) : (
            <p className="px-4 py-6 text-sm text-slate-400">
              No conversions in this range yet — enable a goal on the Goals page to start seeing this.
            </p>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Sample Conversion Journeys">
          {data.conversionSamples.length ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.conversionSamples.map((s) => (
                <div key={s.sessionId} className="overflow-x-auto px-4 py-3">
                  <JourneyChain origin={s.origin} steps={s.steps} />
                </div>
              ))}
            </div>
          ) : (
            <p className="px-4 py-6 text-sm text-slate-400">No conversion journeys to show yet in this range.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
