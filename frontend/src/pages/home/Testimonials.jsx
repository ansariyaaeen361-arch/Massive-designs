import { useEffect, useRef, useState } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { gsap } from '../../lib/gsap';
import Reveal from '../../components/motion/Reveal';
import { testimonials } from './testimonialsData';
import trustpilotBadge from '../../assets/img/home/trust-pilot.webp';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];
  const cardRef = useRef(null);

  const embedSrc = `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(current.href)}&show_text=true&width=500`;

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', overwrite: 'auto' },
    );
  }, [index]);

  const goPrev = () => setIndex((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Testimonials</p>
            <h3 className="mt-4 text-4xl sm:text-5xl">
              What Our <span className="text-primary">Clients Say</span>
            </h3>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
              Our clients have their way to tell everything about our approach. Their words speak of our commitment
              to excellence and how we make their visions come true.
            </p>

            <a
              href="https://www.trustpilot.com/review/massive-designs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex max-w-sm items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-primary/40"
            >
              <img src={trustpilotBadge} alt="" className="h-10 w-auto shrink-0" />
              <span className="text-xs leading-relaxed text-white/50">
                See our verified reviews on <span className="text-white">Trustpilot</span>
              </span>
            </a>

            <div className="mt-8 flex items-center gap-5">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={goPrev}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-primary hover:text-primary"
              >
                <HiChevronLeft className="text-lg" />
              </button>
              <span className="text-xs uppercase tracking-wide text-white/40">
                {index + 1} / {testimonials.length}
              </span>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={goNext}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-primary hover:text-primary"
              >
                <HiChevronRight className="text-lg" />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={36}>
            <div ref={cardRef} className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white lg:mx-0 lg:ml-auto">
              <iframe
                key={current.href}
                src={embedSrc}
                title={`Facebook review ${index + 1}`}
                style={{ width: '100%', height: current.height, border: 'none', overflow: 'hidden' }}
                scrolling="no"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
