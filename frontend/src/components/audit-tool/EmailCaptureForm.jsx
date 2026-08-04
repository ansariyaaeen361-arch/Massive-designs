import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMail, HiCheckCircle } from 'react-icons/hi';

export default function EmailCaptureForm({ auditId }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setStatus('submitting');

    try {
      const res = await fetch('/api/audit/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, auditId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center sm:p-10">
        <HiCheckCircle className="mx-auto text-4xl text-primary" />
        <h3 className="mt-4 text-xl text-white">Your full report is on its way</h3>
        <p className="mt-2 text-sm text-white/50">
          Check <span className="text-white">{email}</span> for your detailed PDF audit report.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1"
        >
          Book a Free Consultation
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        <HiOutlineMail className="text-lg" />
      </span>
      <h3 className="mt-4 text-xl text-white">Get your full detailed report</h3>
      <p className="mt-2 text-sm text-white/50">
        Enter your email and we&rsquo;ll send you the complete PDF audit, including every issue found and how to fix it.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          disabled={status === 'submitting'}
          className="w-full flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-primary disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {status === 'submitting' ? 'Sending...' : 'Send My Report'}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </div>
  );
}
