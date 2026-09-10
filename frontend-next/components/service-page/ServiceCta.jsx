import Reveal from '../motion/Reveal';
import AmbientGlow from '../motion/AmbientGlow';
import { trackEvent } from '../../lib/analytics';

export default function ServiceCta({ heading, paragraphs, buttonLabel, buttonHref }) {
  const handleClick = () => {
    trackEvent(buttonHref?.startsWith('mailto:') ? 'email_click' : 'cta_click', {
      source: 'service_cta',
      label: buttonLabel,
    });
  };

  return (
    <section className="relative isolate py-16 lg:py-24">
      <AmbientGlow position="bottom-right" size="md" intensity="medium" />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-14 text-center sm:px-16">
          <h2 className="text-3xl sm:text-4xl">{heading}</h2>
          <div className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/50">
            {paragraphs.map((p, i) => (
              <p key={i} className={i > 0 ? 'mt-4' : ''}>
                {p}
              </p>
            ))}
          </div>
          <a
            href={buttonHref}
            onClick={handleClick}
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1"
          >
            {buttonLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
