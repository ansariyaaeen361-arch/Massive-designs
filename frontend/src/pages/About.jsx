import Seo from '../components/layout/Seo';
import PageHeader from '../components/layout/PageHeader';
import { SITE_URL } from '../lib/schema';
import AboutIntro from './about/AboutIntro';
import WhyUs from './about/WhyUs';
import Promise from './about/Promise';

export default function About() {
  return (
    <>
      <Seo
        title="About Us - Massive Designs"
        description="Massive Designs delivers innovative web design and digital marketing in North Richland Hills, TX, where creativity meets strategy to drive real growth."
        path="/about"
        schemaGraph={[
          {
            '@type': 'AboutPage',
            '@id': `${SITE_URL}/about/#webpage`,
            url: `${SITE_URL}/about/`,
            name: 'About Massive Designs',
            description:
              'Learn about Massive Designs, a Texas creative marketing agency providing web design, development, SEO, branding, content marketing, social media marketing, and app development services.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            mainEntity: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'en-US',
          },
        ]}
      />
      <PageHeader title="About Us" crumb="About us" />
      <AboutIntro />
      <WhyUs />
      <Promise />
    </>
  );
}
