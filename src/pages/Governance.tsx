import { SEO } from '@flowstack/sdk';
import { Link } from 'react-router-dom';
import { TIER_INFO, CONTRACTS, ARBISCAN_BASE } from '@/lib/contracts';

export default function Governance() {
  return (
    <>
      <SEO
        title="Governance"
        description="On-chain governance for the Open Inference Foundation. Voting weight by staking tier, quarterly surplus distribution, and transparent treasury management."
        siteName="Open Inference Foundation"
        baseUrl="https://openinference.org"
        canonicalUrl="/governance"
        keywords={['DAO governance', 'INFER voting', 'surplus distribution', 'co-op governance', 'Merkle claims']}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--color-text)' }}>
          Governance
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--color-text-secondary)' }}>
          The foundation is governed by its members. Voting weight scales with staking commitment.
          Every major decision — surplus allocation, pricing adjustments, grants — goes to the membership.
        </p>

        {/* Governance Weight */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Voting Weight by Tier
          </h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {TIER_INFO.map((t) => (
              <div
                key={t.tier}
                className="p-5 rounded-xl border text-center"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
              >
                <p className="font-display text-lg font-bold mb-1" style={{ color: 'var(--color-text)' }}>{t.name}</p>
                <p className="text-2xl font-bold font-mono mb-2" style={{ color: 'var(--color-accent)' }}>{t.weight}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  {t.infer === 0 ? 'No voting power' : `${t.infer.toLocaleString()} INFER`}
                </p>
              </div>
            ))}
          </div>
          <p className="text-sm mt-4" style={{ color: 'var(--color-text-secondary)' }}>
            A Founder with 100,000 INFER has 5x the voting weight of a Member with 1,000 INFER.
            This reflects commitment level, not wealth — the tiers reward longer lock periods and deeper engagement.
          </p>
        </div>

        {/* What Members Vote On */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            What Members Vote On
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Surplus Allocation',
                desc: 'Each quarter, the wholesale savings (the difference between retail compute cost and what the co-op actually pays) accumulates as surplus. Members vote on how to split it: pass through to stakers, retain in treasury, or allocate to builder bonuses.',
              },
              {
                title: 'AGENT Pricing Adjustments',
                desc: 'The base price of AGENT is soft-pegged to ~$0.01/compute unit. As wholesale costs change, the foundation proposes quarterly price adjustments. Members ratify or modify.',
              },
              {
                title: 'Grants and Mission-Aligned Projects',
                desc: 'Foundation treasury funds can be allocated to open-source tooling, agent development bounties, or community infrastructure. All expenditures above a threshold require a governance vote.',
              },
              {
                title: 'Network Capabilities (High Risk)',
                desc: 'New capabilities added to the agent network — especially high-risk ones like browser access, shell execution, or filesystem tools — require community review and governance approval before nodes can use them.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="p-5 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-text)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Surplus Distribution */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Quarterly Surplus Distribution
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            The co-op's wholesale savings are distributed quarterly to stakers using a Merkle proof system.
            This is a pull model — the foundation publishes the Merkle root, and stakers claim their share.
          </p>
          <div className="space-y-3">
            {[
              'Foundation calculates each staker\'s share, weighted by governance weight (1x/2x/5x), not raw stake amount.',
              'A Merkle root of (staker, amount) pairs is published on-chain via SurplusDistribution contract.',
              'Stakers claim with a Merkle proof — gas-efficient, scales to any number of stakers.',
              'Double-claim prevention is on-chain. Once claimed for a quarter, the claim is locked.',
              'Unclaimed surplus remains in the contract indefinitely.',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <span className="font-mono font-bold shrink-0" style={{ color: 'var(--color-accent)' }}>{i + 1}.</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
          <a
            href={`${ARBISCAN_BASE}/address/${CONTRACTS.SURPLUS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-xs font-mono underline"
            style={{ color: 'var(--color-accent)' }}
          >
            SurplusDistribution contract on Arbiscan
          </a>
        </div>

        {/* Treasury Transparency */}
        <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <h2 className="font-display text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            Treasury Transparency
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            All foundation contracts are owned by a 2-of-3 Gnosis Safe multisig. Every transaction is
            visible on-chain. No single person can move funds unilaterally.
          </p>
          <a
            href={`${ARBISCAN_BASE}/address/${CONTRACTS.SAFE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-mono underline"
            style={{ color: 'var(--color-accent)' }}
          >
            View Safe on Arbiscan
          </a>
          <div className="mt-4">
            <Link
              to="/staking"
              className="inline-block px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-colors"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Stake and Participate
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
