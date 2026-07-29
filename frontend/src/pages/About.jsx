import Seo from '../components/layout/Seo';
import PageHeader from '../components/layout/PageHeader';
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
      />
      <PageHeader title="About Us" crumb="About us" />
      <AboutIntro />
      <WhyUs />
      <Promise />
    </>
  );
}
