import { Link } from 'react-router-dom';
import Reveal from '../../components/motion/Reveal';
import { sliderItems } from './servicesData';

export default function ServiceSlider() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">What We Offer</p>
          <p className="mt-5 text-sm leading-relaxed text-white/50 sm:text-base">
            We provide end to end digital solutions enabling brands to thrive online. We're creative, technological
            and strategic in providing meaningful results. Innovation and result orientation drives every project.
            Massive Designs doesn't follow trends, we are trendsetters. Your business will shine in an overcrowded
            digital world.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} y={40} className="mt-12">
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden">
          {sliderItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="group relative aspect-[3/4] w-64 shrink-0 overflow-hidden rounded-3xl sm:w-72"
            >
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-6 text-lg text-white">{item.title}</p>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
