import Reveal from '../motion/Reveal';

export default function Promise() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <Reveal className="lg:col-span-7">
          <h3 className="text-3xl sm:text-4xl">Our Promise <span className="text-primary">Design That Moves People</span></h3>
          <p className="mt-5 text-sm leading-relaxed text-white/50">
            We will deliver work that provokes action and emotion. We view every project as an opportunity to create
            meaningful connection and impact. Results and creativity bring us the benefit of recurring customers. We
            never stop learning. We continue to stay relevant and innovative. Any project we provide passes through
            thorough consideration, design and testing. We are successful because we make you successful. That
            belief drives every idea we create and every partnership we form. By selecting Massive Designs, you are
            not just buying an agency. You are entering a team that shares the idea of creative thinking to
            transform businesses positively.
          </p>

          <h3 className="mt-10 text-3xl sm:text-4xl">
            Let&apos;s Build Something <span className="text-primary">Massive Together</span>
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-white/50">
            Your brand deserves more than conventional marketing. It merits a story that resonates, a design that
            inspires, and a strategy that succeeds. This is what we do at Massive Designs. If you're ready to grow
            your business with a trusted creative marketing agency that Texas brands recommend, reach out to us
            today. Let us make your vision come true and make your next big idea happen.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={40} className="lg:col-span-5">
          <img
            src="/img/about/about-second-image.webp"
            alt="Massive Designs branding and stationery mockup"
            className="h-full max-h-[560px] w-full rounded-[2rem] object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
