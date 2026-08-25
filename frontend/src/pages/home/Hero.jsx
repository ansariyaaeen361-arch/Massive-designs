import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import { gsap } from '../../lib/gsap';
import AmbientGlow from '../../components/motion/AmbientGlow';
import heroMain from '../../assets/img/home/banner-main.webp';
import heroIcon from '../../assets/img/home/dm-hero.png';

const tickerItems = [
  'Branding & Logo',
  'Web Design & Development',
  'Social Media Marketing',
  'Content Marketing',
  'SEO Services',
  'Mobile App Development',
];

export default function Hero() {
  const rootRef = useRef(null);
  const imgRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.hero-eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('.hero-line', { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.3')
        .fromTo('.hero-sub', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.35')
        .fromTo('.hero-copy', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.35')
        .fromTo(imgRef.current, { opacity: 0, scale: 1.1 }, { opacity: 1, scale: 1, duration: 1 }, '-=1.1');

      gsap.to(imgRef.current, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: rootRef },
  );

  return (
    <section ref={rootRef} className="relative isolate overflow-hidden">
      <AmbientGlow position="top-left" size="xl" intensity="medium" />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 pb-14 pt-32 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pt-40">
        <div className="lg:col-span-7">
          <p className="hero-eyebrow text-xs font-medium uppercase tracking-[0.35em] text-primary">
            Full-Service Digital Marketing Agency Texas
          </p>

          <h1 className="mt-6 text-4xl leading-[1.1] sm:text-6xl lg:text-7xl">
            <span className="hero-line block overflow-hidden">
              Texas Web Design <span className="text-primary">&amp;</span>
            </span>
            <span className="hero-line block overflow-hidden">Digital Marketing</span>
            <span className="hero-line block overflow-hidden">Agency</span>
          </h1>

          <div className="hero-sub mt-8 flex items-center gap-4">
            <img src={heroIcon} alt="" className="h-9 w-9 shrink-0" />
            <h2 className="text-lg text-white sm:text-xl">
              Custom Websites <span className="text-primary">Powerful Branding - Measurable Growth</span>
            </h2>
          </div>

          <p className="hero-copy mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Massive Designs creates new solutions, assisting the future of brands in Texas. Our agency is based in
            North Richland Hills and has more than <span className="text-white">200 creative professionals</span>{' '}
            valuing strategy and results based on design.
          </p>

          <div className="hero-cta mt-9">
            <Link
              to="/projects/"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1"
            >
              Show Projects
              <span className="inline-flex transition-transform duration-300 group-hover:translate-x-1">
                <HiArrowRight className="text-base" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div ref={imgRef} className="relative overflow-hidden rounded-[2rem]">
            <img
              src={heroMain}
              alt="Massive Designs strategy, design, development and growth showcase"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="relative mt-16 border-t border-white/10 bg-black/50 sm:mt-10">
        <div className="marquee-mask py-4">
          <div className="flex w-max animate-marquee items-center gap-10">
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="flex shrink-0 items-center gap-10 text-xs uppercase tracking-[0.25em] text-white/40">
                {item}
                <span className="h-1 w-1 rounded-full bg-primary" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
