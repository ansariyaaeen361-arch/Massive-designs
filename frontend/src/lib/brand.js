export const brand = {
  name: 'Massive Designs',
  phone: '+17869364483',
  phoneDisplay: '+1 786 936 4483',
  phoneTel: 'tel:+17869364483',
  email: 'info@massive-designs.com',
  emailLink: 'mailto:info@massive-designs.com',
  location: '8350 Davis Boulevard North Richland Hills, TX 76182 United States',
  openDays: 'Monday to Friday',
};

export const socialLinks = [
  { name: 'Facebook', url: 'https://www.facebook.com/massivedesignn/' },
  { name: 'Instagram', url: 'https://www.instagram.com/massive._.designs/' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/massive-designs/' },
];

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  {
    label: 'Services',
    href: '/services/',
    children: [
      { label: 'Branding & Logo', href: '/branding-logo-design/' },
      { label: 'Web Design & Development', href: '/web-design-development/' },
      { label: 'Social Media Marketing', href: '/social-media-marketing/' },
      { label: 'Content Marketing', href: '/content-marketing/' },
      { label: 'SEO Services', href: '/seo-services/' },
      { label: 'Mobile App Development', href: '/mobile-app-development/' },
    ],
  },
  { label: 'Projects', href: '/projects/' },
  { label: 'Packages', href: '/packages/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Blogs', href: 'https://news.massive-designs.com/', external: true },
  {
    label: 'Areas We Serve',
    href: '/areas-we-serve/',
    mega: true,
    children: [
      { label: 'Dallas', href: '/areas-we-serve/dallas/' },
      { label: 'Fort Worth', href: '/areas-we-serve/fort-worth/' },
      { label: 'Houston', href: '/areas-we-serve/houston/' },
      { label: 'Austin', href: '/areas-we-serve/austin/' },
      { label: 'San Antonio', href: '/areas-we-serve/san-antonio/' },
      { label: 'North Richland Hills', href: '/areas-we-serve/north-richland-hills/' },
    ],
  },
  { label: 'Website Audit', href: '/website-audit/' },
];

export const footerQuickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Projects', href: '/projects/' },
  { label: 'Contact', href: '/contact/' },
  { label: 'Blogs', href: 'https://news.massive-designs.com/', external: true },
  { label: 'Areas We Serve', href: '/areas-we-serve/' },
];
