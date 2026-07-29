import { Link } from 'react-router-dom';
import Reveal from '../motion/Reveal';
import AmbientGlow from '../motion/AmbientGlow';

export default function ServiceHero({ title, lead, crumb, parent, parentHref, ctaLabel, onCtaClick }) {
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
        {ctaLabel && onCtaClick && (
          <Reveal delay={0.12} as="div" className="mt-8">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1"
            >
              {ctaLabel}
            </button>
          </Reveal>
        )}
        <Reveal delay={0.15} as="nav" aria-label="Breadcrumb" className="mt-6">
          <ol className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-wide text-white/40">
            <li>
              <Link to="/" className="transition-colors hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            {parent && (
              <>
                <li>
                  {parentHref ? (
                    <Link to={parentHref} className="transition-colors hover:text-primary">
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
