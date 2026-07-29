import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import Reveal from '../../components/motion/Reveal';
import { brand, socialLinks } from '../../lib/brand';

const socialIcons = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
};

const cities = ['Austin', 'Dallas', 'Houston', 'San Antonio', 'Fort Worth'];

export default function ServiceAreas() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-7">
            <h3 className="text-4xl sm:text-5xl">
              Proudly Serving Businesses <span className="text-primary">across Texas</span>
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-white/50">
              We provide the best web design and digital marketing solutions to companies across Texas, with Austin,
              Dallas, Houston, and San Antonio as the main bases of our diverse markets and cultural diversity, and
              Fort Worth as the entrepreneurship hub. Ready to transform your brand? Contact us today at{' '}
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
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Areas We Serve</p>
              <ul className="mt-6 flex flex-col gap-4">
                {cities.map((city) => (
                  <li key={city} className="flex items-center gap-3 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <HiOutlineLocationMarker className="text-lg text-primary" />
                    <span className="text-base text-white">{city}</span>
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
