import { Link, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import WalletButton from './WalletButton';

interface DropdownItem {
  path: string;
  label: string;
}

interface NavGroup {
  label: string;
  items: DropdownItem[];
}

const NAV_ITEMS: (DropdownItem | NavGroup)[] = [
  { path: '/thesis', label: 'Thesis' },
  { path: '/buy', label: 'Buy' },
  {
    label: 'Learn',
    items: [
      { path: '/tokenomics', label: 'Tokenomics' },
      { path: '/staking', label: 'Staking' },
      { path: '/agents', label: 'Agent Network' },
      { path: '/governance', label: 'Governance' },
    ],
  },
  { path: '/privacy', label: 'Privacy' },
  { path: '/docs', label: 'Docs' },
];

// Flatten for mobile
const ALL_LINKS: DropdownItem[] = NAV_ITEMS.flatMap((item) =>
  'items' in item ? item.items : [item]
);

function isGroup(item: DropdownItem | NavGroup): item is NavGroup {
  return 'items' in item;
}

function Dropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = group.items.some((i) => i.path === pathname);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer"
        style={{
          color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          backgroundColor: isActive ? 'var(--color-accent-light)' : 'transparent',
        }}
      >
        {group.label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l3 3 3-3" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-1 py-1 rounded-lg border shadow-lg min-w-[160px] z-50"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {group.items.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm transition-colors"
              style={{
                color: pathname === path ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: pathname === path ? 'var(--color-accent-light)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-md border-b"
      style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg) 85%, transparent)', borderColor: 'var(--color-border)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg" style={{ color: 'var(--color-text)' }}>
          <span style={{ color: 'var(--color-accent)' }}>OIF</span>
          <span className="hidden sm:inline">Open Inference</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          <a
            href="https://casino.flowstack.fun"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-md text-sm font-semibold transition-colors"
            style={{ color: 'var(--color-accent-2)', backgroundColor: 'var(--color-accent-2-light)' }}
          >
            Try Casino
          </a>
          {NAV_ITEMS.map((item, i) =>
            isGroup(item) ? (
              <Dropdown key={i} group={item} pathname={pathname} />
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                style={{
                  color: pathname === item.path ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  backgroundColor: pathname === item.path ? 'var(--color-accent-light)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Wallet + mobile toggle */}
        <div className="flex items-center gap-3">
          <WalletButton />
          <button
            className="lg:hidden p-2 rounded-md"
            style={{ color: 'var(--color-text-secondary)' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: 'var(--color-border)' }}>
          <a
            href="https://casino.flowstack.fun"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-semibold"
            style={{ color: 'var(--color-accent-2)', backgroundColor: 'var(--color-accent-2-light)' }}
          >
            Try Casino
          </a>
          {ALL_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium"
              style={{
                color: pathname === path ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                backgroundColor: pathname === path ? 'var(--color-accent-light)' : 'transparent',
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
