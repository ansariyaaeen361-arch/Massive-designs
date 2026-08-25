import { useState } from 'react';

export default function AuditUrlForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-4 sm:flex-row">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="yourwebsite.com"
        disabled={isLoading}
        className="w-full flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-primary disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-primary px-10 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {isLoading ? 'Auditing...' : 'Audit Run'}
      </button>
    </form>
  );
}
