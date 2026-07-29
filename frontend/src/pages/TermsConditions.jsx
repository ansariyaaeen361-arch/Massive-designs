import Seo from '../components/layout/Seo';
import PageHeader from '../components/layout/PageHeader';
import Reveal from '../components/motion/Reveal';
import { brand } from '../lib/brand';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing our website, you agree to be bound by these Terms & Conditions.',
  },
  {
    title: '2. Services',
    body: 'We provide creative services including branding, web design, development, and marketing. Availability may vary.',
  },
  {
    title: '3. Intellectual Property',
    body: `All content, graphics, code, and design are the property of ${brand.name} and cannot be copied without permission.`,
  },
  {
    title: '4. User Obligations',
    list: [
      'Use our services lawfully.',
      'No hacking or disrupting our systems.',
      'No uploading harmful or malicious content.',
    ],
  },
  {
    title: '5. Payments & Refunds',
    body: 'All payments are due as per project agreement. Refunds are subject to contract terms.',
  },
  {
    title: '6. Limitation of Liability',
    body: 'We are not liable for damages arising from the use of our site or services.',
  },
  {
    title: '7. Governing Law',
    body: 'These Terms are governed by the laws of the United States.',
  },
];

export default function TermsConditions() {
  return (
    <>
      <Seo
        title="Terms & Conditions - Massive Designs"
        description="Review the Terms & Conditions of Massive Designs. Learn how our creative services—branding, web design, SEO and marketing—are governed, your obligations as a client, and the legal framework that applies."
        path="/terms-conditions"
      />
      <PageHeader title="Terms & Conditions" crumb="Terms & Conditions" />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Legal Information</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">
              Our <span className="text-primary">Terms & Conditions</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/50">
              Please read these Terms carefully before using {brand.name}&rsquo;s website and services.
            </p>
          </Reveal>

          <Reveal
            delay={0.1}
            className="mt-12 divide-y divide-white/10 rounded-3xl border border-white/10 bg-white/5"
          >
            {sections.map((section) => (
              <div key={section.title} className="p-8 sm:p-10">
                <h3 className="text-lg text-white sm:text-xl">{section.title}</h3>
                {section.body && (
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/50">{section.body}</p>
                )}
                {section.list && (
                  <ul className="mt-3 max-w-3xl list-disc space-y-2 pl-5 text-sm leading-relaxed text-white/50">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
