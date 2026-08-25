import {
  HiOutlineLightningBolt,
  HiOutlineSearch,
  HiOutlineDeviceMobile,
  HiOutlineShieldCheck,
  HiOutlineEye,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';
import Reveal from '../motion/Reveal';
import Counter from '../motion/Counter';
import ScoreCard from './ScoreCard';
import EmailCaptureForm from './EmailCaptureForm';

const SCORE_CARDS = [
  { key: 'performance', label: 'Performance', icon: HiOutlineLightningBolt },
  { key: 'seo', label: 'SEO', icon: HiOutlineSearch },
  { key: 'mobile', label: 'Mobile-Friendliness', icon: HiOutlineDeviceMobile },
  { key: 'security', label: 'Security', icon: HiOutlineShieldCheck },
  { key: 'accessibility', label: 'Accessibility', icon: HiOutlineEye },
];

function scoreRingColor(score) {
  if (score >= 80) return '#B5F652';
  if (score >= 50) return '#fbbf24';
  return '#f87171';
}

export default function AuditResults({ result }) {
  const { url, overallScore, scores, issues, auditId } = result;
  const topIssues = issues.slice(0, 5);
  const ringColor = scoreRingColor(overallScore);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <div>
      <Reveal className="flex flex-col items-center text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary">Audit Results for {url}</p>

        <div className="relative mt-8 flex h-40 w-40 items-center justify-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <p className="font-heading text-5xl text-white">
            <Counter to={overallScore} />
          </p>
        </div>
        <p className="mt-4 text-sm text-white/50">Overall Score out of 100</p>
      </Reveal>

      <Reveal delay={0.1} as="div" className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {SCORE_CARDS.map((card) => (
          <ScoreCard key={card.key} icon={card.icon} label={card.label} score={scores[card.key]} />
        ))}
      </Reveal>

      <Reveal delay={0.15} as="div" className="mt-14">
        <h3 className="text-2xl text-white">Top issues we found</h3>
        <p className="mt-2 text-sm text-white/50">In plain language, here&rsquo;s what&rsquo;s holding your site back.</p>

        <ul className="mt-6 space-y-4">
          {topIssues.length === 0 && (
            <li className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/60">
              No major issues found, your site is in great shape.
            </li>
          )}
          {topIssues.map((issue) => (
            <li key={issue.title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HiOutlineExclamationCircle className="text-lg" />
              </span>
              <div>
                <h4 className="text-sm text-white">{issue.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-white/50">{issue.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.2} as="div" className="mt-14">
        <EmailCaptureForm auditId={auditId} />
      </Reveal>
    </div>
  );
}
