import Seo from '../components/layout/Seo';
import { getWebPageNode } from '../lib/schema';
import PageHeader from '../components/layout/PageHeader';
import Reveal from '../components/motion/Reveal';

const sections = [
  {
    title: '1. Information We Collect',
    body: 'We may collect personal information such as your name, email, phone, and company details when you contact us.',
  },
  {
    title: '2. How We Use Information',
    list: [
      'To deliver our services and projects.',
      'To communicate with you regarding inquiries.',
      'To improve website performance and customer experience.',
    ],
  },
  {
    title: '3. Cookies',
    body: 'Our website uses cookies for analytics and improved performance. You can disable them in your browser.',
  },
  {
    title: '4. Data Protection',
    body: 'We implement strict measures to protect your data from unauthorized access or disclosure.',
  },
  {
    title: '5. Sharing of Data',
    body: 'We do not sell or trade personal data. Information may be shared only if required by law.',
  },
  {
    title: '6. Third-Party Services',
    body: 'Our site may link to third-party services. We are not responsible for their policies.',
  },
  {
    title: '7. Changes to Policy',
    body: 'We may update this Privacy Policy at any time. Continued use of our site means you accept these changes.',
  },
  {
    title: '8. Contact Us',
    body: (
      <>
        If you have any questions, reach us at: <strong className="text-white">support@massive-designs.com</strong>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy - Massive Designs"
        description="At Massive Designs, your privacy is our priority. Learn how we collect, use, and protect your personal information, no data selling, only secure service."
        path="/privacy-policy"
        schemaGraph={[
          getWebPageNode({
            slug: 'privacy-policy',
            pageName: 'Privacy Policy - Massive Designs',
            pageDescription:
              'At Massive Designs, your privacy is our priority. Learn how we collect, use, and protect your personal information, no data selling, only secure service.',
          }),
        ]}
      />
      <PageHeader title="Privacy Policy" crumb="Privacy Policy" />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Your Data Matters</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">
              Our <span className="text-primary">Privacy Policy</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/50">
              We respect your privacy and are committed to protecting the personal information you share with us.
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
