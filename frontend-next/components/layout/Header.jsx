import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HiMenu, HiSun, HiMoon } from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';
import { navLinks, brand } from '../../lib/brand';
import { trackEvent } from '../../lib/analytics';
import { useTheme } from '../../context/ThemeContext';
import MobileMenu from './MobileMenu';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? isLight
              ? 'border-b border-black/10 bg-white/90 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-md'
              : 'border-b border-white/10 bg-black/80 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <Link href="/" className="shrink-0" aria-label="Massive Designs home">
            <img src="/img/logo/logo.png" alt="Massive Designs" className="h-9 w-auto lg:h-10" />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navLinks.map((item) => {
                const isActive = router.pathname === item.href;
                return (
                  <li key={item.label} className="group relative">
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${isLight ? 'text-black/70' : 'text-white/80'}`}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center gap-1 text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${
                          isActive ? 'text-primary' : isLight ? 'text-black/70' : 'text-white/80'
                        }`}
                      >
                        {item.label}
                        {item.children && (
                          <IoChevronDown className="mt-px text-xs transition-transform duration-300 group-hover:rotate-180" />
                        )}
                      </Link>
                    )}

                    {item.children && item.mega ? (
                      <div className="invisible absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                        <div className={`overflow-hidden rounded-2xl border p-5 shadow-2xl ${isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#0b0c10]'}`}>
                          <p className={`px-1 pb-3 text-[11px] font-medium uppercase tracking-[0.2em] ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                            Texas Cities We Serve
                          </p>
                          <ul className="grid grid-cols-2 gap-1">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  className={`block rounded-xl px-4 py-3 text-sm transition-colors hover:text-primary ${isLight ? 'text-black/60 hover:bg-black/5' : 'text-white/70 hover:bg-white/5'}`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      item.children && (
                        <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                          <ul className={`overflow-hidden rounded-2xl border py-3 shadow-2xl ${isLight ? 'border-black/10 bg-white' : 'border-white/10 bg-[#0b0c10]'}`}>
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  className={`block px-6 py-3 text-sm transition-colors hover:text-primary ${isLight ? 'text-black/60 hover:bg-black/5' : 'text-white/70 hover:bg-white/5'}`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
              onClick={toggleTheme}
              className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 ${
                isLight
                  ? 'border-black/15 text-black/60 hover:border-primary hover:text-primary'
                  : 'border-white/15 text-white/60 hover:border-primary hover:text-primary'
              }`}
            >
              {isLight ? <HiMoon className="text-base" /> : <HiSun className="text-base" />}
            </button>
            <a
              href={brand.phoneTel}
              onClick={() => trackEvent('call_click', { source: 'header' })}
              className="hidden rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-black lg:inline-block"
            >
              Call {brand.phoneDisplay}
            </a>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:border-primary hover:text-primary lg:hidden ${
                isLight ? 'border-black/15 text-black/70' : 'border-white/15 text-white'
              }`}
            >
              <HiMenu className="text-xl" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
