import { SEO } from '@flowstack/sdk';
import { CONTRACTS, ARBISCAN_BASE } from '@/lib/contracts';
import { StakingTiersDiagram, TokenFlowDiagram } from '@/components/diagrams';

const SUPPLY_BREAKDOWN = [
  { label: 'Community Sale', pct: 40, amount: '400M', color: 'var(--color-accent)' },
  { label: 'Foundation Treasury', pct: 30, amount: '300M', color: 'var(--color-accent-2)' },
  { label: 'DEX Liquidity', pct: 10, amount: '100M', color: 'var(--color-warning)' },
  { label: 'Founder (Vesting)', pct: 12, amount: '120M', color: 'var(--color-tier-pro)' },
  { label: 'Flowstack (Vesting)', pct: 4, amount: '40M', color: 'var(--color-text-tertiary)' },
  { label: 'Contributor Reserve', pct: 4, amount: '40M', color: 'var(--color-border-hover)' },
];

export default function TokenEconomics() {
  return (
    <>
      <SEO
        title="Tokenomics"
        description="Two-token model: INFER for staking and governance, AGENT for queries. Understand the economics of the Open Inference Foundation."
        siteName="Open Inference Foundation"
        baseUrl="https://openinference.org"
        canonicalUrl="/tokenomics"
        keywords={['INFER tokenomics', 'AGENT token', 'two-token model', 'staking economics', 'inference co-op']}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--color-text)' }}>
          Two-Token Economics
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--color-text-secondary)' }}>
          A single token creates a velocity problem: the more queries, the more sell pressure.
          Two tokens separate membership from operations, so success appreciates INFER instead of destroying it.
        </p>

        {/* Token Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* INFER */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-accent)', backgroundColor: 'var(--color-accent-light)' }}>
            <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>INFER</h2>
            <p className="text-sm font-medium mb-4" style={{ color: 'var(--color-text-secondary)' }}>The Membership Token</p>
            <dl className="space-y-3 text-sm">
              {[
                ['Supply', '1,000,000,000 (fixed forever)'],
                ['Utility', 'Staking, governance, proof of membership'],
                ['Velocity', 'Near zero (locked in staking)'],
                ['Price behavior', 'Appreciates as staking locks supply'],
                ['Spent on queries?', 'Never'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-semibold" style={{ color: 'var(--color-text)' }}>{label}</dt>
                  <dd style={{ color: 'var(--color-text-secondary)' }}>{value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={`${ARBISCAN_BASE}/token/${CONTRACTS.INFER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-xs font-mono underline"
              style={{ color: 'var(--color-accent)' }}
            >
              View on Arbiscan
            </a>
          </div>

          {/* AGENT */}
          <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-accent-2)', backgroundColor: 'var(--color-accent-2-light)' }}>
            <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--color-accent-2)' }}>AGENT</h2>
            <p className="text-sm font-medium mb-4" style={{ color: 'var(--color-text-secondary)' }}>The Operational Token</p>
            <dl className="space-y-3 text-sm">
              {[
                ['Supply', 'Governed mint (quarterly ceiling)'],
                ['Utility', 'Pay for queries, builder earnings'],
                ['Velocity', 'High (transactional by design)'],
                ['Price behavior', 'Soft-pegged to ~$0.01/compute unit'],
                ['Spent on queries?', 'Yes, this is the payment token'],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="font-semibold" style={{ color: 'var(--color-text)' }}>{label}</dt>
                  <dd style={{ color: 'var(--color-text-secondary)' }}>{value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={`${ARBISCAN_BASE}/token/${CONTRACTS.AGENT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-xs font-mono underline"
              style={{ color: 'var(--color-accent-2)' }}
            >
              View on Arbiscan
            </a>
          </div>
        </div>

        {/* Why Two Tokens */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Why Two Tokens?
          </h2>
          <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            <p>
              In a single-token model, every query is a sell event. At 1M queries/month at $0.50 each,
              the foundation dumps $500K of tokens onto the market monthly. Buy pressure only comes from
              new users. Once adoption plateaus, sell volume exceeds buy volume. Price collapses.
            </p>
            <p>
              The two-token model decouples membership from operations. INFER never hits the market
              because it's never spent — it sits in staking contracts, accumulating governance weight and
              tier benefits. AGENT handles velocity: users buy it with stablecoins, spend it on queries,
              builders earn it, the foundation converts it for compute bills.
            </p>
            <p>
              Result: <strong style={{ color: 'var(--color-text)' }}>the more successful the platform, the more INFER gets locked, the tighter supply gets,
              the more INFER appreciates</strong>. Success creates buy pressure, not sell pressure.
            </p>
          </div>
        </div>

        {/* Supply Distribution */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            INFER Supply Distribution
          </h2>
          <div className="space-y-3">
            {SUPPLY_BREAKDOWN.map(({ label, pct, amount, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--color-text)' }}>{label}</span>
                  <span className="font-mono" style={{ color: 'var(--color-text-secondary)' }}>{amount} ({pct}%)</span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: 'var(--color-surface-alt)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Money Flow */}
        <div>
          <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            How Money Flows
          </h2>
          <div className="space-y-3">
            {[
              { step: '1', text: 'User stakes INFER into InferStaking contract. Tier assigned based on amount.' },
              { step: '2', text: 'User buys AGENT with USDC/USDT via AgentPurchase. Tier discount applied automatically.' },
              { step: '3', text: 'User deposits AGENT into AgentPayment and queries the agent swarm.' },
              { step: '4', text: 'Settlement splits AGENT: 60% to node owner, 30% to foundation, 10% to infrastructure.' },
              { step: '5', text: 'Foundation converts AGENT to stablecoins and pays wholesale compute bills.' },
              { step: '6', text: 'Quarterly: wholesale savings (surplus) distributed to stakers via Merkle claims.' },
            ].map(({ step, text }) => (
              <div key={step} className="flex gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white" style={{ backgroundColor: 'var(--color-accent)' }}>
                  {step}
                </span>
                <p className="text-sm leading-relaxed pt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
