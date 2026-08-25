import { useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { gsap } from '../../lib/gsap';
import Reveal from '../motion/Reveal';

const skills = [
  { label: 'Frontend', value: 95 },
  { label: 'Backend', value: 85 },
  { label: 'Mobile Development', value: 80 },
];

export default function WhyUs() {
  const barsRef = useRef(null);

  useGSAP(
    () => {
      gsap.utils.toArray('.skill-bar-fill').forEach((el) => {
        gsap.fromTo(
          el,
          { width: '0%' },
          {
            width: el.dataset.value + '%',
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          },
        );
      });
    },
    { scope: barsRef },
  );

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <Reveal className="lg:col-span-6">
          <img
            src="/img/about/why-us.webp"
            alt="Web design and development in progress at Massive Designs"
            className="h-full max-h-[520px] w-full rounded-[2rem] object-cover"
          />
        </Reveal>

        <div className="lg:col-span-6">
          <Reveal delay={0.05}>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Why Us</p>
            <h3 className="mt-4 text-3xl sm:text-4xl">
              Why Choose Us <span className="text-primary">The Difference Is in the Details</span>
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-white/50">
              Choosing a web design and development partner in Texas should feel straightforward, not risky. This{' '}
              <Link href="/" className="text-primary hover:underline">
                Texas web design agency
              </Link>{' '}
              takes time to understand how your site needs to work for real customers, then designs, tests, and
              refines pages so structure, content, and performance support everyday enquiries, search visibility, and
              long-term use.
            </p>
          </Reveal>

          <div ref={barsRef} className="mt-10 flex flex-col gap-6">
            {skills.map((skill) => (
              <div key={skill.label}>
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/60">
                  <span>{skill.label}</span>
                  <span className="text-white">{skill.value}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="skill-bar-fill h-full rounded-full bg-primary"
                    data-value={skill.value}
                    style={{ width: 0 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
