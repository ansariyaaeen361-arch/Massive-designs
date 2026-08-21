import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import { gsap } from '../../lib/gsap';
import Reveal from '../../components/motion/Reveal';
import useTilt from '../../hooks/useTilt';

import srvWebDesign from '../../assets/img/home/dm-srv08.webp';
import srvBranding from '../../assets/img/home/dm-srv05.webp';
import srvSeo from '../../assets/img/home/dm-srv-old-08.webp';
import srvApp from '../../assets/img/home/dm-srv07.webp';
import srvContent from '../../assets/img/home/dm-srv02.webp';
import srvSocial from '../../assets/img/home/dm-srv003.webp';

const services = [
  {
    number: '01',
    title: 'Web Design & Development',
    href: '/web-design-development',
    image: srvWebDesign,
    description:
      'Your brand deserves more than conventional marketing. It merits a story that resonates, a design that inspires, and a strategy that succeeds. This is what we do at Massive Designs. If you’re ready to grow your business with a trusted creative marketing agency that Texas brands recommend, reach out to us today. Let us make your vision come true and make your next big idea happen.',
  },
  {
    number: '02',
    title: 'Branding Agency',
    href: '/branding-logo-design',
    image: srvBranding,
    description:
      'A consistent brand helps clients recognize you across proposals, meetings, and campaigns. Massive design, as a branding agency, develops your logo, visual system, and core message into working guidelines, so your website, presentations, and marketing materials all support the same positioning and make follow‑up conversations easier.',
  },
  {
    number: '03',
    title: 'SEO Services',
    href: '/seo-services',
    image: srvSeo,
    description:
      'SEO services in Texas should help people find you when they are already looking for options. The work here reviews search intent, key pages, and technical basics, then makes measured updates that improve how you appear in results and support a steady flow of relevant visits over time.',
  },
  {
    number: '04',
    title: 'App Development',
    href: '/mobile-app-development',
    image: srvApp,
    description:
      'Texas app development is approached as part of your wider operations, not as a stand‑alone product. Web and mobile apps are planned around your existing processes, then built for reliability and straightforward use, so staff and customers can complete routine tasks without extra training or confusion.',
  },
  {
    number: '05',
    title: 'Content Marketing',
    href: '/content-marketing',
    image: srvContent,
    description:
      'Content marketing is used to answer real questions your buyers raise in calls and emails. Articles, landing pages, and supporting assets are planned around those topics, giving your sales team useful material to share and helping searchers understand your approach before they speak with you.',
  },
  {
    number: '06',
    title: 'Social Media Marketing',
    href: '/social-media-marketing',
    image: srvSocial,
    description:
      'Social media marketing is treated as an extension of your main campaigns, not a separate activity. Posting schedules, formats, and messages are aligned with current offers and events, keeping your business present in local feeds and sending interested visitors back to key pages on your site.',
  },
];

export default function Services() {
  const [active, setActive] = useState(0);
  const current = services[active];
  const panelRef = useRef(null);
  const imgWrapRef = useRef(null);
  useTilt(imgWrapRef);

  useEffect(() => {
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' },
    );
  }, [active]);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Services</p>
          <h3 className="mt-4 max-w-2xl text-4xl sm:text-5xl">
            Web Design &amp; Digital Marketing <span className="text-primary">Services in Texas</span>
          </h3>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal delay={0.1} className="lg:col-span-6">
            <ul>
              {services.map((service, i) => (
                <li key={service.title} className="border-b border-white/10">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className="flex w-full items-center gap-6 py-5 text-left"
                  >
                    <span
                      className={`font-heading text-sm transition-colors duration-300 ${
                        active === i ? 'text-primary' : 'text-white/30'
                      }`}
                    >
                      .{service.number}
                    </span>
                    <span
                      className={`text-xl transition-colors duration-300 sm:text-2xl ${
                        active === i ? 'text-primary' : 'text-white'
                      }`}
                    >
                      {service.title}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="lg:col-span-6">
            <div ref={panelRef}>
              <div ref={imgWrapRef} className="overflow-hidden rounded-3xl">
                <img src={current.image} alt={current.title} className="aspect-[4/3] w-full object-cover" />
              </div>
              <p className="mt-6 text-sm leading-relaxed text-white/50">{current.description}</p>
              <Link
                to={current.href}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-primary transition-transform duration-300 hover:translate-x-1"
              >
                Learn More <HiArrowRight className="inline text-base" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
