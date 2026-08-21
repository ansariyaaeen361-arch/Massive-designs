import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight } from 'react-icons/hi2';
import Seo from '../components/layout/Seo';
import { SITE_URL } from '../lib/schema';
import PageHeader from '../components/layout/PageHeader';
import Reveal from '../components/motion/Reveal';
import AmbientGlow from '../components/motion/AmbientGlow';
import FeatureGrid from '../components/service-page/FeatureGrid';
import OrderModal from '../components/forms/OrderModal';
import { areas } from '../lib/areasData';

export default function AreasWeServe() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <>
      <Seo
        title="Areas We Serve - Massive Designs"
        description="Massive Designs provides web design, SEO, branding and digital marketing services for businesses across Dallas, Fort Worth, Houston, Austin and San Antonio, Texas."
        path="/areas-we-serve"
        schemaGraph={[
          {
            '@type': 'CollectionPage',
            '@id': `${SITE_URL}/areas-we-serve/#webpage`,
            url: `${SITE_URL}/areas-we-serve/`,
            name: 'Areas We Serve - Massive Designs',
            description:
              'Massive Designs provides web design, SEO, branding and digital marketing services for businesses across Dallas, Fort Worth, Houston, Austin and San Antonio, Texas.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            mainEntity: { '@id': `${SITE_URL}/areas-we-serve/#areas` },
            inLanguage: 'en-US',
          },
          {
            '@type': 'ItemList',
            '@id': `${SITE_URL}/areas-we-serve/#areas`,
            name: 'Massive Designs Service Areas',
            itemListElement: areas.map((area, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: area.name,
              url: `${SITE_URL}${area.href}/`,
            })),
          },
        ]}
      />
      <PageHeader
        title="Areas We Serve"
        crumb="Areas We Serve"
        action={
          <button
            type="button"
            onClick={() => setOrderOpen(true)}
            className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-wide text-black transition-transform duration-300 hover:-translate-y-1"
          >
            Order Now
          </button>
        }
      />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Where We Work</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">
              Built for Texas, <span className="text-primary">one city at a time</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/50">
              Texas is too big for a single playbook. A logistics company in Fort Worth isn&rsquo;t chasing the same
              customer as a boutique in Austin, and a restaurant in San Antonio has different competitors than a law
              firm in Houston. We&rsquo;re a web design and digital marketing agency serving Texas businesses in
              Dallas, Fort Worth, Houston, Austin and San Antonio, and the reason we can say that with a straight
              face is that we don&rsquo;t treat those five cities as interchangeable.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50">
              Every market on this page gets its own research before we touch a single page of code. What works for
              SEO in a market as large as Houston won&rsquo;t move the needle the same way in a smaller,
              tighter-knit market like Fort Worth, so our approach shifts with the city, even when the service stays
              the same.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative isolate py-16 lg:py-24">
        <AmbientGlow position="top-center" size="lg" intensity="low" />
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, i) => (
              <Reveal key={area.name} delay={i * 0.05} className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <h3 className="text-xl text-white">{area.name}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/50">{area.blurb}</p>
                <Link
                  to={area.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-primary transition-transform duration-300 hover:translate-x-1"
                >
                  View services in {area.shortName} <HiArrowRight className="inline text-base" aria-hidden="true" />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid
        heading="Why Massive Designs"
        columns={4}
        items={[
          {
            title: 'Local knowledge, not a template',
            description:
              'We research each market before we build in it. What ranks in Houston and what ranks in Fort Worth aren’t the same list of decisions.',
          },
          {
            title: 'One team, every city',
            description:
              'The people who design your site are the same people who handle your SEO and your brand, no matter which of these five markets you’re in.',
          },
          {
            title: 'Results in plain language',
            description:
              "Traffic, rankings and leads get reported the way you'd explain them to a colleague, not the way a slide deck explains them to a client.",
          },
          {
            title: 'Straight to the people doing the work',
            description:
              "You're talking to the designer and strategist on your project, not an account manager relaying messages on their behalf.",
          },
        ]}
      />

      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </>
  );
}
