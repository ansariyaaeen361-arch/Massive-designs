import Link from 'next/link';
import { HiArrowUpRight } from 'react-icons/hi2';
import Reveal from '../motion/Reveal';

const services = [
  {
    number: '01',
    title: 'Web Design & Development',
    href: '/web-design-development',
    image: '/img/home/dm-srv08.webp',
    description:
      'Your brand deserves more than conventional marketing. It merits a story that resonates, a design that inspires, and a strategy that succeeds. If you’re ready to grow your business with a trusted creative marketing agency that Texas brands recommend, reach out to us today.',
    span: 'md:col-span-2 lg:col-span-7 lg:row-span-2',
    big: true,
  },
  {
    number: '02',
    title: 'Branding Agency',
    href: '/branding-logo-design',
    image: '/img/home/dm-srv05.webp',
    description:
      'A consistent brand helps clients recognize you across proposals, meetings, and campaigns. We turn your logo, visual system, and core message into working guidelines.',
    span: 'lg:col-span-5',
  },
  {
    number: '03',
    title: 'SEO Services',
    href: '/seo-services',
    image: '/img/home/dm-srv-old-08.webp',
    description:
      'SEO that helps people find you when they are already looking for options, with measured updates that bring a steady flow of relevant visits.',
    span: 'lg:col-span-5',
  },
  {
    number: '04',
    title: 'App Development',
    href: '/mobile-app-development',
    image: '/img/home/dm-srv07.webp',
    span: 'lg:col-span-4',
  },
  {
    number: '05',
    title: 'Content Marketing',
    href: '/content-marketing',
    image: '/img/home/dm-srv02.webp',
    span: 'lg:col-span-4',
  },
  {
    number: '06',
    title: 'Social Media Marketing',
    href: '/social-media-marketing',
    image: '/img/home/dm-srv003.webp',
    span: 'md:col-span-2 lg:col-span-4',
  },
];

export default function Services() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Services</p>
          <h3 className="mt-4 max-w-2xl text-4xl sm:text-5xl">
            Web Design &amp; Digital Marketing <span className="text-primary">Services in Texas</span>
          </h3>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(250px,auto)]">
          {services.map((service, i) => (
            <Reveal key={service.title} delay={i * 0.06} y={40} className={`${service.span} h-full`}>
              <Link
                href={service.href}
                className={`keep-dark glass-tile group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] p-7 sm:p-9 ${
                  service.big ? 'min-h-[420px] lg:min-h-[560px]' : 'min-h-[260px]'
                }`}
                style={{ background: 'linear-gradient(150deg, #11161c 0%, #070a0d 100%)' }}
              >
                <img
                  src={service.image}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                  className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-[900ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

                <div className="relative flex items-start justify-between">
                  <span className="font-heading text-sm tracking-widest text-primary">.{service.number}</span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-white transition-all duration-500 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-black">
                    <HiArrowUpRight className="text-xl" aria-hidden="true" />
                  </span>
                </div>

                <div className="relative">
                  <h4
                    className={`font-body font-semibold leading-tight tracking-tight text-white ${
                      service.big ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
                    }`}
                  >
                    {service.title}
                  </h4>
                  {service.description && (
                    <p
                      className={`mt-4 text-white/70 ${
                        service.big ? 'max-w-xl text-sm sm:text-base' : 'line-clamp-3 max-w-md text-sm'
                      }`}
                    >
                      {service.description}
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
