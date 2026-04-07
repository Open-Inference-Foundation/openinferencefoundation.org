import { SEO } from '@flowstack/sdk';
import { NetworkDiagram } from '@/components/diagrams';

export default function Agents() {
  return (
    <>
      <SEO
        title="The Agent Network"
        description="Every site built on Casino is a node in the network. Build a site, own its agent, and earn 60% of every query users run through it."
        siteName="Open Inference Foundation"
        baseUrl="https://openinference.org"
        canonicalUrl="/agents"
        keywords={['AI agents', 'agent network', 'builder revenue', 'Casino builder', 'edge nodes', 'distributed AI']}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--color-text)' }}>
          The Agent Network
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--color-text-secondary)' }}>
          Every site built on Casino comes with its own agent. That agent is a node in the network,
          owned by the builder. Users interact with your node, build on top of it, and create their own.
          The network grows from the edges.
        </p>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            How It Works
          </h2>
          <div className="space-y-4">
            {[
              {
                step: '1',
                title: 'Build a site on Casino',
                desc: 'Describe what you want in natural language. Casino builds a full React app with AI capabilities baked in — data, chat, tools, the works.',
              },
              {
                step: '2',
                title: 'Your site gets its own agent',
                desc: 'Every site is automatically attached to an agent that you own. That agent handles queries from anyone who uses your site. It\'s your node in the network.',
              },
              {
                step: '3',
                title: 'Users interact with your node',
                desc: 'When someone uses your site and queries the agent, that query settles on-chain. You earn 60% of every AGENT token spent through your node.',
              },
              {
                step: '4',
                title: 'Users create their own nodes',
                desc: 'Your users can build their own sites on Casino too — spawning new nodes that extend the network. Those builders own their nodes, and the pattern repeats.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-5 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 text-white"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  {step}
                </span>
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Diagram */}
        <NetworkDiagram />

        {/* Revenue Split */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Revenue Split
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Every query that hits your node settles on-chain. AGENT is split automatically:
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { pct: '60%', label: 'Node Owner', desc: 'You — the builder who created the site. Earn on every query your users run.', color: 'var(--color-accent)' },
              { pct: '30%', label: 'Foundation', desc: 'Converted to stablecoins to pay wholesale LLM compute bills for the co-op.', color: 'var(--color-accent-2)' },
              { pct: '10%', label: 'Infrastructure', desc: 'Covers orchestration, streaming, storage, and the SDK that makes it all work.', color: 'var(--color-text-tertiary)' },
            ].map(({ pct, label, desc, color }) => (
              <div key={label} className="p-5 rounded-xl border text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <p className="font-display text-3xl font-extrabold mb-1" style={{ color }}>{pct}</p>
                <p className="font-semibold text-sm mb-2" style={{ color: 'var(--color-text)' }}>{label}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
            Self-query protection: if user == builder, the builder's cut redirects to the foundation to prevent gaming.
          </p>
        </div>

        {/* What a Node Can Do */}
        <div className="mb-16">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            What Your Node Can Do
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            Every site built on Casino has full access to the agent swarm's capabilities. Your node isn't limited to one domain — it inherits all of them.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Data Analysis', desc: 'Upload datasets, run statistical models, generate visualizations' },
              { name: 'Finance', desc: 'Expense tracking, budgeting, investment analysis' },
              { name: 'Health', desc: 'Sleep analysis, fitness tracking, wellness insights' },
              { name: 'Legal Review', desc: 'Contract analysis, clause extraction, risk scoring' },
              { name: 'Tax Preparation', desc: 'Deduction identification, filing assistance, compliance' },
              { name: 'Site Building', desc: 'Generate full React apps — your users can build too' },
            ].map(({ name, desc }) => (
              <div key={name} className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{name}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Builder CTA */}
        <div className="p-8 rounded-xl text-center" style={{ backgroundColor: 'var(--color-accent-light)', border: '1px solid var(--color-accent)' }}>
          <h2 className="font-display text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            Build a Node
          </h2>
          <p className="text-sm mb-6 max-w-lg mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Create a site on Casino. It becomes your node — your agent, your users, your revenue.
            The Flowstack SDK handles auth, streaming, billing, and infrastructure.
            You just describe what you want to build.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://casino.flowstack.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-colors"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Start Building on Casino
            </a>
            <a
              href="https://github.com/KeonCummings/flowstack-sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg font-semibold text-sm border transition-colors"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              View SDK on GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
