import { Link } from 'react-router-dom';
import Reveal from '../../components/motion/Reveal';
import { services } from './servicesData';

export default function ServiceShowcase() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Our Services</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">
            Digital Experience <span className="text-primary">&amp; Strategy</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/50">
            Massive Designs is a digital agency in Texas that helps brands turn ideas into digital experiences
            people actually want to use. We bring strategy, design, and technology together so that your website,
            app, and content feel connected and intentional. The focus is simple in order to reach the right
            people, keep them interested, and give them a good enough experience that they choose to come back.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-16 lg:mt-20 lg:gap-24">
          {services.map((service, i) => {
            const reversed = i % 2 === 1;
            return (
              <div
                key={service.title}
                className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                  reversed ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <Reveal y={36}>
                  <Link to={service.href} className="block overflow-hidden rounded-[2rem]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </Link>
                </Reveal>
                <Reveal delay={0.1}>
                  <img src={service.icon} alt="" className="h-12 w-12" />
                  <h3 className="mt-6 text-2xl sm:text-3xl">{service.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/50">{service.description}</p>
                  <Link
                    to={service.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-primary transition-transform duration-300 hover:translate-x-1"
                  >
                    Learn More &rarr;
                  </Link>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
