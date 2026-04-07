/* ── Shared primitives (same pattern as keoncummings.com) ──────────── */

function Node({
  label,
  sub,
  accent = false,
  small = false,
  className = '',
}: {
  label: string;
  sub?: string;
  accent?: boolean;
  small?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-lg border px-3 py-2 text-center
        ${accent
          ? 'shadow-[0_0_20px_rgba(37,99,235,0.08)]'
          : ''
        }
        ${small ? 'px-2 py-1.5' : ''}
        ${className}
      `}
      style={{
        borderColor: accent ? 'color-mix(in srgb, var(--color-accent) 40%, transparent)' : 'var(--color-border)',
        backgroundColor: accent ? 'color-mix(in srgb, var(--color-accent) 5%, transparent)' : 'var(--color-surface-alt)',
      }}
    >
      <div
        className={`font-display font-semibold ${small ? 'text-xs' : 'text-sm'}`}
        style={{ color: accent ? 'var(--color-accent)' : 'var(--color-text)' }}
      >
        {label}
      </div>
      {sub && <div className={`mt-0.5 ${small ? 'text-[10px]' : 'text-xs'}`} style={{ color: 'var(--color-text-tertiary)' }}>{sub}</div>}
    </div>
  );
}

function GreenNode({
  label,
  sub,
  small = false,
  className = '',
}: {
  label: string;
  sub?: string;
  small?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`
        rounded-lg border px-3 py-2 text-center shadow-[0_0_20px_rgba(5,150,105,0.08)]
        ${small ? 'px-2 py-1.5' : ''}
        ${className}
      `}
      style={{
        borderColor: 'color-mix(in srgb, var(--color-accent-2) 40%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--color-accent-2) 5%, transparent)',
      }}
    >
      <div className={`font-display font-semibold ${small ? 'text-xs' : 'text-sm'}`} style={{ color: 'var(--color-accent-2)' }}>
        {label}
      </div>
      {sub && <div className={`mt-0.5 ${small ? 'text-[10px]' : 'text-xs'}`} style={{ color: 'var(--color-text-tertiary)' }}>{sub}</div>}
    </div>
  );
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center ${className}`}>
      <div className="h-6 w-px relative" style={{ backgroundColor: 'color-mix(in srgb, var(--color-border) 80%, transparent)' }}>
        <div
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent"
          style={{ borderTopColor: 'color-mix(in srgb, var(--color-border) 80%, transparent)' }}
        />
      </div>
    </div>
  );
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-[10px] uppercase tracking-widest text-center ${className}`} style={{ color: 'var(--color-text-tertiary)' }}>{children}</div>;
}

function DiagramContainer({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="my-8 rounded-xl border p-6 overflow-x-auto" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
      {title && <Label className="mb-4">{title}</Label>}
      {children}
    </div>
  );
}

/* ── Token Flow Diagram ───────────────────────────────────────────── */

export function TokenFlowDiagram() {
  return (
    <DiagramContainer title="Token Flow">
      <div className="flex flex-col items-center gap-0 max-w-2xl mx-auto">
        {/* User entry */}
        <Node label="User" sub="connects wallet on Arbitrum One" accent className="w-full max-w-xs" />
        <Arrow />

        {/* Two parallel paths */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* INFER path */}
          <div className="flex flex-col items-center gap-0">
            <Node label="Buy INFER" sub="community sale or Uniswap DEX" accent />
            <Arrow />
            <Node label="InferStaking" sub="stake() · select tier · lock period" accent />
            <Arrow />
            <div className="grid grid-cols-1 gap-1.5 w-full">
              <div className="flex items-center gap-2 justify-center">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text-tertiary)' }}>getTier()</span>
                <span style={{ color: 'var(--color-text-tertiary)' }}>&#8594;</span>
              </div>
            </div>
          </div>

          {/* AGENT path */}
          <div className="flex flex-col items-center gap-0">
            <GreenNode label="Pay USDC/USDT" sub="stablecoins" />
            <Arrow />
            <GreenNode label="AgentPurchase" sub="tier discount applied · mint AGENT" />
            <Arrow />
            <GreenNode label="AGENT minted" sub="to user wallet" />
          </div>
        </div>

        <Arrow />

        {/* Converge: deposit + use */}
        <Node label="AgentPayment" sub="deposit AGENT · query the network" accent className="w-full" />
        <Arrow />

        {/* Settlement split */}
        <div
          className="rounded-lg border p-4 w-full shadow-[0_0_20px_rgba(37,99,235,0.08)]"
          style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-accent) 5%, transparent)' }}
        >
          <div className="font-display text-sm font-semibold text-center mb-3" style={{ color: 'var(--color-accent)' }}>Settlement</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border p-2 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
              <div className="font-display text-lg font-bold" style={{ color: 'var(--color-accent)' }}>60%</div>
              <div className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>Node Owner</div>
            </div>
            <div className="rounded-lg border p-2 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
              <div className="font-display text-lg font-bold" style={{ color: 'var(--color-accent-2)' }}>30%</div>
              <div className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>Foundation</div>
            </div>
            <div className="rounded-lg border p-2 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
              <div className="font-display text-lg font-bold" style={{ color: 'var(--color-text-tertiary)' }}>10%</div>
              <div className="text-[10px]" style={{ color: 'var(--color-text-secondary)' }}>Infrastructure</div>
            </div>
          </div>
        </div>
      </div>
    </DiagramContainer>
  );
}

/* ── Network Node Diagram ─────────────────────────────────────────── */

export function NetworkDiagram() {
  return (
    <DiagramContainer title="Distributed Agent Network">
      <div className="flex flex-col items-center gap-0 max-w-2xl mx-auto">
        {/* Casino platform */}
        <Node label="Casino" sub="builder platform · describe what you want" accent className="w-full max-w-sm" />
        <Arrow />
        <Label>builds sites, each with its own agent</Label>
        <Arrow />

        {/* Builder nodes */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {[
            { label: 'Fitness Tracker', sub: 'health agent node' },
            { label: 'Tax Advisor', sub: 'tax prep agent node' },
            { label: 'Lease Review', sub: 'legal agent node' },
          ].map((n) => (
            <GreenNode key={n.label} label={n.label} sub={n.sub} small />
          ))}
        </div>

        <Arrow />
        <Label>users interact with nodes · then build their own</Label>
        <Arrow />

        {/* Edge nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
          {['Meal Planner', 'PT Scheduler', 'Self-Employed Tax', 'Rental Deductions', 'NDA Review'].map((name) => (
            <div key={name} className="rounded-lg border px-2 py-1.5 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
              <div className="text-[10px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>{name}</div>
            </div>
          ))}
        </div>

        <Arrow />

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 w-full">
          {['...', '...', '...', '...', '...'].map((_, i) => (
            <div key={i} className="rounded-lg border px-2 py-1 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
              <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>node</div>
            </div>
          ))}
        </div>

        <div className="mt-3 text-center">
          <span className="text-[10px] px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-text-tertiary)' }}>
            Every node earns 60% · every node can spawn more nodes
          </span>
        </div>
      </div>
    </DiagramContainer>
  );
}

/* ── Staking Tiers Diagram ────────────────────────────────────────── */

export function StakingTiersDiagram() {
  return (
    <DiagramContainer title="Staking Tier Architecture">
      <div className="flex flex-col items-center gap-0 max-w-2xl mx-auto">
        <Node label="INFER Token" sub="1B fixed supply · ERC-20 on Arbitrum" accent className="w-full max-w-sm" />
        <Arrow />
        <Node label="InferStaking Contract" sub="stake() · getTier() · getDiscount() · getWeight()" accent className="w-full max-w-sm" />
        <Arrow />

        {/* Tiers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
          <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
            <div className="text-xs font-display font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>Base</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>0 INFER</div>
            <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>0% discount</div>
          </div>
          <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'color-mix(in srgb, var(--color-tier-member) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-tier-member) 5%, transparent)' }}>
            <div className="text-xs font-display font-semibold" style={{ color: 'var(--color-tier-member)' }}>Member</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>1,000 INFER</div>
            <div className="text-[10px]" style={{ color: 'var(--color-accent-2)' }}>15% discount · 1x vote</div>
          </div>
          <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'color-mix(in srgb, var(--color-tier-pro) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-tier-pro) 5%, transparent)' }}>
            <div className="text-xs font-display font-semibold" style={{ color: 'var(--color-tier-pro)' }}>Pro</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>10,000 INFER</div>
            <div className="text-[10px]" style={{ color: 'var(--color-accent-2)' }}>30% discount · 2x vote</div>
          </div>
          <div className="rounded-lg border p-3 text-center" style={{ borderColor: 'color-mix(in srgb, var(--color-tier-founder) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-tier-founder) 5%, transparent)' }}>
            <div className="text-xs font-display font-semibold" style={{ color: 'var(--color-tier-founder)' }}>Founder</div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--color-text-secondary)' }}>100,000 INFER</div>
            <div className="text-[10px]" style={{ color: 'var(--color-accent-2)' }}>50% discount · 5x vote</div>
          </div>
        </div>

        <Arrow />

        {/* What tiers unlock */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <GreenNode label="AgentPurchase" sub="getTier() → apply discount to AGENT price" small />
          <Node label="SurplusDistribution" sub="getWeight() → pro-rata quarterly payout" small />
        </div>
      </div>
    </DiagramContainer>
  );
}

/* ── Infrastructure Diagram ───────────────────────────────────────── */

export function InfrastructureDiagram() {
  return (
    <DiagramContainer title="On-Chain Infrastructure">
      <div className="flex flex-col items-center gap-0 max-w-2xl mx-auto">
        {/* Top: User */}
        <Node label="User Wallet" sub="MetaMask · WalletConnect · Arbitrum One" accent className="w-full max-w-xs" />
        <Arrow />

        {/* Contract layer */}
        <div
          className="rounded-lg border p-4 w-full shadow-[0_0_20px_rgba(37,99,235,0.08)]"
          style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-accent) 5%, transparent)' }}
        >
          <div className="font-display text-sm font-semibold text-center" style={{ color: 'var(--color-accent)' }}>Smart Contracts</div>
          <div className="text-[10px] text-center mt-1 mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Arbitrum One · all owned by Gnosis Safe (2-of-3)</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Node label="INFER" sub="ERC-20 · 1B fixed" small />
            <GreenNode label="AGENT v2" sub="ERC-20 · mintable" small />
            <Node label="InferStaking" sub="stake · tiers · locks" small accent />
            <GreenNode label="AgentPurchase v2" sub="USDC/USDT → AGENT" small />
            <Node label="AgentPayment v3" sub="deposit · settle · split" small accent />
            <Node label="SurplusDistribution" sub="Merkle claims" small />
          </div>
        </div>
        <Arrow />

        {/* Off-chain layer */}
        <div className="rounded-lg border p-4 w-full" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
          <div className="font-display text-sm font-semibold text-center" style={{ color: 'var(--color-text)' }}>Off-Chain Infrastructure</div>
          <div className="text-[10px] text-center mt-1 mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Flowstack SDK · ECS · S3 · DynamoDB</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <Node label="Casino" sub="site builder" small />
            <Node label="Agent Swarm" sub="26 specialists" small />
            <Node label="Daytona" sub="code sandbox" small />
            <Node label="CloudFront" sub="CDN delivery" small />
          </div>
        </div>
        <Arrow />

        {/* Storage */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <Node label="S3" sub="sites · datasets · artifacts" small />
          <Node label="DynamoDB" sub="metadata · sessions · usage" small />
          <Node label="KMS" sub="credential encryption" small />
        </div>
      </div>
    </DiagramContainer>
  );
}

/* ── Privacy Flow Diagram ─────────────────────────────────────────── */

function RedNode({
  label,
  sub,
  small = false,
  className = '',
}: {
  label: string;
  sub?: string;
  small?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-center ${small ? 'px-2 py-1.5' : ''} ${className}`}
      style={{
        borderColor: 'color-mix(in srgb, var(--color-error) 40%, transparent)',
        backgroundColor: 'color-mix(in srgb, var(--color-error) 5%, transparent)',
      }}
    >
      <div className={`font-display font-semibold ${small ? 'text-xs' : 'text-sm'}`} style={{ color: 'var(--color-error)' }}>
        {label}
      </div>
      {sub && <div className={`mt-0.5 ${small ? 'text-[10px]' : 'text-xs'}`} style={{ color: 'var(--color-text-tertiary)' }}>{sub}</div>}
    </div>
  );
}

