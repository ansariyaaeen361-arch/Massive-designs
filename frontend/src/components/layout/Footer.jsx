import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import { brand, footerQuickLinks } from '../../lib/brand';
import SocialLinks from './SocialLinks';
import logo from '../../assets/img/logo/logo.png';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer className="relative bg-black">
      <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-24 lg:px-10">
        <div className="flex flex-wrap items-start gap-x-8 gap-y-14">
          <div className="w-full md:basis-[38%] lg:basis-[30%]">
            <Link to="/">
              <img src={logo} alt="Massive Designs" className="h-12 w-auto" />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
              Where Creativity Meets Strategy — Design, Development, and Marketing for Impactful Growth.
            </p>
            <SocialLinks className="mt-8" />
          </div>

          <div className="basis-[45%] md:basis-[18%] lg:basis-[16%]">
            <h3 className="font-heading text-lg text-white">Quick Links</h3>
            <ul className="mt-6 flex flex-col gap-3">
              {footerQuickLinks.map((link) =>
                link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/50 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-white/50 transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="basis-[45%] md:basis-[18%] lg:basis-[16%]">
            <h3 className="font-heading text-lg text-white">Contact Info</h3>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <a href={brand.phoneTel} className="text-sm text-white/50 transition-colors hover:text-primary">
                  {brand.phoneDisplay}
                </a>
              </li>
              <li className="text-sm leading-relaxed text-white/50">{brand.location}</li>
            </ul>
          </div>

          <div className="w-full md:basis-[30%] lg:flex-1">
            <h3 className="font-heading text-lg text-white">Newsletter</h3>
            <form
              onSubmit={handleSubmit}
              className="mt-6 flex items-center gap-2 border-b border-white/20 pb-2 transition-colors focus-within:border-primary"
            >
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
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

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/50 sm:flex-row lg:px-10">
          <p>Copyright © 2020-2025 {brand.name}. All rights reserved.</p>
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/privacy-policy/" className="transition-colors hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-conditions/" className="transition-colors hover:text-primary">
                Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
