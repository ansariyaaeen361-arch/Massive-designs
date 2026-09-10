import { useEffect, useRef, useState } from 'react';
import { HiX } from 'react-icons/hi';
import ReCAPTCHA from 'react-google-recaptcha';
import { gsap } from '../../lib/gsap';
import { serviceGroups } from '../../lib/serviceOptions';
import { trackEvent } from '../../lib/analytics';

const RECAPTCHA_SITE_KEY = '6LejfA4sAAAAAIfWC1ZiojBIJX69nHSdFg7Thf0Z';

const initialState = { name: '', mail: '', number: '', our_service: '', message: '', consent: false };

export default function OrderModal({ open, onClose }) {
  const [form, setForm] = useState(initialState);
  const [honeypot, setHoneypot] = useState('');
  const [formLoadedAt] = useState(() => Date.now());
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (open) {
      gsap.set(rootRef.current, { pointerEvents: 'auto' });
      gsap.to(rootRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      gsap.fromTo(panelRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
    } else {
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
        overwrite: 'auto',
        onComplete: () => gsap.set(rootRef.current, { pointerEvents: 'none' }),
      });
    }
  }, [open]);

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
        body: JSON.stringify({
          name: form.name,
          mail: form.mail,
          number: form.number,
          service: form.our_service,
          message: form.message,
          consent: form.consent,
          recaptchaToken,
          website: honeypot,
          formLoadedAt,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      trackEvent('generate_lead', { form: 'order_modal', service: form.our_service });
      resetForm();
    } catch (err) {
      setStatus('error');
      setError(err.message);
      recaptchaRef.current?.reset();
      setRecaptchaToken('');
    }
  };

  const fieldClass =
    'w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-primary';

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[70] opacity-0" style={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex h-full items-center justify-center overflow-y-auto p-4 py-10">
        <div ref={panelRef} className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b0c10] p-8 sm:p-10">
          <button
            type="button"
            aria-label="Close order form"
            onClick={onClose}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-primary hover:text-primary"
          >
            <HiX className="text-xl" />
          </button>

          <h3 className="text-2xl text-white sm:text-3xl">Place Your Order</h3>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            {/* Honeypot: hidden from real visitors, so any value means a bot filled it in. */}
            <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="order-website">Website</label>
              <input
                id="order-website"
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="order-name" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
                  Your Name
                </label>
                <input id="order-name" name="name" type="text" placeholder="Enter your name" value={form.name} onChange={handleChange} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="order-mail" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
                  Email Address
                </label>
                <input id="order-mail" name="mail" type="email" placeholder="Enter your email" value={form.mail} onChange={handleChange} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="order-number" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
                  Phone Number
                </label>
                <input id="order-number" name="number" type="tel" placeholder="Enter your phone number" value={form.number} onChange={handleChange} className={fieldClass} />
              </div>
              <div>
                <label htmlFor="order-service" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
                  Select Service
                </label>
                <select
                  id="order-service"
                  name="our_service"
                  value={form.our_service}
                  onChange={handleChange}
                  className={fieldClass}
                  style={{ colorScheme: 'dark' }}
                >
                  <option value="" className="bg-[#0b0c10] text-white">
                    Choose a service
                  </option>
                  {serviceGroups.map((group) => (
                    <optgroup key={group.label} label={group.label} className="bg-[#0b0c10] text-white">
                      {group.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-[#0b0c10] text-white">
                          {opt}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="order-message" className="mb-2 block text-xs uppercase tracking-wide text-white/50">
                Your Message
              </label>
              <textarea id="order-message" name="message" rows={4} placeholder="Write your message" value={form.message} onChange={handleChange} className={fieldClass} />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="order-consent"
                name="consent"
                required
                checked={form.consent}
                onChange={handleChange}
                className="mt-1 h-4 w-4 shrink-0 accent-primary"
              />
              <label htmlFor="order-consent" className="text-xs leading-relaxed text-white/40">
                I agree to receive communications by text messages regarding updates on project status, meeting
                reminders, marketing, and general communication related to the projects from{' '}
                <strong className="text-white/60">Massive Designs</strong> about my inquiry. You may opt out by
                replying STOP or reply HELP for more information. Message frequency varies. Message and data rates
                may apply. You may review our{' '}
                <a href="/privacy-policy/" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  Privacy Policy
                </a>{' '}
                to learn how your data is used.
              </label>
            </div>

            <div>
              <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} onChange={setRecaptchaToken} theme="dark" />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {status === 'submitting' ? 'Sending...' : 'Send'}
            </button>

            {status === 'success' && <p className="text-sm text-primary">Thanks! Your order request has been received.</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