export function PrivacyFlowDiagram() {
  return (
    <DiagramContainer title="Data Flow: How PII Is Protected">
      <div className="flex flex-col items-center gap-0 max-w-2xl mx-auto">
        {/* User query */}
        <div className="rounded-lg border px-4 py-2 w-full text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-alt)' }}>
          <span className="text-xs italic" style={{ color: 'var(--color-text-tertiary)' }}>
            "My SSN is 123-45-6789. Review my lease at 42 Oak St."
          </span>
        </div>
        <Arrow />

        {/* Auth layer */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <Node label="JWT Validation" sub="tenant_id extracted" small />
          <Node label="Wallet / Session" sub="user_id verified" small />
          <Node label="Workspace Isolation" sub="ownership enforced" small />
        </div>
        <Arrow />

        {/* PII Masking - the critical layer */}
        <RedNode
          label="PII Masking Layer (Presidio)"
          sub="SSNs, credit cards, bank numbers ALWAYS masked. Emails, names, locations configurable."
          className="w-full"
        />

        <div className="flex items-center gap-2 my-1">
          <Arrow />
          <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-surface-alt)', color: 'var(--color-error)' }}>
            "My SSN is [US_SSN]. Review my lease at [LOCATION]."
          </span>
        </div>

        {/* Agent + LLM */}
        <Node label="Agent (Strands SDK)" sub="receives MASKED query only" accent className="w-full" />
        <Arrow />

        <div className="grid grid-cols-2 gap-2 w-full">
          <Node label="LLM Provider" sub="Anthropic / OpenAI / Google" small accent />
          <GreenNode label="OR: Local Model" sub="Ollama · zero data leaves device" small />
        </div>
        <Arrow />

        {/* Response masking */}
        <RedNode
          label="Response Masking"
          sub="LLM response scanned and masked before reaching user"
          className="w-full"
        />
        <Arrow />

        {/* Storage */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <Node label="S3 (Encrypted)" sub="masked conversation stored" small />
          <Node label="CloudWatch Logs" sub="metadata only, no prompts" small />
          <GreenNode label="User Receives" sub="masked response" small />
        </div>

        {/* Bottom label */}
        <div className="mt-3 flex items-center justify-center gap-2 py-2 rounded-lg w-full" style={{ backgroundColor: 'var(--color-surface-alt)' }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-error)' }} />
          <p className="text-[10px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
            Raw PII never crosses the platform boundary. LLM providers see redacted text only.
          </p>
        </div>
      </div>
    </DiagramContainer>
  );
}

/* ── Data Isolation Diagram ───────────────────────────────────────── */

export function DataIsolationDiagram() {
  return (
    <DiagramContainer title="Multi-Tenant Data Isolation">
      <div className="flex flex-col items-center gap-0 max-w-2xl mx-auto">
        {/* Incoming requests */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <Node label="Builder A" sub="tax prep app" small accent />
          <Node label="Builder B" sub="fitness tracker" small accent />
          <Node label="Builder C" sub="legal review" small accent />
        </div>
        <Arrow />

        {/* Auth + isolation */}
        <div
          className="rounded-lg border p-4 w-full"
          style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-accent) 5%, transparent)' }}
        >
          <div className="font-display text-sm font-semibold text-center" style={{ color: 'var(--color-accent)' }}>Auth + Isolation Middleware</div>
          <div className="text-[10px] text-center mt-1 mb-3" style={{ color: 'var(--color-text-tertiary)' }}>JWT &#8594; tenant_id &#8594; user_id &#8594; workspace_id (all cryptographic, not client-supplied)</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <Node label="Tenant Isolation" sub="request.state.tenant_id" small />
            <Node label="Workspace Guard" sub="owner_user_id check" small />
            <Node label="App Scope" sub="collection prefix fence" small />
            <Node label="PII Masking" sub="Presidio pre-filter" small />
          </div>
        </div>
        <Arrow />

        {/* Isolated storage */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'color-mix(in srgb, var(--color-tier-member) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-tier-member) 5%, transparent)' }}>
            <div className="text-xs font-display font-semibold" style={{ color: 'var(--color-tier-member)' }}>Builder A's Data</div>
            <div className="text-[10px] mt-1 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>s3://tenant_a/user/ws/</div>
            <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>tax_app__filings</div>
          </div>
          <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'color-mix(in srgb, var(--color-tier-pro) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-tier-pro) 5%, transparent)' }}>
            <div className="text-xs font-display font-semibold" style={{ color: 'var(--color-tier-pro)' }}>Builder B's Data</div>
            <div className="text-[10px] mt-1 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>s3://tenant_b/user/ws/</div>
            <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>fitness__workouts</div>
          </div>
          <div className="p-3 rounded-lg border text-center" style={{ borderColor: 'color-mix(in srgb, var(--color-tier-founder) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-tier-founder) 5%, transparent)' }}>
            <div className="text-xs font-display font-semibold" style={{ color: 'var(--color-tier-founder)' }}>Builder C's Data</div>
            <div className="text-[10px] mt-1 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>s3://tenant_c/user/ws/</div>
            <div className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>legal__contracts</div>
          </div>
        </div>

        {/* Isolation note */}
        <div className="mt-3 flex items-center justify-center gap-2 py-2 rounded-lg w-full" style={{ backgroundColor: 'var(--color-surface-alt)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-tertiary)' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-[10px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
            Builder A cannot read Builder B's data. Enforced at the database layer, not application logic.
          </p>
        </div>
      </div>
    </DiagramContainer>
  );
}
