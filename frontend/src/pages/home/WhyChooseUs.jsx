import { Link } from 'react-router-dom';
import Reveal from '../../components/motion/Reveal';
import AmbientGlow from '../../components/motion/AmbientGlow';
import whyChooseOne from '../../assets/img/home/why-choose-one.png';
import whyChooseTwo from '../../assets/img/home/why-choose-two.png';
import whyChooseThree from '../../assets/img/home/why-choose-three.png';

const points = [
  'Unparalleled development, marketing, UI design, and app design experience.',
  'Established reputation of more than 200 content customers.',
  'A holistic strategy, branding, web design, and marketing.',
  'A full-time team of experts focused on achieving success.',
];

export default function WhyChooseUs() {
  return (
    <section className="relative isolate py-16 lg:py-24">
      <AmbientGlow position="bottom-right" size="lg" intensity="low" />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <Reveal className="lg:col-span-6">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Why Choose Us</p>
          <h3 className="mt-4 text-4xl sm:text-5xl">
            Why Choose <span className="text-primary">Massive Designs</span>
          </h3>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/50">
            Massive Designs has been a pioneering web design and development company since 2020. Our reputation is
            based on excellence, integrity, and customer satisfaction. We possess a pool of strategic and creative
            professionals providing solutions, bringing about positive business effects. Our success is based on:
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-white/70">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {point}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/50">
            Our vision is to be a trailblazing force in the world of web design and development, recognized for our
            unwavering commitment to excellence, integrity, and customer satisfaction.
          </p>

          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-black"
          >
            Explore More
          </Link>
        </Reveal>

        <Reveal delay={0.1} y={40} className="grid grid-cols-2 gap-4 lg:col-span-6">
          <img
            src={whyChooseOne}
            alt="Massive Designs brand identity and logo design on screen"
            className="col-span-2 h-[320px] w-full rounded-[2rem] object-cover"
          />
          <img
            src={whyChooseTwo}
            alt="Massive Designs developer working late on a project"
            className="h-40 w-full rounded-2xl object-cover sm:h-48"
          />
          <img
            src={whyChooseThree}
            alt="Massive Designs website design mockups glowing on screen"
            className="h-40 w-full rounded-2xl object-cover sm:h-48"
          />
        </Reveal>
      </div>
    </section>
  );
}
