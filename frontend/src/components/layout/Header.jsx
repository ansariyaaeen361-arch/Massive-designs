import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu } from 'react-icons/hi';
import { IoChevronDown } from 'react-icons/io5';
import { navLinks } from '../../lib/brand';
import MobileMenu from './MobileMenu';
import logo from '../../assets/img/logo/logo.png';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
            ? 'border-b border-white/10 bg-black/80 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md'
            : 'border-b border-transparent bg-transparent py-6'
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10">
          <Link to="/" className="shrink-0" aria-label="Massive Designs home">
            <img src={logo} alt="Massive Designs" className="h-9 w-auto lg:h-10" />
          </Link>

          <nav className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {navLinks.map((item) => (
                <li key={item.label} className="group relative">
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium uppercase tracking-wide text-white/80 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-1 text-sm font-medium uppercase tracking-wide transition-colors hover:text-primary ${
                          isActive ? 'text-primary' : 'text-white/80'
                        }`
                      }
                    >
                      {item.label}
                      {item.children && (
                        <IoChevronDown className="mt-px text-xs transition-transform duration-300 group-hover:rotate-180" />
                      )}
                    </NavLink>
                  )}

                  {item.children && (
                    <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 pt-4 opacity-0 transition-all duration-300 group-hover:visible group-hover:opacity-100">
                      <ul className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0c10] py-3 shadow-2xl">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              to={child.href}
                              className="block px-6 py-3 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-primary"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <Link
              to="/contact"
              className="hidden rounded-full border border-primary px-6 py-2.5 text-sm font-medium text-primary transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-black lg:inline-block"
            >
              Get In Touch
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-primary hover:text-primary lg:hidden"
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
