import { useState } from 'react';
import Seo from '../components/layout/Seo';
import { getWebPageNode } from '../lib/schema';
import PageHeader from '../components/layout/PageHeader';
import Reveal from '../components/motion/Reveal';
import AmbientGlow from '../components/motion/AmbientGlow';
import AuditUrlForm from '../components/audit-tool/AuditUrlForm';
import AuditLoading from '../components/audit-tool/AuditLoading';
import AuditResults from '../components/audit-tool/AuditResults';

export default function AuditTool() {
  const [status, setStatus] = useState('idle');
  const [pendingUrl, setPendingUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const runAudit = async (url) => {
    setError('');
    setPendingUrl(url);
    setStatus('loading');

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'We could not audit that URL. Please check it and try again.');
      }

      setResult(data);
      setStatus('results');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <>
      <Seo
        title="Free Website Audit Tool - Massive Designs"
        description="Get an instant, free audit of your website's performance, SEO, mobile-friendliness, security and accessibility from Massive Designs."
        path="/website-audit"
        schemaGraph={[
          getWebPageNode({
            slug: 'website-audit',
            pageName: 'Free Website Audit Tool - Massive Designs',
            pageDescription:
              "Get an instant, free audit of your website's performance, SEO, mobile-friendliness, security and accessibility from Massive Designs.",
          }),
        ]}
      />
      <PageHeader title="Free Website Audit" crumb="Website Audit" />

      <section className="relative isolate py-16 lg:py-24">
        <AmbientGlow position="top-right" size="md" intensity="low" />
        <div className="mx-auto max-w-[1000px] px-6 lg:px-10">
          {status !== 'results' && (
            <Reveal className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Website Audit Tool</p>
              <h2 className="mt-4 text-4xl sm:text-5xl">
                See exactly what&rsquo;s <span className="text-primary">holding your site back</span>
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/50">
                Enter your website URL and get an instant score for performance, SEO, mobile-friendliness, security
                and accessibility, plus the top issues to fix, in plain language.
              </p>
            </Reveal>
          )}

          {status === 'idle' && (
            <>
              <AuditUrlForm onSubmit={runAudit} isLoading={false} />
              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            </>
          )}

          {status === 'loading' && <AuditLoading url={pendingUrl} />}

          {status === 'results' && result && <AuditResults result={result} />}
        </div>
      </section>
    </>
  );
}
