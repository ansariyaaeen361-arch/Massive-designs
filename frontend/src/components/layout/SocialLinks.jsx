import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { socialLinks } from '../../lib/brand';

const icons = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
};

export default function SocialLinks({ className = '' }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map(({ name, url }) => {
        const Icon = icons[name];
        return (
          <li key={name}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={name}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-black"
            >
              <Icon className="text-sm" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
