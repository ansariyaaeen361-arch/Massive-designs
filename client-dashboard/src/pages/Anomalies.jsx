import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../lib/api.js';
import { Spinner } from '../components/ui.jsx';
import FindingCard from '../components/FindingCard.jsx';

const RANGES = [
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
];

export default function Anomalies() {
  const [rangeIdx, setRangeIdx] = useState(0);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  const since = useMemo(() => Date.now() - RANGES[rangeIdx].ms, [rangeIdx]);

  const load = useCallback(() => {
    setStatus('loading');
    apiGet(`/api/anomalies?since=${since}`)
      .then((d) => {
        setData(d.anomalies);
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
        <Spinner /> Comparing to the previous period…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load anomalies.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Anomalies</h1>
          <p className="mt-1 text-xs text-slate-400">
            Compares this period to the one immediately before it (same length), and each day to its own typical
            day-of-week — not just to yesterday, to avoid flagging normal weekly patterns.
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
              {r.label} vs. previous {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
            No significant changes found vs. the previous period, and no unusual days vs. typical day-of-week
            patterns.
          </div>
        ) : (
          data.map((a, i) => <FindingCard key={i} finding={a} />)
        )}
      </div>
    </div>
  );
}
