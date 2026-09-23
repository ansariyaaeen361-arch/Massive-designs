import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiGet } from '../lib/api.js';
import { Card, Spinner } from '../components/ui.jsx';
import VitalTile from '../components/VitalTile.jsx';

const RANGES = [
  { label: 'Today', ms: 24 * 60 * 60 * 1000 },
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All Time', ms: null },
];

const RATING_DOT = { good: '#22c55e', 'needs-improvement': '#f59e0b', poor: '#ef4444' };

function cell(stat, isCls) {
  if (!stat || stat.p75 === null) return <span className="text-slate-300 dark:text-slate-700">—</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      {stat.rating && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: RATING_DOT[stat.rating] }} />}
      {isCls ? stat.p75.toFixed(3) : `${Math.round(stat.p75)}ms`}
    </span>
  );
}

function BreakdownTable({ rows, labelKey, labelHeader }) {
  if (!rows.length) return <p className="px-4 py-6 text-sm text-slate-400">Not enough data yet in this range.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="text-xs text-slate-400">
            <th className="px-4 py-2 font-normal">{labelHeader}</th>
            <th className="px-3 py-2 font-normal">Samples</th>
            <th className="px-3 py-2 font-normal">LCP (p75)</th>
            <th className="px-3 py-2 font-normal">CLS (p75)</th>
            <th className="px-3 py-2 font-normal">INP (p75)</th>
            <th className="px-3 py-2 font-normal">TTFB (p75)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((r) => (
            <tr key={r[labelKey]}>
              <td className="px-4 py-2.5 font-medium">{r[labelKey] || 'Unknown'}</td>
              <td className="px-3 py-2.5 text-slate-400">{r.count}</td>
              <td className="px-3 py-2.5">{cell(r.lcp)}</td>
              <td className="px-3 py-2.5">{cell(r.cls, true)}</td>
              <td className="px-3 py-2.5">{cell(r.inp)}</td>
              <td className="px-3 py-2.5">{cell(r.ttfb)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Performance() {
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
    apiGet(`/api/performance?${params.toString()}`)
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
        <Spinner /> Loading performance data…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load performance data.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Performance</h1>
          <p className="mt-1 text-xs text-slate-400">
            Real visitor measurements ({data.sampleSize} page loads) — not a lab test.
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

      {data.sampleSize === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700">
          No performance data yet in this range — it starts collecting as soon as real visitors load pages with the
          tracker installed.
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <VitalTile label="LCP" metricKey="lcp" stat={data.overall.lcp} />
            <VitalTile label="CLS" metricKey="cls" stat={data.overall.cls} />
            <VitalTile label="INP" metricKey="inp" stat={data.overall.inp} />
            <VitalTile label="TTFB" metricKey="ttfb" stat={data.overall.ttfb} />
            <VitalTile label="Page Load" metricKey="loadTime" stat={data.overall.loadTime} />
          </div>
          <p className="mt-2 text-xs text-slate-400">
            LCP/CLS/INP/TTFB ratings use Google's published Core Web Vitals thresholds, measured at the 75th
            percentile of real visitors (not the average).
          </p>

          <div className="mt-4">
            <Card title="By Page">
              <BreakdownTable rows={data.byPage} labelKey="page" labelHeader="Page" />
            </Card>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card title="By Device">
              <BreakdownTable rows={data.byDevice} labelKey="device" labelHeader="Device" />
            </Card>
            <Card title="By Browser">
              <BreakdownTable rows={data.byBrowser} labelKey="browser" labelHeader="Browser" />
            </Card>
            <Card title="By Country">
              <BreakdownTable rows={data.byCountry} labelKey="country" labelHeader="Country" />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
