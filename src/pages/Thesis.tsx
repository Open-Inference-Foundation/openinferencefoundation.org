import { SEO } from '@flowstack/sdk';
import { Link } from 'react-router-dom';

function Source({ n, href }: { n: number; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[10px] font-mono align-super"
      style={{ color: 'var(--color-accent)' }}
    >
      [{n}]
    </a>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="p-4 rounded-lg border text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
      <div className="font-display text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--color-accent)' }}>{value}</div>
      <div className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
    </div>
  );
}

const SOURCES = [
  { n: 1, label: 'Stanford HAI AI Index Report 2025', href: 'https://hai.stanford.edu/ai-index/2025-ai-index-report' },
  { n: 2, label: 'Oplexa: AI Inference Cost Crisis 2026', href: 'https://oplexa.com/ai-inference-cost-crisis-2026/' },
  { n: 3, label: 'Gartner: 90% Drop in LLM Inference Costs by 2030', href: 'https://www.gartner.com/en/newsroom/press-releases/2026-03-25-gartner-predicts-that-by-2030-performing-inference-on-an-llm-with-1-trillion-parameters-will-cost-genai-providers-over-90-percent-less-than-in-2025' },
  { n: 4, label: 'WEF: The AI Divide Between Global North and South', href: 'https://www.weforum.org/stories/2023/01/davos23-ai-divide-global-north-global-south/' },
  { n: 5, label: 'UNCTAD: AI\'s $4.8 Trillion Future', href: 'https://unctad.org/news/ais-48-trillion-future-un-trade-and-development-alerts-divides-urges-action' },
  { n: 6, label: 'CSIS: From Divide to Delivery - AI in the Global South', href: 'https://www.csis.org/analysis/divide-delivery-how-ai-can-serve-global-south' },
  { n: 7, label: 'WisdomTree: 280x Cheaper - The Real AI Revolution', href: 'https://www.wisdomtree.com/investments/blog/2025/05/19/280x-cheaper-the-real-ai-revolution-is-accessibility' },
  { n: 8, label: 'Wharton: How AI Exclusion Impacts Humankind', href: 'https://knowledge.wharton.upenn.edu/article/how-ai-exclusion-impacts-humankind/' },
  { n: 9, label: 'UNESCO: AI Literacy and the New Digital Divide', href: 'https://www.unesco.org/ethics-ai/en/articles/ai-literacy-and-new-digital-divide-global-call-action' },
  { n: 10, label: 'DCO: The AI Divide - Digital Economy Trends 2026', href: 'https://det.dco.org/25-ai-divide' },
  { n: 11, label: 'Grand View Research: AI Inference Market Report', href: 'https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-inference-market-report' },
  { n: 12, label: 'AnalyticsWeek: Inference Economics 2026', href: 'https://analyticsweek.com/inference-economics-finops-ai-roi-2026/' },
  { n: 13, label: 'World Bank: Digital Progress and Trends Report 2025', href: 'https://openknowledge.worldbank.org/server/api/core/bitstreams/d2ac1ea9-b70e-4080-b5de-8b31098e992f/content' },
];

