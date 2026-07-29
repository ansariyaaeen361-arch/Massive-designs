import Reveal from '../motion/Reveal';

export default function ProcessSteps({ heading, description, steps }) {
  const cols =
    steps.length === 3 ? 'sm:grid-cols-3' : steps.length >= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2';

  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl">{heading}</h2>
          {description && <p className="mt-5 text-sm leading-relaxed text-white/50">{description}</p>}
        </Reveal>

        <div className={`mt-12 grid grid-cols-1 gap-6 ${cols}`}>
          {steps.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 0.08}
              className="rounded-3xl border border-white/10 bg-white/5 p-7"
            >
              <p className="font-heading text-2xl text-primary">{step.number}</p>
              <h3 className="mt-4 text-lg text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/50">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
