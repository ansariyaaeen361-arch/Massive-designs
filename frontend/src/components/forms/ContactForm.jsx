import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const RECAPTCHA_SITE_KEY = '6LejfA4sAAAAAIfWC1ZiojBIJX69nHSdFg7Thf0Z';

const initialState = {
  name: '',
  mail: '',
  number: '',
  service: '',
  message: '',
  consent: false,
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetForm = () => {
    setForm(initialState);
    setRecaptchaToken('');
    recaptchaRef.current?.reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.consent) {
      setError('Please accept the consent checkbox to continue.');
      return;
    }
    if (!recaptchaToken) {
      setError('Please verify that you are not a robot.');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      resetForm();
    } catch (err) {
      setStatus('error');
      setError(err.message);
      recaptchaRef.current?.reset();
      setRecaptchaToken('');
    }
  };

  const fieldClass =
    'w-full rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-primary';

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Gomez Golatria"
            value={form.name}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="mail" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
            Email
          </label>
          <input
            id="mail"
            type="email"
            name="mail"
            placeholder="gomez@example.com"
            value={form.mail}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="number" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
            Skype/Phone
          </label>
          <input
            id="number"
            type="text"
            name="number"
            placeholder="+1 800 123 456 789"
            value={form.number}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="service" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
            Company
          </label>
          <input
            id="service"
            type="text"
            name="service"
            placeholder="Digital Solutions"
            value={form.service}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
            Your message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Hello Dennis, can you help me with..."
            value={form.message}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          id="consent"
          name="consent"
          required
          checked={form.consent}
          onChange={handleChange}
          className="mt-1 h-4 w-4 shrink-0 accent-primary"
        />
        <label htmlFor="consent" className="text-xs leading-relaxed text-white/40">
          I agree to receive communications by text messages regarding updates on project status, meeting reminders,
          marketing, and general communication related to the projects from <strong className="text-white/60">Massive Designs</strong> about
          my inquiry. You may opt out by replying STOP or reply HELP for more information. Message frequency varies.
          Message and data rates may apply. You may review our{' '}
          <a href="/privacy-policy/" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Privacy Policy
          </a>{' '}
          to learn how your data is used.
        </label>
      </div>

      <div className="mt-6">
        <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} onChange={setRecaptchaToken} theme="dark" />
      </div>

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-10 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === 'submitting' ? 'Sending...' : 'Send'}
      </button>

      {status === 'success' && (
        <p className="mt-4 text-sm text-primary">Thanks! Your message has been received.</p>
      )}
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
    </form>
  );
}
