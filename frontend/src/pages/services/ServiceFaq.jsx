import { useState } from 'react';
import { HiChevronDown } from 'react-icons/hi';
import Reveal from '../../components/motion/Reveal';
import faqImg from '../../assets/img/services/faq.webp';

const faqs = [
  {
    q: 'High Standards',
    a: 'We adhere to high standards making every pixel, code line, and interaction of high quality.',
  },
  {
    q: 'Focus on People',
    a: 'We are people centered, and we believe good design serves people first.',
  },
  {
    q: 'Different Thinking',
    a: 'We are different in thinking, we break rules, find new radical ideas, and develop digital solutions.',
  },
  {
    q: 'Business Innovation',
    a: 'We brand businesses using strategic creativity bringing quantifiable growth.',
  },
];

export default function ServiceFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-6 lg:grid-cols-12 lg:gap-10 lg:px-10">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">What We Offer</p>
            <h3 className="mt-4 text-3xl sm:text-4xl">Discover Our Capabilities</h3>
          </Reveal>

          <Reveal delay={0.1} as="div" className="mt-8 flex flex-col">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between py-5 text-left"
                  >
                    <span className={`text-lg ${isOpen ? 'text-primary' : 'text-white'}`}>{item.q}</span>
                    <HiChevronDown
                      className={`shrink-0 text-lg transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary' : 'text-white/40'
                      }`}
                    />
                  </button>
                  <div
                    className="grid overflow-hidden transition-all duration-300"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed text-white/50">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>

        <Reveal delay={0.15} y={36} className="lg:col-span-6">
          <img
            src={faqImg}
            alt="Massive Designs creative process"
            className="h-full max-h-[480px] w-full rounded-[2rem] object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
