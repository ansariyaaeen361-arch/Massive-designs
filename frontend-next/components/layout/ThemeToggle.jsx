import { HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isLight}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      onClick={toggleTheme}
      className={`theme-toggle ${className}`}
    >
      <span className="theme-toggle-stars" aria-hidden="true" />
      <span className="theme-toggle-clouds" aria-hidden="true" />
      <span className="theme-toggle-knob" aria-hidden="true">
        <HiMoon className="tt-icon tt-moon" />
        <HiSun className="tt-icon tt-sun" />
      </span>
    </button>
  );
}
