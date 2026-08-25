import { useEffect, useRef, useState } from 'react';
import Seo from '../components/layout/Seo';
import PageHeader from '../components/layout/PageHeader';
import Lightbox from '../components/motion/Lightbox';
import { gsap } from '../lib/gsap';
import { SITE_URL } from '../lib/schema';

const CATEGORY_ORDER = ['logo', 'business-card', 'flyer', 'merchandise', 'delivered-product', 'website', 'animation'];

const CATEGORY_LAYOUT = {
  logo: { span: 'col-span-1', aspect: 'aspect-square' },
  website: { span: 'col-span-2', website: true },
  'business-card': { span: 'col-span-1', aspect: 'aspect-[4/3]' },
  flyer: { span: 'col-span-1', aspect: 'aspect-[3/4]' },
  merchandise: { span: 'col-span-1', aspect: 'aspect-square' },
  animation: { span: 'col-span-2', aspect: 'aspect-video', video: true },
  'delivered-product': { span: 'col-span-1', aspect: 'aspect-square' },
};
const DEFAULT_LAYOUT = { span: 'col-span-1', aspect: 'aspect-square' };

// Replicates the original site's hover-scroll-box / hover-scroll-img effect:
// the tall screenshot pans upward on hover (8s linear) and eases back down on hover-out.
function WebsiteTile({ project, threeUp }) {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const title = project.title?.rendered || '';
  const href = project.acf?.project_link || '/contact/';
  const isExternal = href.startsWith('http');

  const handleEnter = () => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    if (!wrap || !img) return;
    const overflow = img.offsetHeight - wrap.offsetHeight;
    if (overflow > 0) {
      gsap.to(img, { y: -overflow, duration: 8, ease: 'none', overwrite: 'auto' });
    }
  };

  const handleLeave = () => {
    gsap.to(imgRef.current, { y: 0, duration: 8, ease: 'none', overwrite: 'auto' });
  };

  const box = (
    <div
      ref={wrapRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:h-[340px] lg:h-[400px]"
    >
      <img ref={imgRef} src={project.featured_image_url} alt={title} loading="lazy" className="absolute left-0 top-0 w-full" />
    </div>
  );

  const spanClass = threeUp ? '' : 'col-span-2';

  return isExternal ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`block ${spanClass}`}>
      {box}
    </a>
  ) : (
    <a href={href} className={`block ${spanClass}`}>
      {box}
    </a>
  );
}

