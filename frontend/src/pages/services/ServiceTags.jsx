import { Link } from 'react-router-dom';
import Reveal from '../../components/motion/Reveal';
import { sliderItems } from './servicesData';

export default function ServiceTags() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-10">
        <Reveal className="mx-auto max-w-3xl">
          <h3 className="text-2xl sm:text-3xl">
            We offer comprehensive services that help businesses establish a{' '}
            <span className="text-primary">strong online presence.</span>
          </h3>
        </Reveal>

        <Reveal delay={0.1} as="div" className="mt-10 flex flex-wrap justify-center gap-4">
          {sliderItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
