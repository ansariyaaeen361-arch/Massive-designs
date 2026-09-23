import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPatch, apiDelete, downloadFile, getSite, setSession, getToken, clearSession } from '../lib/api.js';
import { applyTheme, applyBranding } from '../lib/theme.js';

const ALERT_TYPE_LABELS = {
  traffic_drop: 'Traffic drop',
  traffic_spike: 'Traffic spike',
  conversion_drop: 'Conversion drop',
  bot_spike: 'Bot traffic spike',
  quality_drop: 'Traffic quality drop',
  errors_spike: 'Website errors spike',
  performance_degradation: 'Performance degradation',
  page_unavailable: 'Important page unavailable',
};

function AlertSettingsCard() {
  const [settings, setSettings] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);
  const [webhookInput, setWebhookInput] = useState('');
  const [status, setStatus] = useState('loading');

  const load = useCallback(() => {
    apiGet('/api/alerts/settings')
      .then((d) => {
        setSettings(d.settings);
        setAvailableTypes(d.availableTypes);
        setWebhookInput(d.settings.webhookUrl || '');
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleType(type) {
    const next = settings.enabledTypes.includes(type)
      ? settings.enabledTypes.filter((t) => t !== type)
      : [...settings.enabledTypes, type];
    setSettings({ ...settings, enabledTypes: next });
    await apiPatch('/api/alerts/settings', { enabledTypes: next });
  }

  async function toggleEmail() {
    const next = !settings.emailEnabled;
    setSettings({ ...settings, emailEnabled: next });
    await apiPatch('/api/alerts/settings', { emailEnabled: next });
  }

  async function saveWebhook() {
    if (webhookInput === (settings.webhookUrl || '')) return;
    try {
      const d = await apiPatch('/api/alerts/settings', { webhookUrl: webhookInput || null });
      setSettings(d.settings);
    } catch {
      // revert the input to the last known-good value on a validation error
      setWebhookInput(settings.webhookUrl || '');
    }
  }

  if (status === 'loading') return <p className="text-sm text-slate-400">Loading…</p>;
  if (status === 'error' || !settings) return <p className="text-sm text-red-500">Failed to load alert settings.</p>;

  return (
    <>
      <p className="mt-1 text-xs text-slate-400">
        Choose which conditions notify you, and how. Alerts are checked roughly every 30 minutes.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {availableTypes.map((type) => (
          <label key={type} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={settings.enabledTypes.includes(type)} onChange={() => toggleType(type)} />
            {ALERT_TYPE_LABELS[type] || type}
          </label>
        ))}
      </div>

      <label className="mt-5 flex items-center justify-between gap-4 text-sm font-medium">
        Email me
        <input type="checkbox" checked={settings.emailEnabled} onChange={toggleEmail} className="h-4 w-4" />
      </label>

      <label className="mt-4 block text-sm font-medium">
        Webhook URL (optional)
        <input
          type="url"
          placeholder="https://hooks.example.com/..."
          value={webhookInput}
          onChange={(e) => setWebhookInput(e.target.value)}
          onBlur={saveWebhook}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <span className="mt-1 block text-xs text-slate-400">
          Every enabled alert is POSTed here as JSON — point it at Slack's/Discord's "incoming webhook" URL, Zapier, or your own endpoint.
        </span>
      </label>
    </>
  );
}

function ReportSettingsCard() {
  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = useCallback(() => {
    apiGet('/api/site/report-settings')
      .then((d) => {
        setSettings(d.settings);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(field) {
    const next = { ...settings, [field]: !settings[field] };
    setSettings(next);
    await apiPatch('/api/site/report-settings', { [field]: next[field] });
  }

  if (status === 'loading') return <p className="text-sm text-slate-400">Loading…</p>;
  if (status === 'error' || !settings) return <p className="text-sm text-red-500">Failed to load report settings.</p>;

  return (
    <>
      <p className="mt-1 text-xs text-slate-400">Get a summary of your traffic, top pages, and what changed, straight to your inbox.</p>

      <label className="mt-5 flex items-center justify-between gap-4 text-sm font-medium">
        Weekly email report
        <input type="checkbox" checked={settings.weeklyEnabled} onChange={() => toggle('weeklyEnabled')} className="h-4 w-4" />
      </label>

      <label className="mt-4 flex items-center justify-between gap-4 text-sm font-medium">
        Monthly email report
        <input type="checkbox" checked={settings.monthlyEnabled} onChange={() => toggle('monthlyEnabled')} className="h-4 w-4" />
      </label>
    </>
  );
}

const RETENTION_OPTIONS = [
  { days: 60, label: '2 months' },
  { days: 180, label: '6 months' },
  { days: 425, label: '14 months (default)' },
  { days: 730, label: '24 months' },
];

function PrivacyCard() {
  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = useCallback(() => {
    apiGet('/api/site/privacy-settings')
      .then((d) => {
        setSettings(d.settings);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function save(field, value) {
    const next = { ...settings, [field]: value };
    setSettings(next);
    const d = await apiPatch('/api/site/privacy-settings', { [field]: value });
    setSettings(d.settings);
  }

  if (status === 'loading') return <p className="text-sm text-slate-400">Loading…</p>;
  if (status === 'error' || !settings) return <p className="text-sm text-red-500">Failed to load privacy settings.</p>;

  return (
    <>
      <p className="mt-1 text-xs text-slate-400">Control how long raw visitor data is kept and how precisely IP addresses are stored.</p>

      <label className="mt-5 block text-sm font-medium">
        Keep raw event data for
        <select
          value={settings.retentionDays}
          onChange={(e) => save('retentionDays', Number(e.target.value))}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        >
          {RETENTION_OPTIONS.map((o) => (
            <option key={o.days} value={o.days}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-slate-400">
          Events older than this are automatically and permanently deleted. Dashboard totals for older periods will no longer be available.
        </span>
      </label>

      <label className="mt-4 flex items-center justify-between gap-4 text-sm font-medium">
        Anonymize IP addresses
        <input type="checkbox" checked={settings.anonymizeIp} onChange={(e) => save('anonymizeIp', e.target.checked)} className="h-4 w-4" />
      </label>
      <p className="mt-1 text-xs text-slate-400">
        Stores visitor IPs with the last segment zeroed out (e.g. 203.0.113.0). City/country reporting is unaffected — only new events are
        affected, not ones already stored.
      </p>
    </>
  );
}

function BrandingCard() {
  const site = getSite();
  const [brandName, setBrandName] = useState(site?.branding?.brandName || '');
  const [logoUrl, setLogoUrl] = useState(site?.branding?.logoUrl || '');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  async function save(field, value) {
    setError('');
    setStatus('saving');
    try {
      await apiPatch('/api/site/branding', { [field]: value || null });
      const me = await apiGet('/api/site/me');
      setSession(getToken(), me.site);
      applyBranding(me.site.branding, me.site.name);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to save.');
      setStatus('error');
    }
  }

  return (
    <>
      <p className="mt-1 text-xs text-slate-400">Show this dashboard under your own name and logo instead of the default label.</p>

      <label className="mt-5 block text-sm font-medium">
        Brand name
        <input
          type="text"
          placeholder="Analytics"
          maxLength={60}
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          onBlur={() => save('brandName', brandName)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
      </label>

      <label className="mt-4 block text-sm font-medium">
        Logo URL
        <input
          type="url"
          placeholder="https://yoursite.com/logo.png"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          onBlur={() => save('logoUrl', logoUrl)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
      </label>

      {logoUrl && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
          Preview: <img src={logoUrl} alt="" className="h-6 w-6 rounded object-contain" />
        </div>
      )}

      {status === 'saving' && <p className="mt-4 text-xs text-slate-400">Saving…</p>}
      {status === 'saved' && <p className="mt-4 text-xs text-accent">Saved.</p>}
      {status === 'error' && <p className="mt-4 text-xs text-red-500">{error}</p>}
    </>
  );
}

function DataAccountCard() {
  const navigate = useNavigate();
  const [exportStatus, setExportStatus] = useState('idle');
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  async function exportData() {
    setExportStatus('exporting');
    try {
      const site = getSite();
      await downloadFile('/api/site/export', `analytics-export-${site?.domain || 'site'}.ndjson`);
      setExportStatus('idle');
    } catch {
      setExportStatus('error');
    }
  }

  async function deleteAccount(e) {
    e.preventDefault();
    setDeleteError('');
    setDeleting(true);
    try {
      await apiDelete('/api/site/me', { password });
      clearSession();
      navigate('/login');
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account.');
      setDeleting(false);
    }
  }

  return (
    <>
      <p className="mt-1 text-xs text-slate-400">Download everything stored about your site, or permanently delete your account and all its data.</p>

      <div className="mt-5">
        <button
          type="button"
          onClick={exportData}
          disabled={exportStatus === 'exporting'}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary disabled:opacity-50 dark:border-slate-700"
        >
          {exportStatus === 'exporting' ? 'Preparing export…' : 'Export all my data'}
        </button>
        {exportStatus === 'error' && <p className="mt-2 text-xs text-red-500">Export failed — try again.</p>}
      </div>

      <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">Danger zone</p>
        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            Delete my account
          </button>
        ) : (
          <form onSubmit={deleteAccount} className="mt-2 space-y-2">
            <p className="text-xs text-slate-400">
              This permanently deletes your site, all tracked events, goals, and alerts. This cannot be undone. Enter your password to confirm.
            </p>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            {deleteError && <p className="text-xs text-red-500">{deleteError}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {deleting ? 'Deleting…' : 'Permanently delete'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  setPassword('');
                  setDeleteError('');
                }}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}

export default function Settings() {
  const site = getSite();
  const [theme, setTheme] = useState(site?.theme || { primaryColor: '#4f46e5', accentColor: '#22c55e', mode: 'light' });
  const [status, setStatus] = useState('idle');

  async function save(next) {
    setTheme(next);
    applyTheme(next);
    setStatus('saving');
    try {
      await apiPatch('/api/site/theme', next);
      const me = await apiGet('/api/site/me');
      setSession(getToken(), me.site);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold">Dashboard Theme</h2>
        <p className="mt-1 text-xs text-slate-400">Match the dashboard colors to your own site's branding.</p>

        <label className="mt-5 flex items-center justify-between gap-4 text-sm font-medium">
          Primary color
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => save({ ...theme, primaryColor: e.target.value })}
            className="h-9 w-16 cursor-pointer rounded border border-slate-300 dark:border-slate-700"
          />
        </label>

        <label className="mt-4 flex items-center justify-between gap-4 text-sm font-medium">
          Accent color
          <input
            type="color"
            value={theme.accentColor}
            onChange={(e) => save({ ...theme, accentColor: e.target.value })}
            className="h-9 w-16 cursor-pointer rounded border border-slate-300 dark:border-slate-700"
          />
        </label>

        <label className="mt-4 flex items-center justify-between gap-4 text-sm font-medium">
          Mode
          <select
            value={theme.mode}
            onChange={(e) => save({ ...theme, mode: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        {status === 'saving' && <p className="mt-4 text-xs text-slate-400">Saving…</p>}
        {status === 'saved' && <p className="mt-4 text-xs text-accent">Saved.</p>}
        {status === 'error' && <p className="mt-4 text-xs text-red-500">Failed to save — try again.</p>}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold">Branding</h2>
        <BrandingCard />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold">Alerts</h2>
        <AlertSettingsCard />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold">Reports</h2>
        <ReportSettingsCard />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold">Privacy</h2>
        <PrivacyCard />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold">Data &amp; Account</h2>
        <DataAccountCard />
      </div>
    </div>
  );
}
