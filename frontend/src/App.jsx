import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/layout/Layout';

const IntroLoader = lazy(() => import('./components/loader/IntroLoader'));
const INTRO_LOADER_SESSION_KEY = 'md_intro_loader_shown';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const WebDesignDevelopment = lazy(() => import('./pages/services/WebDesignDevelopment'));
const BrandingLogoDesign = lazy(() => import('./pages/services/BrandingLogoDesign'));
const SocialMediaMarketing = lazy(() => import('./pages/services/SocialMediaMarketing'));
const ContentMarketing = lazy(() => import('./pages/services/ContentMarketing'));
const SeoServices = lazy(() => import('./pages/services/SeoServices'));
const MobileAppDevelopment = lazy(() => import('./pages/services/MobileAppDevelopment'));
const Projects = lazy(() => import('./pages/Projects'));
const Packages = lazy(() => import('./pages/Packages'));
const Contact = lazy(() => import('./pages/Contact'));
const AuditTool = lazy(() => import('./pages/AuditTool'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const AreasWeServe = lazy(() => import('./pages/AreasWeServe'));
const Houston = lazy(() => import('./pages/areas/Houston'));
const Dallas = lazy(() => import('./pages/areas/Dallas'));
const FortWorth = lazy(() => import('./pages/areas/FortWorth'));
const Austin = lazy(() => import('./pages/areas/Austin'));
const SanAntonio = lazy(() => import('./pages/areas/SanAntonio'));
const NorthRichlandHills = lazy(() => import('./pages/areas/NorthRichlandHills'));
const Placeholder = lazy(() => import('./pages/Placeholder'));

const page = (title) => (
  <Suspense fallback={null}>
    <Placeholder title={title} />
  </Suspense>
);

const route = (Component) => (
  <Suspense fallback={null}>
    <Component />
  </Suspense>
);

export default function App() {
  const [showIntroLoader] = useState(
    () => typeof window !== 'undefined' && !window.sessionStorage.getItem(INTRO_LOADER_SESSION_KEY)
  );

  return (
    <HelmetProvider>
      {showIntroLoader && (
        <Suspense fallback={<div className="fixed inset-0 z-[999] bg-black" />}>
          <IntroLoader />
        </Suspense>
      )}
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={route(Home)} />
            <Route path="/about" element={route(About)} />
            <Route path="/services" element={route(Services)} />
            <Route path="/branding-logo-design" element={route(BrandingLogoDesign)} />
            <Route path="/web-design-development" element={route(WebDesignDevelopment)} />
            <Route path="/social-media-marketing" element={route(SocialMediaMarketing)} />
            <Route path="/content-marketing" element={route(ContentMarketing)} />
            <Route path="/seo-services" element={route(SeoServices)} />
            <Route path="/mobile-app-development" element={route(MobileAppDevelopment)} />
            <Route path="/projects" element={route(Projects)} />
            <Route path="/packages" element={route(Packages)} />
            <Route path="/contact" element={route(Contact)} />
            <Route path="/website-audit" element={route(AuditTool)} />
            <Route path="/privacy-policy" element={route(PrivacyPolicy)} />
            <Route path="/terms-conditions" element={route(TermsConditions)} />
            <Route path="/areas-we-serve" element={route(AreasWeServe)} />
            <Route path="/areas-we-serve/houston" element={route(Houston)} />
            <Route path="/areas-we-serve/dallas" element={route(Dallas)} />
            <Route path="/areas-we-serve/fort-worth" element={route(FortWorth)} />
            <Route path="/areas-we-serve/austin" element={route(Austin)} />
            <Route path="/areas-we-serve/san-antonio" element={route(SanAntonio)} />
            <Route path="/areas-we-serve/north-richland-hills" element={route(NorthRichlandHills)} />
            <Route path="*" element={page('404 - Not Found')} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
