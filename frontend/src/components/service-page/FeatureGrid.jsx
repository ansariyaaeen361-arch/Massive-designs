import Reveal from '../motion/Reveal';

export default function FeatureGrid({ heading, description, items, columns = 3 }) {
  const cols = columns === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          {heading && <h2 className="text-3xl sm:text-4xl">{heading}</h2>}
          {description && <p className="mt-5 text-sm leading-relaxed text-white/50">{description}</p>}
        </Reveal>

        {items && (
          <Reveal delay={0.1} as="div" className={`mt-12 grid grid-cols-1 gap-8 ${cols}`}>
            {items.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg text-primary">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{item.description}</p>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