function ProjectTile({ project, onOpen }) {
  const category = project.project_categories?.[0];
  const layout = CATEGORY_LAYOUT[category] ?? DEFAULT_LAYOUT;
  const title = project.title?.rendered || '';

  const media = layout.video ? (
    <video
      src={project.acf?.video_url}
      autoPlay
      muted
      loop
      playsInline
      className={`h-full w-full object-cover ${layout.aspect}`}
    />
  ) : (
    <img
      src={project.featured_image_url}
      alt={title}
      loading="lazy"
      className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${layout.aspect}`}
    />
  );

  return (
    <button
      type="button"
      aria-label={title || (layout.video ? 'View animation' : 'View project image')}
      onClick={() => onOpen(project)}
      className={`group block w-full appearance-none border-0 bg-transparent p-0 text-left ${layout.span}`}
    >
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">{media}</div>
    </button>
  );
}

function ProjectLightbox({ project, onClose }) {
  const isVideo = project.project_categories?.[0] === 'animation';
  const title = project.title?.rendered || '';

  return (
    <Lightbox onClose={onClose}>
      {isVideo ? (
        <video src={project.acf?.video_url} controls autoPlay loop className="max-h-[85vh] w-auto rounded-2xl" />
      ) : (
        <img
          src={project.featured_image_url}
          alt={title}
          className="max-h-[85vh] w-auto rounded-2xl object-contain"
        />
      )}
    </Lightbox>
  );
}

export default function Projects() {
  const [status, setStatus] = useState('loading');
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxProject, setLightboxProject] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [catsRes, projRes] = await Promise.all([
          fetch('/cms/wp-json/wp/v2/project_category?per_page=100&_fields=id,name,slug'),
          fetch(
            '/cms/wp-json/wp/v2/projects?per_page=500&orderby=menu_order&order=asc&_fields=id,title,featured_image_url,project_categories,acf',
          ),
        ]);
        if (!catsRes.ok || !projRes.ok) throw new Error('Request failed');
        const [cats, projs] = await Promise.all([catsRes.json(), projRes.json()]);
        if (cancelled) return;
        const sortedCats = Array.isArray(cats)
          ? [...cats].sort((a, b) => {
              const ia = CATEGORY_ORDER.indexOf(a.slug);
              const ib = CATEGORY_ORDER.indexOf(b.slug);
              return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
            })
          : [];
        setCategories(sortedCats);
        setProjects(Array.isArray(projs) ? projs : []);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (status !== 'ready' || !gridRef.current) return;
    gsap.fromTo(gridRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
  }, [activeFilter, status]);

  const visibleProjects = projects
    .filter((p) => {
      const category = p.project_categories?.[0];
      const layout = CATEGORY_LAYOUT[category] ?? DEFAULT_LAYOUT;
      const hasMedia = layout.video ? Boolean(p.acf?.video_url) : Boolean(p.featured_image_url);
      if (!hasMedia) return false;
      return activeFilter === 'all' || p.project_categories?.includes(activeFilter);
    })
    .sort((a, b) => {
      if (activeFilter !== 'all') return 0;
      const rankA = CATEGORY_ORDER.indexOf(a.project_categories?.[0]);
      const rankB = CATEGORY_ORDER.indexOf(b.project_categories?.[0]);
      return (rankA === -1 ? CATEGORY_ORDER.length : rankA) - (rankB === -1 ? CATEGORY_ORDER.length : rankB);
    });

  const isWebsiteFilter = activeFilter === 'website';
  const gridClass = isWebsiteFilter
    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
    : 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4';

  return (
    <>
      <Seo
        title="Projects - Massive Designs"
        description="Discover Massive Design's client work in Texas web, app, brand & marketing projects built to elevate businesses and drive results."
        path="/projects"
        schemaGraph={[
          {
            '@type': 'CollectionPage',
            '@id': `${SITE_URL}/projects/#webpage`,
            url: `${SITE_URL}/projects/`,
            name: 'Projects | Massive Designs',
            description:
              'Explore web design, branding, development, and digital marketing projects created by Massive Designs for businesses across Texas.',
            isPartOf: { '@id': `${SITE_URL}/#website` },
            about: { '@id': `${SITE_URL}/#organization` },
            inLanguage: 'en-US',
          },
        ]}
      />
      <PageHeader title="Projects" crumb="our projects" />

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h2 className="sr-only">Project Gallery</h2>

          {status === 'error' && (
            <p className="text-center text-sm text-white/50">
              We couldn't load our projects right now. Please try again shortly.
            </p>
          )}

          {status !== 'error' && (
            <>
              <div className="no-scrollbar flex flex-nowrap justify-start gap-3 overflow-x-auto px-1 pb-1 sm:justify-center">
                <button
                  type="button"
                  onClick={() => setActiveFilter('all')}
                  className={`shrink-0 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
                    activeFilter === 'all' ? 'bg-primary text-black' : 'border border-white/15 text-white/60 hover:text-white'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setActiveFilter(cat.slug)}
                    className={`shrink-0 rounded-full px-5 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
                      activeFilter === cat.slug
                        ? 'bg-primary text-black'
                        : 'border border-white/15 text-white/60 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {status === 'loading' && (
                <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-2xl bg-white/5" />
                  ))}
                </div>
              )}

              {status === 'ready' && (
                <div ref={gridRef} className={`mt-12 ${gridClass}`}>
                  {visibleProjects.map((project) =>
                    project.project_categories?.includes('website') ? (
                      <WebsiteTile key={project.id} project={project} threeUp={isWebsiteFilter} />
                    ) : (
                      <ProjectTile key={project.id} project={project} onOpen={setLightboxProject} />
                    ),
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {lightboxProject && <ProjectLightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />}
    </>
  );
}
