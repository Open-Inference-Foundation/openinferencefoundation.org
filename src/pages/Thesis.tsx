import { SEO } from '@/components/SEO';
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
  { n: 1, label: 'WisdomTree: 280x Cheaper - The Real AI Revolution', href: 'https://www.wisdomtree.com/investments/blog/2025/05/19/280x-cheaper-the-real-ai-revolution-is-accessibility' },
  { n: 2, label: 'Gartner: 90% Drop in LLM Inference Costs by 2030', href: 'https://www.gartner.com/en/newsroom/press-releases/2026-03-25-gartner-predicts-that-by-2030-performing-inference-on-an-llm-with-1-trillion-parameters-will-cost-genai-providers-over-90-percent-less-than-in-2025' },
  { n: 3, label: 'Stanford HAI AI Index Report 2025', href: 'https://hai.stanford.edu/ai-index/2025-ai-index-report' },
  { n: 4, label: 'Oplexa: AI Inference Cost Crisis 2026', href: 'https://oplexa.com/ai-inference-cost-crisis-2026/' },
  { n: 5, label: 'AnalyticsWeek: Inference Economics 2026', href: 'https://analyticsweek.com/inference-economics-finops-ai-roi-2026/' },
  { n: 6, label: 'Grand View Research: AI Inference Market Report', href: 'https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-inference-market-report' },
];

