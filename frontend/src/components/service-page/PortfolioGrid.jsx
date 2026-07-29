import Reveal from '../motion/Reveal';

export default function PortfolioGrid({ heading, description, items }) {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl">{heading}</h2>
          {description && <p className="mt-5 text-sm leading-relaxed text-white/50">{description}</p>}
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item, i) => (
            <Reveal key={item.alt} delay={(i % 2) * 0.08} y={32} className="group">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-3xl"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </a>
              <p className="mt-4 text-sm text-white/60">{item.alt}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