export default function Thesis() {
  return (
    <>
      <SEO
        title="Inference as a Utility"
        description="The marginal cost of a tax accountant, a lawyer, a financial advisor, and a data scientist working for you is approaching zero. The question is who gets access."
        siteName="Open Inference Foundation"
        baseUrl="https://openinference.org"
        canonicalUrl="/thesis"
        keywords={['inference costs', 'AI utility', 'digital divide', 'AI agents', 'marginalized communities', 'inference co-op', 'inference paradox']}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-accent)' }}>
          Why This Exists
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight mb-8" style={{ color: 'var(--color-text)' }}>
          Inference as a Utility
        </h1>

        <div className="space-y-6 text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <p>
            A tax accountant costs $200-500 per filing. A lease review from a lawyer runs $300-1,000. A financial
            advisor charges 1% of assets annually. A data scientist bills $150/hour. These aren't luxuries.
            They're the baseline infrastructure of navigating modern life - taxes, housing, money, decisions backed
            by actual analysis. Most people can't afford any of them.
          </p>

          <p>
            An agent that reviews your lease and flags predatory clauses costs about $0.04 in inference. An agent
            that identifies every deduction you're eligible for costs about the same. An agent that analyzes your
            spending patterns and builds a budget - $0.02. An agent that triages your health data and tells you
            what to bring up with your doctor - $0.03. These aren't hypotheticals. They're running today.
          </p>

          <p style={{ color: 'var(--color-text)' }}>
            <strong>
              The marginal cost of a tax accountant, a lawyer, a financial advisor, and a data scientist
              working for you is approaching zero. That is not a metaphor.
            </strong>
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            The inference paradox
          </h2>

          <p>
            The cost of a single AI inference is collapsing at a rate that has no precedent in computing.
            Per-token costs for GPT-3.5-level performance fell over 280-fold between 2022 and late 2024 -
            from $20.00 to $0.07 per million tokens.<Source n={7} href="https://www.wisdomtree.com/investments/blog/2025/05/19/280x-cheaper-the-real-ai-revolution-is-accessibility" /> Gartner
            projects a further 90% reduction in frontier model inference costs by 2030.<Source n={3} href="https://www.gartner.com/en/newsroom/press-releases/2026-03-25-gartner-predicts-that-by-2030-performing-inference-on-an-llm-with-1-trillion-parameters-will-cost-genai-providers-over-90-percent-less-than-in-2025" /> Mixture
            of Experts architectures only activate the parameters a query actually needs. Quantization
            preserves 99% accuracy at 25% of the original compute.<Source n={1} href="https://hai.stanford.edu/ai-index/2025-ai-index-report" /> The raw
            cost of asking a machine to think is in freefall.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 my-8">
            <Stat value="280x" label="Cost drop since 2022 for GPT-3.5-level inference" />
            <Stat value="90%" label="Further reduction projected by 2030 (Gartner)" />
            <Stat value="85%" label="Of enterprise AI budgets on inference in 2026" />
            <Stat value="$250B+" label="Global inference market by 2030" />
          </div>

          <p>
            But here's the paradox. While unit costs collapse, total enterprise AI spend is skyrocketing. The
            average enterprise AI budget grew from $1.2 million in 2024 to $7 million in 2026.<Source n={2} href="https://oplexa.com/ai-inference-cost-crisis-2026/" /> Some
            Fortune 500 companies report monthly inference bills in the tens of millions. In 2026, inference
            accounts for 85% of enterprise AI budgets - the weight has shifted entirely from training models
            to running them.<Source n={12} href="https://analyticsweek.com/inference-economics-finops-ai-roi-2026/" />
          </p>

          <p>
            The driver is agents. An agentic workflow - where an AI reasons iteratively, breaks down a task,
            calls tools, verifies outputs, and self-corrects - triggers 10 to 20 LLM calls to complete a single
            user request.<Source n={2} href="https://oplexa.com/ai-inference-cost-crisis-2026/" /> Add RAG
            architectures that inflate context windows 3-5x, always-on monitoring agents that consume compute
            around the clock, and the picture is clear: cheaper tokens, vastly more of them. The global AI
            inference market is projected to grow from $97 billion in 2024 to over $250 billion by
            2030.<Source n={11} href="https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-inference-market-report" />
          </p>

          <p>
            This is not about offering a discount on a chatbot. It's about who captures the margin on the most
            expensive line item in the AI economy.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            Professional services are the real gate
          </h2>

          <p>
            Every year, low-income Americans leave an estimated $7-10 billion in tax refunds unclaimed because
            they can't afford a tax preparer and don't know the rules. Renters sign predatory leases because
            they can't afford a lawyer to review them. People with chronic conditions manage them poorly
            because a $300/hour specialist isn't in the budget. Small businesses fail because they're making
            financial decisions blind.
          </p>

          <p>
            These aren't technology problems. They're access problems. The expertise exists. The people who
            need it can't reach it. Professionals charge rates that reflect years of training and the genuine
            scarcity of their time.
          </p>

          <p>
            Agents change the equation. An agent's time is not scarce. Running one more query doesn't take time
            away from another client. The marginal cost of serving the next person is the inference cost -
            which is collapsing. The expertise is encoded, not billed hourly. The agent doesn't sleep, doesn't
            have a waitlist, and doesn't charge more because you live in the wrong zip code.
          </p>

          <p style={{ color: 'var(--color-text)' }}>
            <strong>This is the first time in history that the cost of expert work can be decoupled
            from the scarcity of experts.</strong>
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            Cheap doesn't mean available
          </h2>

          <p>
            Electricity got cheap in the 1920s. Rural America didn't get it until the 1940s - and only because
            the government forced it. Markets optimize for density and ability to pay. They don't optimize for
            equity. The Rural Electrification Act of 1936 exists because the market decided it wasn't profitable
            to wire farms.
          </p>

          <p>
            The telephone followed the same pattern. The internet followed the same pattern. And every time, the gap
            between "it exists" and "you can use it" landed hardest on the people who were already behind.
          </p>

          <p>
            The AI divide is reproducing this pattern in real time. Africa accounts for less than 1% of global
            data center capacity despite being home to 18% of the world's
            population.<Source n={13} href="https://openknowledge.worldbank.org/server/api/core/bitstreams/d2ac1ea9-b70e-4080-b5de-8b31098e992f/content" /> The
            cost of setting up AI infrastructure is unaffordable for most resource-constrained countries, let
            alone maintaining it long
            term.<Source n={6} href="https://www.csis.org/analysis/divide-delivery-how-ai-can-serve-global-south" /> The
            UN reports that 118 countries - mostly in the Global South - are absent from major AI governance
            discussions entirely.<Source n={5} href="https://unctad.org/news/ais-48-trillion-future-un-trade-and-development-alerts-divides-urges-action" />
          </p>

          <p>
            Digital redlining - the systematic under-provision of AI services to marginalized populations -
            follows the logic of profit and data availability. Areas with less valuable consumer data receive
            less investment in AI-driven
            services.<Source n={8} href="https://knowledge.wharton.upenn.edu/article/how-ai-exclusion-impacts-humankind/" /> When
            an AI tool achieves a small performance edge, it can be scaled globally at near-zero marginal cost,
            creating winner-take-all dynamics that deepen the gap between nations and companies that own the
            algorithm and those forced to license
            it.<Source n={10} href="https://det.dco.org/25-ai-divide" />
          </p>

          <p>
            ChatGPT Plus costs $20 a month. That's 10-15% of monthly income at minimum wage in Nigeria, India,
            or the Philippines. And that's a chatbot - not the agents we're talking about. Enterprise agent
            platforms charge $25 to $60 per seat per month. API access requires a credit card, technical literacy,
            and US-based payment infrastructure. If you're in parts of Africa or Southeast Asia, you don't just
            pay more for agents. You get none.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            Platforms will capture the margin
          </h2>

          <p>
            Here's what's coming. Inference costs drop to near zero. The raw compute to run a tax agent or a
            legal review agent costs a fraction of a cent. But the price you pay doesn't drop with it. This is
            the inference paradox playing out at the consumer level.
          </p>

          <p>
            The marginal cost of sending a text message is zero. Carriers charged $0.10-$0.25 per message for
            years. The marginal cost of streaming a song is fractions of a penny. Spotify charges $11/month.
            The gap between cost and price is where platforms extract value.
          </p>

          <p>
            When agent inference hits near-zero cost, three or four companies will offer "AI agents for
            everyone" at $20-50/month. The agents will be good. The margins will be enormous. And the people
            who can't afford $20/month - the same people who most need a tax agent, a legal agent, a financial
            agent - will be right where they were before.
          </p>

          <p>
            Except now the gap isn't just about information. It's about capability. The rich have a team of
            agents doing specialist work. Everyone else has Google. The competitive moat is shifting from
            "who has the model" to "who has the best data and workflow
            integration."<Source n={3} href="https://www.gartner.com/en/newsroom/press-releases/2026-03-25-gartner-predicts-that-by-2030-performing-inference-on-an-llm-with-1-trillion-parameters-will-cost-genai-providers-over-90-percent-less-than-in-2025" /> That
            moat is being built right now, and the people being locked out of it are the ones who would benefit
            most.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            The co-op model
          </h2>

          <p>
            A co-op is the simplest idea in economics applied to a new problem. People who share a need pool
            their demand, negotiate collectively, and pass the savings to members. Credit unions do this with
            banking. REI does it with outdoor gear. Rural electric cooperatives did it with power lines when
            for-profit utilities refused to wire the countryside.
          </p>

          <p>
            The Open Inference Foundation applies this model to agent access. Members stake INFER to join.
            The foundation aggregates compute demand across the entire membership. It negotiates wholesale
            rates with LLM providers. Members buy AGENT at their tier-discounted rate and use it to access
            the full agent network - tax, legal, health, finance, data science, site building, all of it.
          </p>

          <p>
            The network is made of nodes. Every site built on <a href="https://casino.flowstack.fun" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent)' }}>Casino</a> is a node with its own agent. Builders
            own their nodes and earn 60% of every query. Users of one node can build their own, creating new
            nodes that extend the network. The network grows from the edges, not the center.
          </p>

          <p>
            The difference between this and a platform is ownership. Platforms capture the margin between
            near-zero inference cost and whatever they charge. Co-ops return that margin to members. When a
            tax agent costs $0.04 to run and a platform charges $2 for it, the co-op charges $0.06 and
            distributes the surplus back quarterly.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            The window
          </h2>

          <p>
            There's a window right now where the infrastructure of agent access is still being built. The
            platforms aren't fully entrenched. The pricing models aren't locked in. The distribution patterns
            haven't calcified.
          </p>

          <p>
            Every year without a credible cooperative alternative makes the platform model harder to displace.
            Not because the technology gets harder. Because the defaults get stickier. Because the communities
            that get left out learn to work around the gap instead of through it. Because the people who most
            need a tax agent, a legal agent, a health agent learn that those things exist but aren't for them.
          </p>

          <p>
            The marginal cost of expert work is going to zero. For the first time in history, a single mother
            can have the same quality of tax preparation as a Fortune 500 executive. A small business owner in
            Nairobi can have the same financial analysis as a hedge fund. A first-generation college student can
            have a legal review of their lease before they sign it.
          </p>

          <p>
            Unless access is gated by the same structures that have always gated it - wealth, geography,
            infrastructure, and who owns the distribution layer.
          </p>

          <p style={{ color: 'var(--color-text)' }}>
            <strong>That's what this foundation is for.</strong>
          </p>

          <div className="pt-6">
            <Link
              to="/buy"
              className="inline-block px-6 py-3 rounded-lg text-white font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-accent)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
            >
              Join the Co-op
            </Link>
          </div>

          {/* Sources */}
          <hr style={{ borderColor: 'var(--color-border)' }} className="mt-12" />
          <div className="pt-4">
            <h3 className="font-display text-sm font-bold mb-3" style={{ color: 'var(--color-text)' }}>Sources</h3>
            <div className="space-y-1">
              {SOURCES.map(({ n, label, href }) => (
                <div key={n} className="text-xs">
                  <span className="font-mono" style={{ color: 'var(--color-text-tertiary)' }}>[{n}]</span>{' '}
                  <a href={href} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-text-secondary)' }}>
                    {label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
