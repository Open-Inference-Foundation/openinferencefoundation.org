import { Link } from 'react-router-dom';
import { SEO, buildOrganizationJsonLd, buildWebSiteJsonLd } from '@flowstack/sdk';
import { TIER_INFO } from '@/lib/contracts';
import Countdown from '@/components/Countdown';

const ORG_JSON_LD = buildOrganizationJsonLd({
  name: 'Open Inference Foundation',
  url: 'https://openinference.org',
  description: 'A nonprofit inference co-op providing wholesale AI compute through collective membership.',
  logo: 'https://openinference.org/og-image.png',
});

const SITE_JSON_LD = buildWebSiteJsonLd({
  name: 'Open Inference Foundation',
  url: 'https://openinference.org',
});

export default function Home() {
  return (
    <>
      <SEO
        title="The Inference Co-op"
        description="Join the Open Inference Foundation. Stake INFER, unlock wholesale AI compute prices, and earn as a builder. A nonprofit co-op on Arbitrum."
        siteName="Open Inference Foundation"
        baseUrl="https://openinference.org"
        canonicalUrl="/"
        jsonLd={[ORG_JSON_LD, SITE_JSON_LD]}
        keywords={['INFER token', 'AI inference', 'co-op', 'Arbitrum', 'agent swarm', 'wholesale compute']}
      />

      {/* Community Sale Countdown */}
      <Countdown />

      {/* Hero */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-accent)' }}>
            Nonprofit Inference Co-op
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ color: 'var(--color-text)' }}>
            AI compute at
            <span style={{ color: 'var(--color-accent)' }}> wholesale</span> prices
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--color-text-secondary)' }}>
            You pay retail for AI inference. Enterprises get volume discounts.
            You can't negotiate alone, but you can negotiate together.
            The more members join, the cheaper compute gets for everyone.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/staking"
              className="px-6 py-3 rounded-lg text-white font-semibold text-base transition-colors"
              style={{ backgroundColor: 'var(--color-accent)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
            >
              Stake INFER
            </Link>
            <a
              href="https://casino.flowstack.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-lg font-semibold text-base border transition-colors"
              style={{ borderColor: 'var(--color-accent-2)', color: 'var(--color-accent-2)', backgroundColor: 'var(--color-accent-2-light)' }}
            >
              Try Casino (Live Demo)
            </a>
            <Link
              to="/tokenomics"
              className="px-6 py-3 rounded-lg font-semibold text-base border transition-colors"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Cheaper AI',
                desc: 'The co-op aggregates demand and negotiates wholesale rates with LLM providers. More members = more volume = deeper discounts. At scale, 2.5x more queries per dollar vs. retail.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                ),
              },
              {
                title: 'Earn as a Builder',
                desc: 'Build a site on Casino and it becomes your node in the network — with its own agent that you own. Users interact with your node, you earn 60% of every query in AGENT tokens.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                ),
              },
              {
                title: 'Own Your Infrastructure',
                desc: 'The foundation is a 501(c)(3) nonprofit. No venture investors, no exit pressure. Governance is on-chain. Every member has voice proportional to their stake.',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
              },
            ].map(({ title, desc, icon }) => (
              <div
                key={title}
                className="p-6 rounded-xl border"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                  {icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--color-text)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staking Tiers Preview */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-3" style={{ color: 'var(--color-text)' }}>
            Staking Tiers
          </h2>
          <p className="text-center mb-10" style={{ color: 'var(--color-text-secondary)' }}>
            Stake INFER to unlock discounted AGENT pricing and governance weight.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  {['Tier', 'INFER Required', 'Lock Period', 'Discount', 'Governance'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIER_INFO.map((t) => (
                  <tr key={t.tier} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>{t.name}</td>
                    <td className="py-3 px-4 font-mono" style={{ color: 'var(--color-text-secondary)' }}>{t.infer === 0 ? 'Free' : t.infer.toLocaleString()}</td>
                    <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>{t.lock}</td>
                    <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-accent-2)' }}>{t.discount}</td>
                    <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>{t.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/staking"
              className="inline-block px-6 py-3 rounded-lg text-white font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-accent)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
            >
              Start Staking
            </Link>
          </div>
        </div>
      </section>

      {/* Co-op Flywheel */}
      <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            The Co-op Flywheel
          </h2>
          <div className="space-y-4 text-left">
            {[
              'More members stake INFER and join the co-op.',
              'The foundation aggregates demand and negotiates deeper wholesale rates.',
              'Cheaper compute attracts more users and builders.',
              'Builders create sites on Casino — each one a node with its own agent, earning per-query revenue.',
              'INFER supply tightens. Discounts grow. The co-op compounds.',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed pt-1" style={{ color: 'var(--color-text-secondary)' }}>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
