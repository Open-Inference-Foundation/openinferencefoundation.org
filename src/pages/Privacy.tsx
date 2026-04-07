import { SEO } from '@flowstack/sdk';
import { PrivacyFlowDiagram, DataIsolationDiagram } from '@/components/diagrams';

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy"
        description="Your data never reaches an LLM provider. PII is masked before any external call. Wallet-first auth means no email required. This is how agent infrastructure should work."
        siteName="Open Inference Foundation"
        baseUrl="https://openinference.org"
        canonicalUrl="/privacy"
        keywords={['AI privacy', 'PII masking', 'data isolation', 'HIPAA', 'GDPR', 'wallet auth', 'zero knowledge']}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--color-accent)' }}>
          Data Protection
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold leading-tight mb-4" style={{ color: 'var(--color-text)' }}>
          Privacy by Architecture
        </h1>
        <p className="text-lg mb-12" style={{ color: 'var(--color-text-secondary)' }}>
          Most AI platforms ask you to trust them with your data. We built the system so trust isn't required.
          PII is masked before it ever leaves your boundary. Your identity is a wallet address, not an email.
          And if you run a local model, your data never leaves your machine at all.
        </p>

        {/* The Inversion — leads the page */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            This Is Not How the Internet Works Today
          </h2>

          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            This isn't an AI-specific feature. It's a fundamentally different model from how data works
            on every website, app, and platform you've ever used.
          </p>

          {/* Side by side comparison */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {/* Today */}
            <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--color-error)' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-error)' }} />
                How it works today
              </h3>
              <div className="space-y-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <p>
                  You sign up for TurboTax. You enter your W-2, your dependents, your deductions.
                  That data goes into <strong style={{ color: 'var(--color-text)' }}>Intuit's database</strong>.
                  Intuit owns it. They store it on their terms, retain it on their schedule,
                  and use it for their purposes - ad targeting, aggregate analytics, whatever their
                  privacy policy allows (and privacy policies change).
                </p>
                <p>
                  You sign up for MyFitnessPal. Your meals, your weight, your health data goes into
                  <strong style={{ color: 'var(--color-text)' }}> Under Armour's database</strong>. They got
                  breached in 2018 - 150 million accounts. Your data was in their hands, and their
                  hands got hacked.
                </p>
                <p>
                  Every app you use follows this pattern. You give your data TO the company.
                  They put it in THEIR database. You hope they protect it. You hope they don't sell it.
                  You hope they don't get breached. You have no structural guarantee of any of this.
                  You have a privacy policy written by their lawyers.
                </p>
              </div>
            </div>

            {/* Our model */}
            <div
              className="p-5 rounded-xl border"
              style={{ borderColor: 'color-mix(in srgb, var(--color-accent-2) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-accent-2) 5%, transparent)' }}
            >
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--color-accent-2)' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent-2)' }} />
                How it works here
              </h3>
              <div className="space-y-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <p>
                  You use a tax prep site built on <a href="https://casino.flowstack.fun" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent-2)' }}>Casino</a>. You enter your W-2, your dependents,
                  your deductions. That data goes into <strong style={{ color: 'var(--color-text)' }}>your
                  database</strong> - an isolated MongoDB instance keyed to your identity. The builder
                  who made the tax app has no credentials for it. They can't query it, export it,
                  or sell it. They don't have it.
                </p>
                <p>
                  You use a fitness tracker built on <a href="https://casino.flowstack.fun" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent-2)' }}>Casino</a>. Your meals, your weight, your health
                  data goes into <strong style={{ color: 'var(--color-text)' }}>the same personal
                  database</strong>. If the builder's site goes offline tomorrow, your data is still
                  there. You can use a different fitness app and it reads the same data, because
                  the data lives with you, not with the app.
                </p>
                <p>
                  The app doesn't own your data. The app is a view into your data. It can read
                  and write while you're using it - the same way a website can read your cookies
                  while you're on it - but the underlying storage is yours. The builder ships the
                  logic. You own the state.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <p>
              The difference is structural, not just policy. On the traditional web, data protection
              is a promise. A terms of service. A checkbox. Here, it's architecture. The builder
              literally cannot access your database because they don't have credentials for it.
              It's not that they promised not to look. It's that the key doesn't exist.
            </p>
            <p>
              This flips the model. Instead of you giving your data to fifty different apps - each with
              their own database, their own retention policy, their own breach risk - you have one
              database. Apps come to your data. They operate on it while you're present. When you leave,
              the data stays with you.
            </p>
            <p>
              Think about what that means for everything - not just AI agents. Your tax data, your health
              records, your legal documents, your financial history. One personal database. Every app
              in the network can serve you without owning you. You move between a tax agent, a health
              agent, a legal agent, a financial agent - and they all read from the same source of truth.
              Your source of truth.
            </p>
            <p style={{ color: 'var(--color-text)' }}>
              <strong>
                This is not a privacy feature bolted onto an AI platform. It's a different answer to who
                owns the data layer of the internet.
              </strong>
            </p>
          </div>
        </div>

        {/* Core Principle */}
        <div
          className="p-6 rounded-xl border mb-12"
          style={{ borderColor: 'color-mix(in srgb, var(--color-accent-2) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-accent-2) 5%, transparent)' }}
        >
          <h2 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--color-accent-2)' }}>
            The Core Rule
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <strong style={{ color: 'var(--color-text)' }}>PII is masked before any external LLM call.</strong> Not after. Not "when possible."
            Before. Powered by{' '}
            <a href="https://microsoft.github.io/presidio/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent-2)' }}>Microsoft Presidio</a>
            {' '}- an open-source named entity recognition engine. If you type "My SSN is 123-45-6789,"
            Anthropic receives "My SSN is [US_SSN]." The raw value never crosses the platform boundary.
          </p>
        </div>

        {/* PII Flow Diagram */}
        <PrivacyFlowDiagram />

        {/* What Gets Masked */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            What Gets Masked
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Always masked */}
            <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--color-error)' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-error)' }} />
                Always Masked (non-negotiable)
              </h3>
              <div className="space-y-2">
                {[
                  'Social Security Numbers',
                  'Credit Card Numbers',
                  'Bank Account Numbers',
                  'IBAN Codes',
                  'Passport Numbers',
                  'Driver\'s License Numbers',
                  'Medical License Numbers',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="text-[8px]" style={{ color: 'var(--color-error)' }}>&#9679;</span>
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
                These are always redacted regardless of user settings. No toggle. No override.
              </p>
            </div>

            {/* User-configurable */}
            <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--color-warning)' }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }} />
                User-Configurable
              </h3>
              <div className="space-y-2">
                {[
                  { entity: 'Email Addresses', default_: 'Masked' },
                  { entity: 'IP Addresses', default_: 'Masked' },
                  { entity: 'Person Names', default_: 'Visible' },
                  { entity: 'Locations', default_: 'Visible' },
                  { entity: 'Dates', default_: 'Visible' },
                  { entity: 'Phone Numbers', default_: 'Visible' },
                ].map(({ entity, default_ }) => (
                  <div key={entity} className="flex items-center justify-between text-xs">
                    <span style={{ color: 'var(--color-text-secondary)' }}>{entity}</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                      style={{
                        backgroundColor: default_ === 'Masked' ? 'var(--color-warning-light)' : 'var(--color-surface-alt)',
                        color: default_ === 'Masked' ? 'var(--color-warning)' : 'var(--color-text-tertiary)',
                      }}
                    >
                      {default_}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
                Toggle per workspace. Agents that need names/locations for their task (e.g., health, legal) can see them.
              </p>
            </div>
          </div>
        </div>

        {/* Data Isolation Diagram */}
        <DataIsolationDiagram />

        {/* Your Data, Your Database */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Your Data, Your Database
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            When you use a site built on <a href="https://casino.flowstack.fun" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent)' }}>Casino</a> - a tax prep app, a fitness tracker, a legal review tool -
            your data doesn't go into the builder's database. It goes into yours.
          </p>

          <div
            className="p-6 rounded-xl border mb-6"
            style={{ borderColor: 'color-mix(in srgb, var(--color-accent) 40%, transparent)', backgroundColor: 'color-mix(in srgb, var(--color-accent) 5%, transparent)' }}
          >
            <h3 className="font-display font-bold text-sm mb-3" style={{ color: 'var(--color-accent)' }}>How it works</h3>
            <div className="space-y-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <p>
                Every user gets their own isolated MongoDB database, derived from their user ID. When you
                visit a tax prep site and enter your W-2 data, that data is written to a collection in
                <em> your</em> database - not the builder's. The collection is prefixed with the site ID
                so it's scoped to that app, but the database it lives in is yours.
              </p>
              <p>
                The builder who created the tax prep site has no credentials for your database. They can't
                query it. They can't read your records. They only have access to their own database. The
                site's code can read and write to your collections while you're using it - just like a
                web app reads your browser's localStorage - but the data belongs to you.
              </p>
            </div>
          </div>

          {/* Example flow */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Data</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Stored In</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Owner</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Builder Sees?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { data: 'Tax filings you enter', stored: 'Your database', owner: 'You', sees: 'No' },
                  { data: 'Health data you upload', stored: 'Your database', owner: 'You', sees: 'No' },
                  { data: 'Legal documents you share', stored: 'Your database', owner: 'You', sees: 'No' },
                  { data: 'Financial records', stored: 'Your database', owner: 'You', sees: 'No' },
                  { data: 'App configuration / schema', stored: 'App config (S3)', owner: 'Public', sees: 'Yes' },
                  { data: 'Builder\'s own analytics', stored: 'Builder\'s database', owner: 'Builder', sees: 'Only theirs' },
                ].map(({ data, stored, owner, sees }) => (
                  <tr key={data} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-2.5 px-4 text-xs" style={{ color: 'var(--color-text)' }}>{data}</td>
                    <td className="py-2.5 px-4 text-xs font-mono" style={{ color: 'var(--color-accent)' }}>{stored}</td>
                    <td className="py-2.5 px-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>{owner}</td>
                    <td className="py-2.5 px-4 text-xs" style={{ color: sees === 'No' ? 'var(--color-accent-2)' : 'var(--color-text-tertiary)' }}>{sees}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Identity */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Identity
          </h2>
          <div className="space-y-4">
            <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-text)' }}>Wallet-First Auth</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Your identity on the platform is a wallet address. No email required. No KYC.
                Sign In With Ethereum (SIWE) - you prove you own the wallet, the platform issues a JWT
                with your address as the user ID. That's it. Your prompts, your data, your agent interactions
                are keyed to a pseudonymous address, not your real name.
              </p>
            </div>
            <div className="p-5 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--color-text)' }}>What the Platform Knows</h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Your wallet address. Your staking tier. Your query volume (for billing). That's the ceiling.
                The platform doesn't know your name, your email (unless you optionally provide one), your
                location, or the content of your queries (masked before storage). Conversation logs in S3
                contain the masked version. CloudWatch logs contain only metadata - token counts and latencies,
                never prompts or responses.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            How This Compares
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}></th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-accent)' }}>Casino / OIF</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>ChatGPT / Claude</th>
                  <th className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>Self-Hosted</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'PII Masking', oif: 'Before LLM call', chatgpt: 'None (warns user)', self: 'DIY' },
                  { feature: 'Identity Required', oif: 'Wallet address', chatgpt: 'Email + phone', self: 'None' },
                  { feature: 'Data Retention', oif: 'User-controlled, encrypted S3', chatgpt: 'Provider stores 30+ days', self: 'You control' },
                  { feature: 'Log Contents', oif: 'Metadata only (no prompts)', chatgpt: 'Full prompts stored', self: 'You control' },
                  { feature: 'Cross-User Isolation', oif: 'JWT + tenant_id + DB-level', chatgpt: 'Account-based', self: 'Depends on infra' },
                  { feature: 'Local Inference Option', oif: 'Yes (Ollama)', chatgpt: 'No', self: 'Yes (the whole point)' },
                  { feature: 'File Upload Masking', oif: 'All entities, always', chatgpt: 'None', self: 'DIY' },
                  { feature: 'Setup Time', oif: 'Minutes (SaaS)', chatgpt: 'Minutes', self: 'Hours to days' },
                ].map(({ feature, oif, chatgpt, self }) => (
                  <tr key={feature} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="py-2.5 px-4 font-medium text-xs" style={{ color: 'var(--color-text)' }}>{feature}</td>
                    <td className="py-2.5 px-4 text-xs" style={{ color: 'var(--color-accent)' }}>{oif}</td>
                    <td className="py-2.5 px-4 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{chatgpt}</td>
                    <td className="py-2.5 px-4 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{self}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Local Inference */}
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Local Inference: Zero Data Leaves Your Device
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
            For the most sensitive work - health records, legal documents, financial data - you can
            run inference entirely on your own hardware via Ollama. No API calls. No logs on any server.
            No third-party BAAs required.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: 'HIPAA Compliance',
                desc: 'Protected health information never leaves the device. No Business Associate Agreement needed with any cloud LLM provider.',
              },
              {
                title: 'Attorney-Client Privilege',
                desc: 'Sending privileged documents to a cloud API could waive privilege. Local inference eliminates the risk entirely.',
              },
              {
                title: 'Financial Regulations',
                desc: 'SOC 2, PCI-DSS, SEC requirements for financial data processing. Local inference keeps audit scope contained to one machine.',
              },
              {
                title: 'Data Residency (GDPR/LGPD/PIPL)',
                desc: 'Data stays on your device in your jurisdiction. Automatic compliance with every data residency regulation on the planet.',
              },
            ].map(({ title, desc }) => (
              <div key={title} className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{title}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom line */}
        <div
          className="p-6 rounded-xl border"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <h2 className="font-display text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>
            The Short Version
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Your SSN, your medical records, your legal documents, your financial data - none of it
            ever reaches an LLM provider in raw form. PII is masked by{' '}
            <a href="https://microsoft.github.io/presidio/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent)' }}>Presidio</a>{' '}
            (Microsoft's open-source NER engine) at the middleware layer before any external call. Your identity is a wallet address.
            Your logs contain metadata, not content. And if that's still not enough, run local. The agent
            works the same way. The data just never leaves.
          </p>
        </div>
      </div>
    </>
  );
}