export default function Thesis() {
  return (
    <>
      <SEO
        title="Own What You Build"
        description="Inference costs are collapsing and a few platforms are racing to capture the margin. The alternative: build an agent, own it, and keep the money it makes."
        siteName="Open Inference Foundation"
        canonicalUrl="/thesis"
        keywords={['AI agents', 'agent economy', 'creator ownership', 'inference costs', 'build AI agents', 'agent marketplace', 'inference co-op']}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-accent)' }}>
          Why This Exists
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight mb-8" style={{ color: 'var(--color-text)' }}>
          Own what you build
        </h1>

        <div className="space-y-6 text-base leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          <p>
            A tax accountant costs $200-500 per filing. A lease review from a lawyer runs $300-1,000. A financial
            advisor charges 1% of assets a year. A data scientist bills $150 an hour. These aren't luxuries -
            they're the baseline infrastructure of navigating modern life. Most people pay for none of them.
          </p>

          <p>
            An agent that reviews your lease and flags predatory clauses costs about $0.04 in inference. One that
            finds every deduction you're owed costs about the same. A budget built from your spending patterns -
            $0.02. A triage of your health data before you see a doctor - $0.03. These aren't hypotheticals.
            They're running today.
          </p>

          <p style={{ color: 'var(--color-text)' }}>
            <strong>
              The marginal cost of a tax accountant, a lawyer, a financial advisor, and a data scientist
              working for you is approaching zero. That is not a metaphor.
            </strong>
          </p>

          <p>
            So the interesting question isn't whether these agents exist. It's who owns them - and who keeps the
            money when they run.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            The inference paradox
          </h2>

          <p>
            The cost of a single AI inference is collapsing at a rate with no precedent in computing.
            Per-token costs for GPT-3.5-level performance fell over 280-fold between 2022 and late 2024 -
            from $20.00 to $0.07 per million tokens.<Source n={1} href="https://www.wisdomtree.com/investments/blog/2025/05/19/280x-cheaper-the-real-ai-revolution-is-accessibility" /> Gartner
            projects a further 90% reduction in frontier model inference costs by 2030.<Source n={2} href="https://www.gartner.com/en/newsroom/press-releases/2026-03-25-gartner-predicts-that-by-2030-performing-inference-on-an-llm-with-1-trillion-parameters-will-cost-genai-providers-over-90-percent-less-than-in-2025" /> Mixture-of-Experts
            architectures activate only the parameters a query needs. Quantization preserves 99% accuracy at
            25% of the compute.<Source n={3} href="https://hai.stanford.edu/ai-index/2025-ai-index-report" /> The raw
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
            But here's the paradox. While unit costs collapse, total AI spend is skyrocketing. The average
            enterprise AI budget grew from $1.2 million in 2024 to $7 million in 2026.<Source n={4} href="https://oplexa.com/ai-inference-cost-crisis-2026/" /> In
            2026, inference accounts for 85% of enterprise AI budgets - the weight has shifted entirely from
            training models to running them.<Source n={5} href="https://analyticsweek.com/inference-economics-finops-ai-roi-2026/" />
          </p>

          <p>
            The driver is agents. An agentic workflow - where an AI reasons iteratively, breaks down a task,
            calls tools, verifies outputs, and self-corrects - triggers 10 to 20 LLM calls to complete a single
            request.<Source n={4} href="https://oplexa.com/ai-inference-cost-crisis-2026/" /> Cheaper tokens,
            vastly more of them. The global AI inference market is projected to grow from $97 billion in 2024 to
            over $250 billion by 2030.<Source n={6} href="https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-inference-market-report" />
          </p>

          <p>
            This isn't about a discount on a chatbot. It's about who captures the margin on the most expensive
            line item in the AI economy.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            Expertise, unbundled from the expert
          </h2>

          <p>
            For all of history, expert work was priced by the scarcity of expert time. A lawyer charges what they
            charge because their hours are finite and their training was expensive. The expertise and the person
            were inseparable, so you paid for the person.
          </p>

          <p>
            Agents break that bond. An agent's time isn't scarce - running one more query doesn't take it away
            from another client. The expertise is encoded, not billed by the hour. The marginal cost of serving
            the next person is the inference cost, and that's the number in freefall.
          </p>

          <p style={{ color: 'var(--color-text)' }}>
            <strong>This is the first time the cost of expert work can be decoupled from the scarcity of
            experts.</strong> The expertise becomes a product - something you build once and can sell a
            thousand times.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            Platforms will capture the margin
          </h2>

          <p>
            Here's what's coming. Inference drops to near zero. The compute to run a tax agent or a legal review
            agent costs a fraction of a cent. But the price you pay won't drop with it.
          </p>

          <p>
            The marginal cost of a text message is zero; carriers charged $0.10-$0.25 for years. The marginal
            cost of streaming a song is a fraction of a penny; Spotify charges $11 a month. The gap between cost
            and price is where platforms live.
          </p>

          <p>
            When agent inference hits near-zero cost, three or four companies will offer "AI agents for everyone"
            at $20-50 a month. The agents will be good. The margins will be enormous. And the moat won't be the
            model - it'll be distribution: who owns the customers and the workflow
            integration.<Source n={2} href="https://www.gartner.com/en/newsroom/press-releases/2026-03-25-gartner-predicts-that-by-2030-performing-inference-on-an-llm-with-1-trillion-parameters-will-cost-genai-providers-over-90-percent-less-than-in-2025" /> Whoever
            owns that layer keeps the difference between a fraction of a cent and $20. That's the prize, and it's
            being built right now.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            Ownership is the whole point
          </h2>

          <p>
            There's a version of this where a handful of platforms own the agents, the customers, and the margin -
            and everyone who builds on them is a tenant, renting access to an audience they found themselves.
          </p>

          <p>
            This is the other version. You build an agent. You own it. You set the price. When someone pays to
            use it, most of the money is yours - paid out to your bank, in real dollars, not platform credits.
            We take a thin cut to keep the network running; you keep the rest.
          </p>

          <p>
            The network grows from the edges. Anyone who uses an agent can build their own and put it up. No
            gatekeeper decides what gets listed or what it's worth - the builder does. Every new agent is a node;
            the network gets more useful as it spreads, not as it concentrates.
          </p>

          <p style={{ color: 'var(--color-text)' }}>
            <strong>That's the whole difference. Not charity, not a discount - ownership.</strong> The platforms
            rent you access to customers you brought them. This doesn't.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            The co-op underneath
          </h2>

          <p>
            Two tokens hold it together. INFER is membership - you stake it to join and to vote on how the
            network is run. AGENT is what you spend to actually run agents, priced at cost plus a thin margin
            instead of platform markup.
          </p>

          <p>
            The design is an old one. Credit unions did it with banking; REI with gear; rural electric
            cooperatives with power lines the for-profit utilities wouldn't run. Members pool demand so the
            network can buy compute in bulk and price at cost - and the surplus is structured to belong to the
            members, not to outside shareholders. The bigger the network gets, the cheaper it runs for everyone
            in it. That's the goal the whole thing is built toward.
          </p>

          <hr style={{ borderColor: 'var(--color-border)' }} />

          <h2 className="font-display text-2xl font-bold pt-2" style={{ color: 'var(--color-text)' }}>
            The window
          </h2>

          <p>
            The ownership layer is still unbuilt. The platforms aren't entrenched yet, the pricing models aren't
            locked in, the defaults haven't calcified.
          </p>

          <p>
            Every year without an ownership-first alternative makes the platform version harder to displace - not
            because the technology gets harder, but because defaults get stickier and habits set. The agents are
            coming either way.
          </p>

          <p style={{ color: 'var(--color-text)' }}>
            <strong>The only real question is whether the people who build them own them - or rent them back from
            whoever got there first.</strong>
          </p>

          <div className="pt-6">
            <Link
              to="/buy"
              className="inline-block px-6 py-3 rounded-lg text-white font-semibold transition-colors"
              style={{ backgroundColor: 'var(--color-accent)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
            >
              Get started
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
