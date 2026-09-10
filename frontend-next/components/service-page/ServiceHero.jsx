import Link from 'next/link';
import Reveal from '../motion/Reveal';
import AmbientGlow from '../motion/AmbientGlow';
import { trackEvent } from '../../lib/analytics';

export default function ServiceHero({ title, lead, crumb, parent, parentHref, ctaLabel, onCtaClick, ctaHref }) {
  const ctaClassName =
    'inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1';
  const handleCtaClick = () => {
    trackEvent(ctaHref?.startsWith('tel:') ? 'call_click' : 'cta_click', { source: 'service_hero', label: crumb ?? title });
    onCtaClick?.();
  };
  return (
    <section className="relative isolate border-b border-white/10 pb-14 pt-36 lg:pt-44">
      <AmbientGlow position="top-left" size="md" intensity="medium" />
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
        <Reveal as="h1" className="text-4xl sm:text-5xl lg:text-6xl">
          {title}
        </Reveal>
        {lead && (
          <Reveal delay={0.1} as="p" className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
            {lead}
          </Reveal>
        )}
        {ctaLabel && ctaHref && (
          <Reveal delay={0.12} as="div" className="mt-8">
            <a href={ctaHref} onClick={handleCtaClick} className={ctaClassName}>
              {ctaLabel}
            </a>
          </Reveal>
        )}
        {ctaLabel && onCtaClick && (
          <Reveal delay={0.12} as="div" className="mt-8">
            <button type="button" onClick={handleCtaClick} className={ctaClassName}>
              {ctaLabel}
            </button>
          </Reveal>
        )}
        <Reveal delay={0.15} as="nav" aria-label="Breadcrumb" className="mt-6">
          <ol className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-wide text-white/40">
            <li>
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {parent && (
              <>
                <li>
                  {parentHref ? (
                    <Link href={parentHref} className="transition-colors hover:text-primary">
                      {parent}
                    </Link>
                  ) : (
                    parent
                  )}
                </li>
                <li aria-hidden="true">/</li>
              </>
            )}
            <li className="text-primary">{crumb ?? title}</li>
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
