import { SEO } from '@flowstack/sdk';
import { useAccount } from 'wagmi';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import WalletButton from '@/components/WalletButton';
import TierBadge from '@/components/TierBadge';
import { useStakingPosition } from '@/hooks/useStakingPosition';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { usePreviewPurchase, useBuyAgent } from '@/hooks/useBuyAgent';
import { formatTokenAmount } from '@/lib/formatters';
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
          </div>

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

          {/* Current AGENT balance */}
          {balances.agent !== undefined && (
            <p className="text-xs text-center" style={{ color: 'var(--color-text-tertiary)' }}>
              Your AGENT balance: {formatTokenAmount(balances.agent)}
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

export default function Buy() {
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
        <p className="text-lg mb-10" style={{ color: 'var(--color-text-secondary)' }}>
          Two tokens, two purposes. INFER is your membership — stake it, govern with it, never spend it.
          AGENT is your currency — buy it with stablecoins, spend it on queries.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <InferSaleSection />
          <AgentPurchaseSection />
        </div>

        {/* How it works */}
        <div className="mt-12">
          <h2 className="font-display text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Buy INFER', desc: 'Purchase INFER during the community sale or on Uniswap after launch.' },
              { step: '2', title: 'Stake for Discount', desc: 'Stake INFER to unlock 15-50% discount on AGENT purchases.' },
              { step: '3', title: 'Buy & Use AGENT', desc: 'Buy AGENT with USDC/USDT at your tier rate. Spend on AI queries.' },
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
