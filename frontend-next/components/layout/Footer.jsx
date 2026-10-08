import { useState } from 'react';
import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi2';
import { brand, footerQuickLinks } from '../../lib/brand';
import { trackEvent } from '../../lib/analytics';
import { useTheme } from '../../context/ThemeContext';
import SocialLinks from './SocialLinks';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    trackEvent('newsletter_signup', { source: 'footer' });
  };

  return (
    <footer className={`relative ${isLight ? 'bg-[#F2F2F7]' : 'bg-black'}`}>
      <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-24 lg:px-10">
        <div className="flex flex-wrap items-start gap-x-8 gap-y-14">
          <div className="w-full md:basis-[38%] lg:basis-[30%]">
            <Link href="/">
              <img src="/img/logo/logo.png" alt="Massive Designs" className={`h-12 w-auto ${isLight ? 'invert' : ''}`} />
            </Link>
            <p className={`mt-6 max-w-xs text-sm leading-relaxed ${isLight ? 'text-black/50' : 'text-white/50'}`}>
              Where Creativity Meets Strategy — Design, Development, and Marketing for Impactful Growth.
            </p>
            <SocialLinks className="mt-8" />
          </div>

          <div className="basis-[45%] md:basis-[18%] lg:basis-[16%]">
            <h3 className={`font-heading text-lg ${isLight ? 'text-black' : 'text-white'}`}>Quick Links</h3>
            <ul className="mt-6 flex flex-col gap-3">
              {footerQuickLinks.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm transition-colors hover:text-primary ${isLight ? 'text-black/50' : 'text-white/50'}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link href={link.href} className={`text-sm transition-colors hover:text-primary ${isLight ? 'text-black/50' : 'text-white/50'}`}>
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="basis-[45%] md:basis-[18%] lg:basis-[16%]">
            <h3 className={`font-heading text-lg ${isLight ? 'text-black' : 'text-white'}`}>Contact Info</h3>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <a
                  href={brand.phoneTel}
                  onClick={() => trackEvent('call_click', { source: 'footer' })}
                  className={`text-sm transition-colors hover:text-primary ${isLight ? 'text-black/50' : 'text-white/50'}`}
                >
                  {brand.phoneDisplay}
                </a>
              </li>
              <li className={`text-sm leading-relaxed ${isLight ? 'text-black/50' : 'text-white/50'}`}>{brand.location}</li>
            </ul>
          </div>

          <div className="w-full md:basis-[30%] lg:flex-1">
            <h3 className={`font-heading text-lg ${isLight ? 'text-black' : 'text-white'}`}>Newsletter</h3>
            <form
              onSubmit={handleSubmit}
              className={`mt-6 flex items-center gap-2 border-b pb-2 transition-colors focus-within:border-primary ${isLight ? 'border-black/20' : 'border-white/20'}`}
            >
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-transparent text-sm outline-none ${isLight ? 'text-black placeholder-black/40' : 'text-white placeholder-white/40'}`}
              />
              <button
                type="submit"
                className="shrink-0 text-sm font-medium text-primary transition-transform hover:translate-x-1"
              >
                Send <HiArrowRight className="inline text-base" aria-hidden="true" />
              </button>
            </form>
            {submitted && <p className="mt-3 text-xs text-primary">Thanks for subscribing!</p>}
          </div>
        </div>
      </div>

      <div className={`border-t ${isLight ? 'border-black/10' : 'border-white/10'}`}>
        <div className={`mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-6 text-xs sm:flex-row lg:px-10 ${isLight ? 'text-black/50' : 'text-white/50'}`}>
          <p>Copyright © 2020-2026 {brand.name}. All rights reserved.</p>
          <ul className="flex items-center gap-6">
            <li>
              <Link href="/privacy-policy" className="transition-colors hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-conditions" className="transition-colors hover:text-primary">
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
