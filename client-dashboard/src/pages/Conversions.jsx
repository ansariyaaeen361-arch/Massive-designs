import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { apiGet } from '../lib/api.js';
import { Tile, Card, RankList, Spinner } from '../components/ui.jsx';

const RANGES = [
  { label: 'Today', ms: 24 * 60 * 60 * 1000 },
  { label: '7 Days', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: '30 Days', ms: 30 * 24 * 60 * 60 * 1000 },
  { label: 'All Time', ms: null },
];

const CHANNEL_LABELS = {
  direct: 'Direct',
  organic_search: 'Organic Search',
  social: 'Social',
  paid: 'Paid',
  referral: 'Referral',
};

function formatPct(fraction) {
  if (fraction === null || fraction === undefined) return 'N/A';
  return `${Math.round(fraction * 100)}%`;
}

function formatMoney(n) {
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default function Conversions() {
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
    apiGet(`/api/conversions?${params.toString()}`)
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
        <Spinner /> Loading conversions…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load conversions.</p>;
  }

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-xl font-semibold">Conversions</h1>
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
  );

  if (!data.hasGoals) {
    return (
      <div>
        {header}
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
          <p className="text-sm text-slate-500">
            No goals are enabled yet, so nothing here counts as a conversion — by design, nothing is assumed to be one.
          </p>
          <Link to="/goals" className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Go to Goals
          </Link>
        </div>
      </div>
    );
  }

  const sourceRows = data.bySource.map((r) => ({ count: r.count, label: CHANNEL_LABELS[r.channel] || r.channel }));

  return (
    <div>
      {header}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile label="Total Conversions" value={data.totalConversions} />
        <Tile label="Conversion Rate" value={formatPct(data.conversionRate)} />
        <Tile label="Converted Sessions" value={`${data.convertedSessions} / ${data.totalSessions}`} />
        <Tile label="Estimated Value" value={data.estimatedValue !== null ? `~${formatMoney(data.estimatedValue)}` : 'N/A'} />
      </div>
      {data.estimatedValue !== null && (
        <p className="mt-1.5 text-xs text-slate-400">
          Estimated from the per-goal values you set on the Goals page — not real revenue data.
        </p>
      )}

      <div className="mt-4">
        <Card title="Conversions Over Time">
          <div className="h-56 p-4">
            {data.byDay.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.byDay}>
                  <defs>
                    <linearGradient id="conv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="count" name="Conversions" stroke="var(--color-accent)" fill="url(#conv)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400">No conversions yet in this range.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Conversions by Goal">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.byGoal.map((g) => (
              <div key={g.event} className="flex items-center justify-between px-4 py-2.5 text-sm">
                <span>{g.label}</span>
                <span className="flex items-center gap-3">
                  <span className="font-semibold">{g.count}</span>
                  {g.estimatedTotal !== null && <span className="text-xs text-slate-400">~{formatMoney(g.estimatedTotal)}</span>}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Conversions by Source">
          <RankList rows={sourceRows} renderLabel={(r) => r.label} />
        </Card>
        <Card title="Conversions by Landing Page">
          <RankList rows={data.byLandingPage.map((r) => ({ count: r.count, label: r.page }))} renderLabel={(r) => r.label} />
        </Card>
        <Card title="Conversions by Device">
          <RankList rows={data.byDevice.map((r) => ({ count: r.count, label: r.device || 'Unknown' }))} renderLabel={(r) => r.label} />
        </Card>
        <Card title="Conversions by Country">
          <RankList rows={data.byCountry.map((r) => ({ count: r.count, label: r.country }))} renderLabel={(r) => r.label} />
        </Card>
      </div>
    </div>
  );
}
