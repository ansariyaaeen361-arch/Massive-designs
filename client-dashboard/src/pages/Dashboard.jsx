import { useCallback, useEffect, useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { apiGet } from '../lib/api.js';
import { Tile, Card, RankList, Spinner } from '../components/ui.jsx';
import TrafficQuality from '../components/TrafficQuality.jsx';
import AttentionBanner from '../components/AttentionBanner.jsx';

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

// Event names the tracker auto-detects from real business interactions
// (see backend/src/public/track.js), plus the manual ones a site owner can
// fire via data-ma-event or window.maTrackEvent(). Anything else counted in
// "Button Clicks" is a generic custom event, not a lead action specifically.
const LEAD_EVENT_LABELS = {
  phone_click: 'Phone Click',
  email_click: 'Email Click',
  whatsapp_click: 'WhatsApp Click',
  booking_click: 'Booking Link Click',
  download: 'File Download',
  form_submit: 'Form Submitted',
  quote_request: 'Quote Request',
  signup: 'Signup',
  purchase: 'Purchase',
  conversion: 'Conversion',
};

function formatDuration(ms) {
  if (!ms || ms < 1000) return '0s';
  const totalSec = Math.round(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

function formatPct(fraction) {
  if (fraction === null || fraction === undefined) return 'N/A';
  return `${Math.round(fraction * 100)}%`;
}

export default function Dashboard() {
  const [rangeIdx, setRangeIdx] = useState(1);
  const [summary, setSummary] = useState(null);
  const [quality, setQuality] = useState(null);
  const [attention, setAttention] = useState(null);
  const [status, setStatus] = useState('loading');

  const since = useMemo(() => {
    const ms = RANGES[rangeIdx].ms;
    return ms ? Date.now() - ms : null;
  }, [rangeIdx]);

  const load = useCallback(() => {
    setStatus('loading');
    const params = new URLSearchParams();
    if (since) params.set('since', since);
    Promise.all([
      apiGet(`/api/track/summary?${params.toString()}`),
      apiGet(`/api/track/quality?${params.toString()}`),
      apiGet(`/api/attention?${params.toString()}`),
    ])
      .then(([summaryData, qualityData, attentionData]) => {
        setSummary(summaryData);
        setQuality(qualityData);
        setAttention(attentionData);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [since]);

  useEffect(() => {
    load();
  }, [load]);

  if (status === 'loading' && !summary) {
    return (
      <div className="flex items-center gap-2 py-16 text-slate-400">
        <Spinner /> Loading analytics…
      </div>
    );
  }
  if (status === 'error') {
    return <p className="py-16 text-red-500">Failed to load analytics.</p>;
  }

  const buttonRows = summary.byEvent.filter((r) => !['page_view', 'page_view_duration'].includes(r.event));
  const totalClicks = buttonRows.reduce((sum, r) => sum + r.count, 0);
  // byPage counts every event on a page (views + clicks alike, by design —
  // it answers "what's active on this page"), so the true page-view total
  // has to come from byEvent's page_view entry instead of summing byPage.
  const totalPageViews = summary.byEvent.filter((r) => r.event === 'page_view').reduce((sum, r) => sum + r.count, 0);
  const channelRows = summary.byChannel
    .filter((r) => r.channel)
    .map((r) => ({ count: r.count, label: CHANNEL_LABELS[r.channel] || r.channel }));

  // byEvent groups by (event, source) pairs — merge sources back together
  // here so "Phone Click" shows one total instead of one row per number.
  const leadTally = {};
  summary.byEvent.forEach((r) => {
    if (LEAD_EVENT_LABELS[r.event]) leadTally[r.event] = (leadTally[r.event] || 0) + r.count;
  });
  const leadRows = Object.entries(leadTally)
    .map(([event, count]) => ({ count, label: LEAD_EVENT_LABELS[event] }))
    .sort((a, b) => b.count - a.count);
  const totalLeads = leadRows.reduce((sum, r) => sum + r.count, 0);

  return (
    <div>
      <AttentionBanner attention={attention} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Traffic Overview</h1>
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

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        <Tile label="Visitors" value={summary.newVisitors + summary.returningVisitors} />
        <Tile label="Page Views" value={totalPageViews} />
        <Tile label="Leads" value={totalLeads} />
        <Tile label="Button Clicks" value={totalClicks} />
        <Tile label="Avg. Session Duration" value={formatDuration(summary.avgDurationMs)} />
        <Tile label="Bounce Rate" value={formatPct(summary.bounceRate)} />
        <Tile label="Engagement Rate" value={summary.bounceRate === null ? 'N/A' : formatPct(1 - summary.bounceRate)} />
      </div>

      <div className="mt-4">
        <TrafficQuality quality={quality} />
      </div>

      <div className="mt-4">
        <Card title="Visits Over Time">
          <div className="h-64 p-4">
            {summary.byDay.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.byDay}>
                  <defs>
                    <linearGradient id="visits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="var(--color-primary)" fill="url(#visits)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400">No data yet.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Card title="Lead & Contact Actions">
          {leadRows.length ? (
            <RankList rows={leadRows} renderLabel={(r) => r.label} />
          ) : (
            <p className="px-4 py-6 text-sm text-slate-400">
              No phone/email/WhatsApp clicks, form submissions, bookings, or downloads yet in this range.
            </p>
          )}
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Traffic Channels">
          <RankList rows={channelRows} renderLabel={(r) => r.label} />
        </Card>
        <Card title="Most Active Pages">
          <RankList rows={summary.byPage.filter((r) => r.page)} renderLabel={(r) => r.page} />
        </Card>
        <Card title="Top Referrers">
          <RankList rows={summary.byReferrer} renderLabel={(r) => r.referrer || 'Direct'} />
        </Card>
        <Card title="Devices">
          <RankList rows={summary.byDevice} renderLabel={(r) => r.device || 'Unknown'} />
        </Card>
        <Card title="Operating Systems">
          <RankList rows={summary.byOs} renderLabel={(r) => r.os || 'Unknown'} />
        </Card>
        <Card title="Countries">
          <RankList rows={summary.byCountry.filter((r) => r.country)} renderLabel={(r) => r.country} />
        </Card>
      </div>
    </div>
  );
}
