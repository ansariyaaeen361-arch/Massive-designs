import { Link } from 'react-router-dom';
import Reveal from '../../components/motion/Reveal';
import Counter from '../../components/motion/Counter';
import StatBadge from '../../components/motion/StatBadge';
import AmbientGlow from '../../components/motion/AmbientGlow';
import { brand } from '../../lib/brand';
import introImg from '../../assets/img/about/computer-science.webp';

const stats = [
  { value: 100, suffix: '+', label: 'Projects Delivered' },
  { value: 5, suffix: '+', label: 'Years Experience' },
  { value: 88, suffix: '+', label: 'Happy Clients' },
];

export default function AboutIntro() {
  return (
    <section className="relative isolate py-16 lg:py-24">
      <AmbientGlow position="top-left" size="lg" intensity="medium" />
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">About {brand.name}</p>
            <h2 className="mt-4 text-3xl sm:text-4xl">
              About Massive Designs <span className="text-primary">Your Partner in Creative Growth</span>
            </h2>
            <h3 className="mt-8 text-xl text-white sm:text-2xl">Who We Are and What We Do?</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              At Massive Designs, we help brands grow by connecting creativity with strategy. If you're ready to
              create a memorable brand, the best time to start is now. We believe in design that tells stories,
              marketing that evokes emotion, and strategy that delivers results.
            </p>

            <h3 className="mt-8 text-xl text-white sm:text-2xl">How Massive Designs Grew into a Texas Creative Partner</h3>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Massive Designs was built on a simple principle that design should do more than look good. It should
              move people. Over the past five years, our founder has helped local Texas brands compete with national
              names through strong creative direction. From a small studio, we've grown into a full-service creative
              marketing agency that Texas businesses rely on for strategy, storytelling, and design-driven results.{' '}
              <Link to="/projects" className="text-primary hover:underline">
                Every project of ours
              </Link>{' '}
              is treated as a shared success story shaped by listening, collaboration, and purposeful creativity.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-heading text-3xl text-primary sm:text-4xl">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} y={36} className="relative lg:col-span-5">
            <img
              src={introImg}
              alt="Massive Designs team working across development and design tools"
              className="aspect-[3/4] w-full rounded-[2rem] object-cover"
            />
            <StatBadge value={5} suffix="+" label="Year of Experience" className="-bottom-6 -left-6 sm:-left-10" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
