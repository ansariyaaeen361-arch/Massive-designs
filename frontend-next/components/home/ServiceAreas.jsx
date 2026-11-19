import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import Reveal from '../motion/Reveal';
import { brand, socialLinks } from '../../lib/brand';

const socialIcons = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
};

const cities = [
  { name: 'Austin', slug: 'austin' },
  { name: 'Dallas', slug: 'dallas' },
  { name: 'Houston', slug: 'houston' },
  { name: 'San Antonio', slug: 'san-antonio' },
  { name: 'Fort Worth', slug: 'fort-worth' },
  { name: 'North Richland Hills', slug: 'north-richland-hills' },
  { name: 'Arlington', slug: 'arlington' },
  { name: 'Irving', slug: 'irving' },
  { name: 'Grand Prairie', slug: 'grand-prairie' },
];

export default function ServiceAreas() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <h2 className="text-4xl sm:text-5xl">
              Proudly Serving Businesses <span className="text-primary">across Texas</span>
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-white/50">
              We provide the best web design and digital marketing solutions to companies across Texas, with{' '}
              <Link href="/areas-we-serve/austin" className="text-primary hover:underline">
                Austin
              </Link>
              ,{' '}
              <Link href="/areas-we-serve/dallas" className="text-primary hover:underline">
                Dallas
              </Link>
              ,{' '}
              <Link href="/areas-we-serve/houston" className="text-primary hover:underline">
                Houston
              </Link>
              , and{' '}
              <Link href="/areas-we-serve/san-antonio" className="text-primary hover:underline">
                San Antonio
              </Link>{' '}
              as the main bases of our diverse markets and cultural diversity, and{' '}
              <Link href="/areas-we-serve/fort-worth" className="text-primary hover:underline">
                Fort Worth
              </Link>{' '}
              as the entrepreneurship hub. Ready to transform your brand? Contact us today at{' '}
              <a href={brand.emailLink} className="text-primary hover:underline">
                {brand.email}
              </a>{' '}
              or call{' '}
              <a href={brand.phoneTel} className="text-primary hover:underline">
                {brand.phoneDisplay}
              </a>{' '}
              to start your journey towards digital success.
            </p>
          </Reveal>

          <Reveal delay={0.1} y={36} className="lg:col-span-5">
            <div className="h-full rounded-3xl border border-white/10 bg-white/5 p-8">
              <Link
                href="/areas-we-serve"
                className="text-xs font-medium uppercase tracking-[0.3em] text-primary hover:underline"
              >
                Areas We Serve
              </Link>
              <ul className="mt-6 flex flex-col gap-4">
                {cities.map((city) => (
                  <li
                    key={city.slug}
                    className="flex items-center gap-3 border-b border-white/10 pb-4 last:border-0 last:pb-0"
                  >
                    <HiOutlineLocationMarker className="text-lg text-primary" />
                    <Link
                      href={`/areas-we-serve/${city.slug}`}
                      className="text-base text-white transition-colors hover:text-primary"
                    >
                      {city.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} as="div" className="mt-12 grid grid-cols-1 gap-10 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div>
            <h4 className="font-heading text-base text-white">Location</h4>
            <p className="mt-3 text-sm leading-relaxed text-white/50">{brand.location}</p>
          </div>
          <div>
            <h4 className="font-heading text-base text-white">Contact</h4>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              <a href={brand.emailLink} className="block transition-colors hover:text-primary">
                {brand.email}
              </a>
              <span>or call </span>
              <a href={brand.phoneTel} className="transition-colors hover:text-primary">
                {brand.phoneDisplay}
              </a>
            </p>
          </div>
          <div>
            <h4 className="font-heading text-base text-white">Social</h4>
            <ul className="mt-3 flex items-center gap-4">
              {socialLinks.map(({ name, url }) => {
                const Icon = socialIcons[name];
                return (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-primary"
                    >
                      <Icon className="text-base" />
                      {name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
