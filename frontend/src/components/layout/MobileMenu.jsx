import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiX, HiChevronDown } from 'react-icons/hi';
import { gsap } from '../../lib/gsap';
import { navLinks, brand } from '../../lib/brand';
import SocialLinks from './SocialLinks';
import logo from '../../assets/img/logo/logo.png';

export default function MobileMenu({ open, onClose }) {
  const [openLabel, setOpenLabel] = useState(null);
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const childRefs = useRef({});

  useLayoutEffect(() => {
    gsap.set(panelRef.current, { xPercent: 100 });
    gsap.set(overlayRef.current, { opacity: 0 });
  }, []);

  useEffect(() => {
    if (open) {
      gsap.set(rootRef.current, { pointerEvents: 'auto' });
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(panelRef.current, { xPercent: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    } else {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, ease: 'power2.in', overwrite: 'auto' });
      gsap.to(panelRef.current, {
        xPercent: 100,
        duration: 0.4,
        ease: 'power3.in',
        overwrite: 'auto',
        onComplete: () => gsap.set(rootRef.current, { pointerEvents: 'none' }),
      });
    }
  }, [open]);

  useEffect(() => {
    navLinks.forEach((item) => {
      if (!item.children) return;
      const el = childRefs.current[item.label];
      if (!el) return;
      const isOpen = openLabel === item.label;
      gsap.to(el, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        duration: 0.35,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    });
  }, [openLabel]);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-[60] lg:hidden">
      <div ref={overlayRef} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={panelRef}
        className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col overflow-y-auto bg-[#0b0c10] px-7 py-7"
      >
        <div className="flex items-center justify-between">
          <Link to="/" onClick={onClose}>
            <img src={logo} alt="Massive Designs" className="h-9 w-auto" />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-primary hover:text-primary"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        <nav className="mt-10">
          <ul className="flex flex-col">
            {navLinks.map((item) => (
              <li key={item.label} className="border-b border-white/5 py-1">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setOpenLabel((v) => (v === item.label ? null : item.label))}
                      aria-expanded={openLabel === item.label}
                      className="flex w-full items-center justify-between py-3 text-left text-base font-medium uppercase tracking-wide text-white/85"
                    >
                      {item.label}
                      <HiChevronDown
                        className={`transition-transform duration-300 ${openLabel === item.label ? 'rotate-180 text-primary' : ''}`}
                      />
                    </button>
                    <ul
                      ref={(el) => {
                        childRefs.current[item.label] = el;
                      }}
                      className="h-0 overflow-hidden pl-2 opacity-0"
                    >
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            to={child.href}
                            onClick={onClose}
                            className="block py-2.5 text-sm text-white/60 transition-colors hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block py-3 text-base font-medium uppercase tracking-wide text-white/85 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                ) : (
                  <NavLink
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block py-3 text-base font-medium uppercase tracking-wide transition-colors hover:text-primary ${
                        isActive ? 'text-primary' : 'text-white/85'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to="/contact/"
          onClick={onClose}
          className="mt-8 rounded-full border border-primary px-6 py-3 text-center text-sm font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-black"
        >
          Get In Touch
        </Link>

        <div className="mt-auto pt-10">
          <div className="flex flex-col gap-2 text-sm">
            <a href={brand.emailLink} className="text-white/70 transition-colors hover:text-primary">
              {brand.email}
            </a>
            <a href={brand.phoneTel} className="text-white/70 transition-colors hover:text-primary">
              {brand.phoneDisplay}
            </a>
          </div>
          <SocialLinks className="mt-5" />
        </div>
      </div>
    </div>
  );
}
