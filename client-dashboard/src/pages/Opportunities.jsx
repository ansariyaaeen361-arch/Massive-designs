import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';
import FindingCard from '../components/FindingCard.jsx';

const RANGES = [
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All Time', ms: null },
];

export default function Opportunities() {
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
    apiGet(`/api/opportunities?${params.toString()}`)
      .then((d) => {
        setData(d.opportunities);
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
        <Spinner /> Looking for opportunities…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load opportunities.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Opportunities</h1>
          <p className="mt-1 text-xs text-slate-400">
            Patterns found across your own data, each with the evidence behind it. No opportunity is shown without a
            number to back it.
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
        {data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
            No clear opportunities found in this range — either things are running smoothly, or there isn't enough
            data yet to say so with confidence.
          </div>
        ) : (
          data.map((o, i) => <FindingCard key={i} finding={o} />)
        )}
      </div>
    </div>
  );
}
