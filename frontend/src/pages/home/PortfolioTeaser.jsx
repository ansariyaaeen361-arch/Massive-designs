import { Link } from 'react-router-dom';
import { HiArrowRight, HiArrowUpRight } from 'react-icons/hi2';
import Reveal from '../../components/motion/Reveal';
import portImg01 from '../../assets/img/home/port-img01.webp';
import portImg02 from '../../assets/img/home/port-img02.webp';

const items = [
  {
    image: portImg01,
    title: 'Creative Brand design',
    category: 'Design, Development & Identity',
  },
  {
    image: portImg02,
    title: 'Momentum Website design',
    category: 'Design, Development & 3D Motion',
  },
];

export default function PortfolioTeaser() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Portfolio</p>
            <h3 className="mt-4 text-4xl sm:text-5xl">
              Our Recent Web <span className="text-primary">Design Projects</span>
            </h3>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="text-sm leading-relaxed text-white/50">
              We have several projects, and this is shown in our portfolio across Texas and beyond. We have
              undertaken innovative brand design projects involving designing, developing, brand identity and
              creative web design with 3D motion effects. These are always amazing and interesting to view.
            </p>
            <Link
              to="/projects"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-white transition-transform duration-300 hover:translate-x-1 hover:text-primary"
            >
              See More Work <HiArrowRight className="inline text-base" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1} y={36} className="group relative">
              <Link to="/projects" className="relative block aspect-[1345/1170] overflow-hidden rounded-3xl">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-black opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <HiArrowUpRight className="text-xl" aria-hidden="true" />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="text-xs uppercase tracking-wide text-primary">{item.category}</p>
                  <p className="mt-2 text-2xl text-white">{item.title}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
