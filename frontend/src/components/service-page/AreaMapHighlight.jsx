import Reveal from '../motion/Reveal';

export default function AreaMapHighlight({
  heading,
  description,
  mapQuery,
  highlightsTitle,
  highlightsDescription,
  highlights,
}) {
  return (
    <section className="py-14 lg:py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <Reveal className="lg:col-span-6">
          <div className="overflow-hidden rounded-[2rem] border border-white/10">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              title={`Map of ${mapQuery}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full grayscale invert-[94%] contrast-[90%]"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-6">
          <h2 className="text-3xl sm:text-4xl">{heading}</h2>
          {description && <p className="mt-5 text-sm leading-relaxed text-white/50">{description}</p>}

          {highlightsTitle && <h3 className="mt-8 text-lg text-white">{highlightsTitle}</h3>}
          {highlightsDescription && (
            <p className="mt-2 text-sm leading-relaxed text-white/50">{highlightsDescription}</p>
          )}
          {highlights && (
            <ul className="mt-4 flex flex-col gap-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
