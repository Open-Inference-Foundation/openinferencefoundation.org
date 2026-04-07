import { SEO, FAQ, buildFAQPageJsonLd } from '@flowstack/sdk';
import type { FAQItem } from '@flowstack/sdk';
import { CONTRACTS, ARBISCAN_BASE } from '@/lib/contracts';
import { TokenFlowDiagram, InfrastructureDiagram } from '@/components/diagrams';

const CONTRACT_LIST = [
  { name: 'INFER Token', addr: CONTRACTS.INFER, desc: 'ERC-20, 1B fixed supply, membership token' },
  { name: 'AGENT Token (v2)', addr: CONTRACTS.AGENT, desc: 'ERC-20, mintable, operational payment token' },
  { name: 'InferStaking', addr: CONTRACTS.STAKING, desc: 'Stake INFER, manage tiers, lock periods' },
  { name: 'AgentPurchase (v2)', addr: CONTRACTS.AGENT_PURCHASE, desc: 'Buy AGENT with USDC/USDT at tier-discounted rate' },
  { name: 'AgentPayment (v3)', addr: CONTRACTS.AGENT_PAYMENT, desc: 'Deposit AGENT, settle queries, 60/30/10 split' },
  { name: 'SurplusDistribution', addr: CONTRACTS.SURPLUS, desc: 'Quarterly Merkle-based staker surplus claims' },
  { name: 'Gnosis Safe (2-of-3)', addr: CONTRACTS.SAFE, desc: 'Multisig owner of all contracts, treasury' },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is INFER?',
    answer: 'INFER is the membership token of the Open Inference Foundation. It has a fixed supply of 1 billion tokens and is used for staking, governance, and proof of co-op membership. It is never spent on queries — only staked.',
  },
  {
    question: 'What is AGENT?',
    answer: 'AGENT is the operational token used to pay for AI queries. It is mintable with a quarterly governance ceiling and soft-pegged to ~$0.01 per compute unit. Users buy AGENT with USDC or USDT at their tier-discounted rate.',
  },
  {
    question: 'How do I stake INFER?',
    answer: 'Connect your wallet on the Staking page, approve the InferStaking contract to spend your INFER, and choose a tier (Member: 1,000 INFER / 3 months, Pro: 10,000 / 6 months, Founder: 100,000 / 12 months). Your staked INFER unlocks AGENT discounts and governance weight.',
  },
  {
    question: 'Is my staked INFER principal safe?',
    answer: 'Yes. Your INFER principal is always withdrawable regardless of lock status. If you unstake early (before your lock period expires), you forfeit accumulated co-op surplus — but your original INFER is always returned in full.',
  },
  {
    question: 'What happens if I unstake early?',
    answer: 'Early unstaking forfeits 30% of your accumulated surplus share. Your INFER principal is always returned. If unstaking drops you below a tier threshold, your tier is automatically downgraded.',
  },
  {
    question: 'How does surplus distribution work?',
    answer: 'Each quarter, the foundation calculates the wholesale savings (the gap between retail and wholesale compute costs). These savings are distributed to stakers pro-rata by governance weight via a Merkle proof system. Stakers claim with a proof — no gas wasted on failed claims.',
  },
  {
    question: 'What chain is this on?',
    answer: 'All contracts are deployed on Arbitrum One (Chain ID 42161). Arbitrum is an Ethereum L2 with low gas fees and fast finality.',
  },
  {
    question: 'How do builders earn?',
    answer: 'Every site built on Casino comes with its own agent — a node in the network that the builder owns. When users interact with that node and run queries, the builder earns 60% of the AGENT spent. Users of your site can also build their own sites, creating new nodes that grow the network from the edges.',
  },
  {
    question: 'Is the foundation a company?',
    answer: 'No. The Open Inference Foundation is structured as a 501(c)(3) nonprofit. There are no venture investors and no exit pressure. Governance is on-chain through the staking membership.',
  },
];

const FAQ_JSON_LD = buildFAQPageJsonLd(
  FAQ_ITEMS.map((item) => ({ question: item.question, answer: item.answer }))
);

export default function Docs() {
  return (
    <>
      <SEO
        title="Documentation"
        description="Contract addresses, technical architecture, and FAQ for the Open Inference Foundation on Arbitrum One."
        siteName="Open Inference Foundation"
        baseUrl="https://openinference.org"
        canonicalUrl="/docs"
        jsonLd={FAQ_JSON_LD}
        keywords={['INFER contracts', 'Arbitrum contracts', 'inference foundation docs', 'staking FAQ']}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--color-text)' }}>
          Documentation
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--color-text-secondary)' }}>
          Technical reference for the Open Inference Foundation. All contracts are deployed on Arbitrum One
          and verified on Arbiscan.
        </p>

        {/* Contract Addresses */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Contract Addresses
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Contract</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Address</th>
                  <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell" style={{ color: 'var(--color-text-secondary)' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {CONTRACT_LIST.map(({ name, addr, desc }) => (
                  <tr key={addr} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-4 font-semibold whitespace-nowrap" style={{ color: 'var(--color-text)' }}>{name}</td>
                    <td className="py-3 px-4">
                      <a
                        href={`${ARBISCAN_BASE}/address/${addr}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs underline"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        {addr.slice(0, 6)}...{addr.slice(-4)}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-xs hidden sm:table-cell" style={{ color: 'var(--color-text-secondary)' }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Architecture Diagrams */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            Architecture
          </h2>
          <TokenFlowDiagram />
          <InfrastructureDiagram />
        </div>

        {/* End-to-End Flow */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            End-to-End Flow
          </h2>
          <div className="relative">
            {[
              {
                label: 'Join',
                title: 'Buy INFER',
                desc: 'Community sale or Uniswap DEX',
                color: 'var(--color-accent)',
                bg: 'var(--color-accent-light)',
              },
              {
                label: 'Lock',
                title: 'Stake INFER',
                desc: 'Choose tier: Member / Pro / Founder',
                color: 'var(--color-tier-pro)',
                bg: 'color-mix(in srgb, var(--color-tier-pro) 8%, transparent)',
              },
              {
                label: 'Fund',
                title: 'Buy AGENT with USDC/USDT',
                desc: 'Tier discount applied automatically',
                color: 'var(--color-accent-2)',
                bg: 'var(--color-accent-2-light)',
              },
              {
                label: 'Use',
                title: 'Query any node in the network',
                desc: 'Your site\'s agent, or someone else\'s',
                color: 'var(--color-warning)',
                bg: 'var(--color-warning-light)',
              },
              {
                label: 'Settle',
                title: 'On-chain settlement',
                desc: '60% node owner, 30% foundation, 10% infra',
                color: 'var(--color-accent)',
                bg: 'var(--color-accent-light)',
              },
              {
                label: 'Earn',
                title: 'Claim quarterly surplus',
                desc: 'Wholesale savings distributed via Merkle proofs',
                color: 'var(--color-accent-2)',
                bg: 'var(--color-accent-2-light)',
              },
            ].map((item, i, arr) => (
              <div key={item.label} className="flex items-stretch gap-4">
                {/* Timeline line + dot */}
                <div className="flex flex-col items-center w-8 shrink-0">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.label}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: 'var(--color-border)' }} />
                  )}
                </div>
                {/* Content card */}
                <div
                  className="flex-1 p-4 rounded-lg border mb-3"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: item.bg }}
                >
                  <p className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{item.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            FAQ
          </h2>
          <FAQ items={FAQ_ITEMS} />
        </div>
      </div>
    </>
  );
}
