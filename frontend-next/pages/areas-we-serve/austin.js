import { useState } from 'react';
import Link from 'next/link';
import Seo from '../../components/layout/Seo';
import { getAreaPageNodes } from '../../lib/schema';
import ServiceHero from '../../components/service-page/ServiceHero';
import FeatureGrid from '../../components/service-page/FeatureGrid';
import ProcessSteps from '../../components/service-page/ProcessSteps';
import AreaMapHighlight from '../../components/service-page/AreaMapHighlight';
import PortfolioHoverGrid from '../../components/service-page/PortfolioHoverGrid';
import ServiceCta from '../../components/service-page/ServiceCta';
import OrderModal from '../../components/forms/OrderModal';
import { brand } from '../../lib/brand';

const portfolioItems = [
  { src: '/img/web-projects/optimized/web-project-1.webp', alt: "Aguilera's Home Repair" },
  { src: '/img/web-projects/optimized/web-project-2.webp', alt: 'Yates Services of Memphis' },
  { src: '/img/web-projects/optimized/web-project-3.webp', alt: 'Santos Landscape' },
  { src: '/img/web-projects/optimized/web-project-4.webp', alt: 'Top Notch Drywall and Painting' },
  { src: '/img/web-projects/optimized/web-project-5.webp', alt: 'VIP Renovation' },
  { src: '/img/web-projects/optimized/web-project-6.webp', alt: 'Rima Beauty Spa' },
];

export default function Austin() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Seo
        title="Web Design & Digital Marketing Agency in Austin, TX | Massive Designs"
        description="Massive Designs partners with Austin businesses that need marketing built to a higher bar, in a market where most buyers already know what good looks like."
        path="/areas-we-serve/austin"
        schemaGraph={getAreaPageNodes({
          slug: 'areas-we-serve/austin',
          city: 'Austin',
          pageName: 'Web Design & Digital Marketing Agency in Austin, TX | Massive Designs',
          pageDescription: 'Massive Designs partners with Austin businesses that need marketing built to a higher bar, in a market where most buyers already know what good looks like.',
        })}
      />
      <ServiceHero
        title="Web Design & Digital Marketing Services Austin, TX"
        lead="Austin's business community already knows what strong marketing looks like, so a polished website alone convinces no one here. What we bring instead is proof, real performance and results behind every claim we make."
        crumb="Austin"
        parent="Areas We Serve"
        parentHref="/areas-we-serve"
        ctaLabel="Schedule a Discovery Call"
        onCtaClick={() => setContactOpen(true)}
      />

      <FeatureGrid
        heading="A Market That Already Knows the Difference"
        description={
          <>
            Most of the people making marketing decisions in Austin have already worked inside a marketing team
            somewhere, whether at a SaaS company off MoPac or a startup that came up through the SXSW circuit. That
            changes the pitch entirely. A polished homepage doesn&rsquo;t impress the way it might in a market still
            catching up on the basics. What earns attention here is evidence, real search performance, real
            conversion numbers, a strategy that holds together when someone with a marketing background starts
            asking pointed questions. Our{' '}
            <Link href="/seo-services" className="text-primary hover:underline">
              SEO methodology
            </Link>{' '}
            was built with exactly that kind of scrutiny in mind, because in this market, vague promises get noticed
            fast, and not in a good way.
          </>
        }
        items={[
          {
            title: 'Design That Earns a Second Look',
            description:
              "Austin's talent pool includes people who've built products at companies like Dell, Indeed, and Oracle, so a template site gets spotted immediately. We design with that audience in mind.",
          },
          {
            title: 'SEO Built for a Crowded Field',
            description:
              'Hundreds of agencies and in-house teams compete for the same Austin search terms, so ranking here takes more than the fundamentals most competitors stop at.',
          },
          {
            title: 'Positioning That Cuts Through the Noise',
            description:
              'Between SXSW hype cycles and a steady stream of companies relocating here, Austin brands need messaging that gets remembered for the right reasons.',
          },
        ]}
      />

      <ProcessSteps
        heading="How We Approach an Austin Project"
        description="Austin clients tend to ask harder questions earlier in the process, so our approach front-loads the parts that usually come later elsewhere."
        steps={[
          {
            number: '01',
            title: 'Competitive Benchmarking',
            description: "We start by pulling actual data on who's already ranking and running ads in your category, not assumptions about what should work.",
          },
          {
            number: '02',
            title: 'Technical SEO Foundation',
            description: "Austin's search competition is sophisticated enough that skipping technical fundamentals shows up in rankings within weeks, not months.",
          },
          {
            number: '03',
            title: 'Brand Positioning',
            description: 'We find the angle that separates you from the next well-designed Austin startup site, not just a fresh coat of paint on the same message.',
          },
          {
            number: '04',
            title: 'Performance Reporting',
            description: 'Numbers get reported the way an in-house Austin marketing hire would expect to see them, not dressed up to look better than they are.',
          },
        ]}
      />

      <AreaMapHighlight
        heading="Built to Withstand Scrutiny"
        description="An Austin audience will test your site and your claims faster than most markets, so we build with that in mind from the first draft."
        mapQuery="Austin, TX"
        highlightsTitle="What You'll Notice First"
        highlightsDescription="A few things tend to show up early once a project gets underway."
        highlights={[
          'A site that reads as credible next to well-funded competitors',
          "SEO that accounts for how contested Austin's results already are",
          'Reporting detailed enough to satisfy a data-literate team',
        ]}
      />

      <PortfolioHoverGrid
        heading="A Sample of Our Austin-Area Work"
        description="A look at recent design and marketing projects for businesses competing in and around the Austin market."
        items={portfolioItems}
      />

      <ProcessSteps
        heading="What It's Like to Work With Us in Austin"
        steps={[
          {
            number: '01',
            title: 'Diagnose Before Prescribing',
            description: "We audit what's already live and already ranking before recommending a single change.",
          },
          {
            number: '02',
            title: 'Align on What Actually Matters',
            description: 'You tell us whether the priority is leads, investor-ready polish, or long-term organic growth, and the plan gets built around that answer.',
          },
          {
            number: '03',
            title: 'Build With Visibility',
            description: "You're in the loop on structure and drafts throughout the project, not waiting on a single unveiling at the end.",
          },
          {
            number: '04',
            title: 'Measure Against Reality',
            description: 'We compare results against what actually happened in the market, not against a forecast picked to look good on a slide.',
          },
        ]}
      />

      <FeatureGrid
        heading="Why Austin Businesses Work With Us"
        items={[
          {
            title: "We Don't Assume You're New to This",
            description: 'Plenty of our Austin clients have run marketing themselves before hiring us, so we skip the basics and get straight to strategy.',
          },
          {
            title: 'Direct Access to the People Doing the Work',
            description: "No layer of account management sits between you and whoever's actually writing your code or your copy.",
          },
          {
            title: 'Where Every Claim Gets Checked',
            description: 'Every claim we make about your results is something you could verify yourself, because in Austin, someone usually will.',
          },
        ]}
      />

      <ServiceCta
        heading="Ready to Compete in Austin?"
        paragraphs={[
          <>
            If you&rsquo;re tired of marketing that sounds good on a call but falls apart under real questions,
            let&rsquo;s talk about what a straightforward, evidence-backed approach could look like for your
            business. Take a look at{' '}
            <Link href="/services" className="text-primary hover:underline">
              what we offer
            </Link>{' '}
            and we&rsquo;ll go from there.
          </>,
        ]}
        buttonLabel="Schedule a Discovery Call"
        buttonHref={brand.emailLink}
      />

      <OrderModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
