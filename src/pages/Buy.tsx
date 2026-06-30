import { SEO } from '@/components/SEO';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import WalletButton from '@/components/WalletButton';
import TierBadge from '@/components/TierBadge';
import { useStakingPosition } from '@/hooks/useStakingPosition';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { usePreviewPurchase, useBuyAgent } from '@/hooks/useBuyAgent';
import { formatTokenAmount } from '@/lib/formatters';
import { formatUnits } from 'viem';
import { COMMUNITY_SALE_DATE, CONTRACTS, ARBISCAN_BASE } from '@/lib/contracts';

function InferSaleSection() {
  const isLive = Date.now() >= COMMUNITY_SALE_DATE.getTime();

  return (
    <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-accent)', backgroundColor: 'var(--color-accent-light)' }}>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--color-accent)' }}>Buy INFER</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>The membership token. Stake for discounts and governance.</p>

      {isLive ? (
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            The community sale is live. INFER is available on the Arbitrum DEX.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`https://app.uniswap.org/swap?outputCurrency=${CONTRACTS.INFER}&chain=arbitrum`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg text-white font-semibold text-sm text-center transition-colors"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              Buy on Uniswap
            </a>
            <a
              href={`${ARBISCAN_BASE}/token/${CONTRACTS.INFER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg font-semibold text-sm text-center border transition-colors"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              View on Arbiscan
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text)' }}>Community Sale</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              May 23, 2026 at 10:00 AM ET
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              400,000,000 INFER (40% of total supply) will be available for purchase.
              Pricing and purchase details will be announced before the sale.
            </p>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            After the community sale, INFER will be tradeable on Uniswap (Arbitrum) with DEX liquidity from the foundation treasury.
          </p>
        </div>
      )}
    </div>
  );
}

function AgentPurchaseSection() {
  const { address, isConnected } = useAccount();
  const position = useStakingPosition(address);
  const balances = useTokenBalances(address);
  const [amount, setAmount] = useState('');
  const [stablecoin, setStablecoin] = useState<'USDC' | 'USDT'>('USDC');
  const stableBalance = stablecoin === 'USDC' ? balances.usdc : balances.usdt;
  const preview = usePreviewPurchase(address, amount);
  const { approve, purchase, isApproving, isPurchasing } = useBuyAgent();

  const handleBuy = async () => {
    if (!amount) return;
    await approve(stablecoin, amount);
    await purchase(stablecoin, amount);
    setAmount('');
  };

  return (
    <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-accent-2)', backgroundColor: 'var(--color-accent-2-light)' }}>
      <h2 className="font-display text-xl font-bold mb-1" style={{ color: 'var(--color-accent-2)' }}>Buy AGENT</h2>
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        The operational token. Pay for AI queries. Buy with USDC or USDT.
      </p>

      {!isConnected ? (
        <div className="text-center py-6">
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Connect your wallet to buy AGENT.</p>
          <WalletButton />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Current tier info */}
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Your tier: <TierBadge tier={position.tier ?? 0} />
              {preview.discountBps !== undefined && Number(preview.discountBps) > 0 && (
                <span className="ml-2 font-semibold" style={{ color: 'var(--color-accent-2)' }}>
                  ({Number(preview.discountBps) / 100}% discount applied)
                </span>
              )}
            </div>
          </div>

          {/* Stablecoin selector */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Pay with</label>
            <div className="flex gap-2">
              {(['USDC', 'USDT'] as const).map((coin) => (
                <button
                  key={coin}
                  onClick={() => setStablecoin(coin)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold border transition-colors cursor-pointer"
                  style={{
                    borderColor: stablecoin === coin ? 'var(--color-accent-2)' : 'var(--color-border)',
                    backgroundColor: stablecoin === coin ? 'var(--color-accent-2-light)' : 'transparent',
                    color: stablecoin === coin ? 'var(--color-accent-2)' : 'var(--color-text-secondary)',
                  }}
                >
                  {coin}
                </button>
              ))}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Amount ({stablecoin})</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            />
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              Your {stablecoin} balance: {stableBalance === undefined ? '…' : parseFloat(formatUnits(stableBalance, 6)).toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Insufficient-funds hint — embedded wallets start empty */}
          {stableBalance !== undefined && stableBalance === 0n && (
            <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--color-accent-2-light)', color: 'var(--color-accent-2)', border: '1px solid var(--color-accent-2)' }}>
              This wallet has no {stablecoin}, and this on-chain path also needs ETH for gas. Most people just use the gasless <strong>Buy AGENT with Card</strong> option above — the backend mints AGENT straight to your wallet. Only continue here if you already hold {stablecoin} + ETH.
            </div>
          )}

          {/* Preview */}
          {preview.agentAmount !== undefined && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--color-text-secondary)' }}>You receive</span>
                <span className="font-mono font-semibold" style={{ color: 'var(--color-accent-2)' }}>
                  {formatTokenAmount(preview.agentAmount)} AGENT
                </span>
              </div>
              {Number(preview.discountBps) > 0 && (
                <div className="flex justify-between text-xs mt-1">
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Tier discount</span>
                  <span style={{ color: 'var(--color-accent-2)' }}>{Number(preview.discountBps) / 100}%</span>
                </div>
              )}
            </div>
          )}

          {/* Buy button */}
          <button
            onClick={handleBuy}
            disabled={isApproving || isPurchasing || !amount}
            className="w-full px-4 py-2.5 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-accent-2)' }}
          >
            {isApproving ? 'Approving...' : isPurchasing ? 'Purchasing...' : `Buy AGENT with ${stablecoin}`}
          </button>

          {/* Current AGENT balance — wallet ERC-20 + deposited in AgentPayment */}
          {balances.agent !== undefined && (
            <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
              Your AGENT balance: {formatTokenAmount((balances.agent ?? 0n) + (balances.agentDeposited ?? 0n))}
            </p>
          )}

          {/* Tip: stake for better rate */}
          {(position.tier === undefined || position.tier === 0) && (
            <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
              <Link to="/staking" className="underline font-semibold">Stake INFER</Link> to unlock up to 50% discount on AGENT purchases.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Preset tiers for card purchases
const CARD_TIERS = [
  { agent: 10,  usdCents: 500,  label: '$5.00',  popular: true },
  { agent: 50,  usdCents: 2500, label: '$25.00', popular: false },
  { agent: 200, usdCents: 9000, label: '$90.00', popular: false, badge: 'Save 10%' },
];

const SAGE_API = import.meta.env.VITE_SAGE_API_URL || 'https://sage-api.flowstack.fun';

interface StripeAgentSectionProps {
  returnTo?: string;
  needAgent?: number;
}

function StripeAgentSection({ returnTo, needAgent }: StripeAgentSectionProps) {
  // Pre-select the nearest tier that covers the need
  const defaultTier = needAgent
    ? (CARD_TIERS.find(t => t.agent >= needAgent) ?? CARD_TIERS[CARD_TIERS.length - 1])
    : CARD_TIERS[0];

  const [selectedTier, setSelectedTier] = useState(defaultTier);
  const [walletInput, setWalletInput] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const effectiveWallet = address || walletInput.trim();

  const handleBuyWithCard = async () => {
    if (!effectiveWallet) {
      setError('Enter your Arbitrum wallet address to receive AGENT.');
      return;
    }
    setError(null);
    setIsRedirecting(true);
    try {
      const successUrl = returnTo
        ? `${returnTo}${returnTo.includes('?') ? '&' : '?'}agent_purchased=${selectedTier.agent}`
        : `${window.location.origin}/buy?card_success=1&agent=${selectedTier.agent}`;

      const resp = await fetch(`${SAGE_API}/billing/stripe/buy-agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: effectiveWallet,
          amount_agent: selectedTier.agent,
          success_url: successUrl,
          cancel_url: window.location.href,
        }),
      });

      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed: ${resp.status}`);
      }

      const data = await resp.json();
      window.location.href = data.session_url;
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
      setIsRedirecting(false);
    }
  };

  return (
    <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-accent-2)', backgroundColor: 'var(--color-accent-2-light)' }}>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="font-display text-xl font-bold" style={{ color: 'var(--color-accent-2)' }}>Buy AGENT with Card</h2>
        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'var(--color-accent-2)', color: '#fff' }}>No wallet required</span>
      </div>
      <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
        Pay by credit card. AGENT is minted directly to your wallet on Arbitrum.
      </p>

      {needAgent && (
        <div className="p-3 mb-4 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-accent-2-light)', color: 'var(--color-accent-2)', border: '1px solid var(--color-accent-2)' }}>
          The app you came from needs <strong>{needAgent} AGENT</strong>. We've pre-selected the right tier below.
        </div>
      )}

      {/* Tier selector */}
      <div className="space-y-2 mb-4">
        {CARD_TIERS.map((tier) => (
          <button
            key={tier.agent}
            onClick={() => setSelectedTier(tier)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors cursor-pointer text-left"
            style={{
              borderColor: selectedTier.agent === tier.agent ? 'var(--color-accent-2)' : 'var(--color-border)',
              backgroundColor: selectedTier.agent === tier.agent ? 'var(--color-accent-2-light)' : 'transparent',
            }}
          >
            <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
              {tier.agent} AGENT
              {tier.popular && <span className="ml-2 text-xs text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-accent-2)' }}>Most popular</span>}
              {tier.badge && <span className="ml-2 text-xs" style={{ color: 'var(--color-accent-2)' }}>{tier.badge}</span>}
            </span>
            <span className="font-mono text-sm" style={{ color: 'var(--color-accent-2)' }}>{tier.label}</span>
          </button>
        ))}
      </div>

      {/* Wallet address */}
      {address ? (
        <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>
          Minting to connected wallet: <span className="font-mono">{address.slice(0, 10)}…</span>
        </p>
      ) : (
        <div className="mb-3">
          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            Arbitrum wallet address (to receive AGENT)
          </label>
          <input
            type="text"
            placeholder="0x…"
            value={walletInput}
            onChange={(e) => setWalletInput(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
          />
          <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            Don't have a wallet? <Link to="/" className="underline" style={{ color: 'var(--color-accent-2)' }}>Connect one here</Link> — Privy creates it in 30 seconds.
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs mb-3" style={{ color: '#ef4444' }}>{error}</p>
      )}

      <button
        onClick={handleBuyWithCard}
        disabled={isRedirecting}
        className="w-full px-4 py-2.5 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        style={{ backgroundColor: 'var(--color-accent-2)' }}
      >
        {isRedirecting ? 'Redirecting to checkout…' : `Buy ${selectedTier.agent} AGENT for ${selectedTier.label} →`}
      </button>
    </div>
  );
}

export default function Buy() {
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || undefined;
  const needAgent = searchParams.get('need') ? Number(searchParams.get('need')) : undefined;
  const cardSuccess = searchParams.get('card_success');

  return (
    <>
      <SEO
        title="Buy Tokens"
        description="Buy INFER for staking and governance, or buy AGENT with USDC/USDT to pay for AI queries at your tier-discounted rate."
        siteName="Open Inference Foundation"
        baseUrl="https://openinference.org"
        canonicalUrl="/buy"
        keywords={['buy INFER', 'buy AGENT', 'USDC', 'token sale', 'community sale', 'Arbitrum']}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--color-text)' }}>
          Buy Tokens
        </h1>

        {cardSuccess && (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-accent-2-light)', border: '1px solid var(--color-accent-2)', color: 'var(--color-accent-2)' }}>
            ✅ Payment complete! AGENT is being minted to your wallet on Arbitrum. This may take up to 60 seconds.
            {returnTo && (
              <a href={returnTo} className="ml-3 underline font-semibold">Return to app →</a>
            )}
          </div>
        )}

        <p className="text-lg mb-10" style={{ color: 'var(--color-text-secondary)' }}>
          Two tokens, two purposes. INFER is your membership — stake it, govern with it, never spend it.
          AGENT is your currency — buy it by card (gasless, delivered straight to your wallet) and spend it on queries.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <InferSaleSection />
          <StripeAgentSection returnTo={returnTo} needAgent={needAgent} />
        </div>

        {/* Advanced: on-chain crypto purchase. The backend doesn't relay this
            path — it calls AgentPurchase directly from the user's wallet, so it
            requires USDC + ETH for gas. Hidden behind a disclosure so the
            gasless card path above is the default. */}
        <details className="mt-6 rounded-xl border" style={{ borderColor: 'var(--color-border)' }}>
          <summary className="cursor-pointer px-4 py-3 text-sm font-semibold select-none" style={{ color: 'var(--color-text-secondary)' }}>
            Advanced: pay with crypto (USDC/USDT)
            <span className="ml-2 font-normal" style={{ color: 'var(--color-text-tertiary)' }}>
              — requires USDC + ETH for gas in your wallet
            </span>
          </summary>
          <div className="px-4 pb-4">
            <AgentPurchaseSection />
          </div>
        </details>

        {/* How it works */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Buy INFER', desc: 'Purchase INFER during the community sale or on Uniswap after launch.' },
              { step: '2', title: 'Stake for Discount', desc: 'Stake INFER to unlock 15-50% discount on AGENT purchases.' },
              { step: '3', title: 'Buy & Use AGENT', desc: 'Buy AGENT with USDC/USDT at your tier rate, or by card. Spend on AI queries.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <span
                  className="inline-flex w-7 h-7 rounded-full items-center justify-center text-xs font-bold text-white mb-3"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  {step}
                </span>
                <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>{title}</h3>
                <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
