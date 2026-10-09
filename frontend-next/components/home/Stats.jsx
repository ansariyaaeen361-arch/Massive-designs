import Reveal from '../motion/Reveal';
import Counter from '../motion/Counter';

const stats = [
  { value: 200, suffix: '+', label: 'Creative professionals' },
  { value: 5, suffix: '+', label: 'Years of experience' },
  { value: 200, suffix: '+', label: 'Happy customers' },
  { value: 9, suffix: '', label: 'Texas cities served' },
];

export default function Stats() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">By the numbers</p>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-14 lg:grid-cols-4 lg:gap-x-10">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08} y={36} className="stat-item border-t border-white/15 pt-8">
              <p className="stat-number font-heading text-white">
                <Counter to={stat.value} />
                <span className="text-primary">{stat.suffix}</span>
              </p>
              <p className="mt-5 text-sm font-medium uppercase tracking-[0.2em] text-white/60">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
