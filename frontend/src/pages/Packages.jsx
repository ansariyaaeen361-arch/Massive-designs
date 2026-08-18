import { useEffect, useRef, useState } from 'react';
import Seo from '../components/layout/Seo';
import PageHeader from '../components/layout/PageHeader';
import Reveal from '../components/motion/Reveal';
import StatBadge from '../components/motion/StatBadge';
import AmbientGlow from '../components/motion/AmbientGlow';
import ContactForm from '../components/forms/ContactForm';
import PricingCard from '../pages/packages/PricingCard';
import { pricingTabs } from '../pages/packages/packagesData';
import { brand } from '../lib/brand';
import { gsap } from '../lib/gsap';
import { SITE_URL } from '../lib/schema';

import packagesMain from '../assets/img/packages/packages-main.webp';

const PACKAGE_LIST = [
  'Web Design & Development',
  'Branding & Logo Design',
  'SEO Services',
  'Mobile App Development',
  'Content Marketing',
  'Social Media Marketing',
];

export default function Packages() {
  const [activeTab, setActiveTab] = useState(pricingTabs[0].id);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
  }, [activeTab]);

  const activeCards = pricingTabs.find((tab) => tab.id === activeTab)?.cards ?? [];

  return (
    <>
      <Seo
        title="Packages - Massive Designs"
        description="Massive Designs offers scalable packages in North Richland Hills, TX for web, e-commerce, branding and logo services designed for growth and impact."
        path="/packages"
        schemaGraph={[
          {
            '@type': 'CollectionPage',
            '@id': `${SITE_URL}/packages/#webpage`,
            url: `${SITE_URL}/packages/`,
            name: 'Packages | Massive Designs',
            description:
              'Explore web design, SEO, branding, digital marketing, and other service packages from Massive Designs for businesses across Texas.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            mainEntity: { '@id': `${SITE_URL}/packages/#packages` },
            inLanguage: 'en-US',
          },
          {
            '@type': 'ItemList',
            '@id': `${SITE_URL}/packages/#packages`,
            name: 'Massive Designs Service Packages',
            itemListOrder: 'https://schema.org/ItemListOrderAscending',
            numberOfItems: PACKAGE_LIST.length,
            itemListElement: PACKAGE_LIST.map((name, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name,
            })),
          },
        ]}
      />
      <PageHeader title="Packages" crumb="Packages" />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Packages {brand.name}</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">
              Crafting Digital <span className="text-primary">Excellence</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/50">
              Our vision is to be a trailblazing force in the world of web design and development, recognized for our
              unwavering commitment to excellence, integrity, and customer satisfaction.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="relative mt-12">
            <div className="overflow-hidden rounded-[2rem]">
              <img
                src={packagesMain}
                alt="Massive Designs crafting digital excellence"
                loading="lazy"
                className="aspect-[16/8] w-full object-cover"
              />
            </div>
            <StatBadge value={5} suffix="+" label="Year of Experience" className="-bottom-8 left-6 sm:left-10" />
          </Reveal>
        </div>
      </section>

      <section className="relative isolate py-16 lg:py-24">
        <AmbientGlow position="top-center" size="lg" intensity="low" />
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="flex flex-wrap justify-center gap-3">
            {pricingTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-wide transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-black'
                    : 'border border-white/15 text-white/60 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div ref={gridRef} className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {activeCards.map((card) => (
              <PricingCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Reveal className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 sm:p-12">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
