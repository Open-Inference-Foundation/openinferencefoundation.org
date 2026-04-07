import { Link } from 'react-router-dom';
import { CONTRACTS } from '@/lib/contracts';

const ARBISCAN = 'https://arbiscan.io/address/';

export default function Footer() {
  return (
    <footer className="border-t mt-auto" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <p className="font-display font-bold text-lg mb-2" style={{ color: 'var(--color-text)' }}>
              Open Inference Foundation
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              A nonprofit inference co-op. Collective AI compute at wholesale prices.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text)' }}>Navigate</p>
            <div className="space-y-2">
              {[
                { to: '/tokenomics', label: 'Tokenomics' },
                { to: '/staking', label: 'Staking' },
                { to: '/agents', label: 'Agents' },
                { to: '/governance', label: 'Governance' },
                { to: '/docs', label: 'Docs' },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="block text-sm transition-colors hover:underline" style={{ color: 'var(--color-text-secondary)' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contracts */}
          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text)' }}>Contracts</p>
            <div className="space-y-2">
              {[
                { label: 'INFER Token', addr: CONTRACTS.INFER },
                { label: 'AGENT Token', addr: CONTRACTS.AGENT },
                { label: 'Staking', addr: CONTRACTS.STAKING },
              ].map(({ label, addr }) => (
                <a
                  key={addr}
                  href={`${ARBISCAN}${addr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-mono transition-colors hover:underline"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {label}: {addr.slice(0, 6)}...{addr.slice(-4)}
                </a>
              ))}
            </div>
          </div>

          {/* Network */}
          <div>
            <p className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text)' }}>Network</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Arbitrum One (Chain ID 42161)</p>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              501(c)(3) nonprofit
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            &copy; {new Date().getFullYear()} Open Inference Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
