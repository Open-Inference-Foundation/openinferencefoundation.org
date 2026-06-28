import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { SEO } from '@/components/SEO';
import WalletButton from '@/components/WalletButton';
import TierBadge from '@/components/TierBadge';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { useStakingPosition } from '@/hooks/useStakingPosition';
import { formatAddress } from '@/lib/formatters';
import { ARBISCAN_BASE } from '@/lib/contracts';

function fmt(v: bigint | undefined, decimals: number, dp = 4): string {
  if (v === undefined) return '—';
  const n = parseFloat(formatUnits(v, decimals));
  return n.toLocaleString('en-US', { maximumFractionDigits: dp });
}

interface Row {
  symbol: string;
  name: string;
  value: bigint | undefined;
  decimals: number;
}

export default function Account() {
  const { ready, authenticated, user, logout } = usePrivy();
  const { address: wagmiAddr } = useAccount();
  const address = (user?.wallet?.address ?? wagmiAddr) as `0x${string}` | undefined;

  const { infer, agent, usdc, usdt } = useTokenBalances(address);
  const { data: eth } = useBalance({ address, query: { enabled: !!address } });
  const position = useStakingPosition(address);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };

  const rows: Row[] = [
    { symbol: 'ETH', name: 'Ethereum', value: eth?.value, decimals: 18 },
    { symbol: 'USDC', name: 'USD Coin', value: usdc, decimals: 6 },
    { symbol: 'USDT', name: 'Tether', value: usdt, decimals: 6 },
    { symbol: 'AGENT', name: 'Query credits', value: agent, decimals: 18 },
    { symbol: 'INFER', name: 'Membership token', value: infer, decimals: 18 },
  ];

  return (
    <>
      <SEO
        title="Account"
        description="Your Open Inference Foundation wallet: balances, tier, and tokens."
        siteName="Open Inference Foundation"
        canonicalUrl="/account"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: 'var(--color-text)' }}>
          Account
        </h1>

        {ready && !authenticated ? (
          <div className="mt-8 p-6 rounded-xl border text-center" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Sign in to view your wallet and balances.
            </p>
            <div className="max-w-xs mx-auto"><WalletButton /></div>
          </div>
        ) : (
          <>
            {/* Wallet card */}
            <div className="mt-6 p-5 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-tertiary)' }}>Wallet</span>
                  <span className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>
                    {address ? formatAddress(address) : '—'}
                  </span>
                  {address && (
                    <button onClick={copy} className="text-xs px-2 py-0.5 rounded border cursor-pointer"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                  {address && (
                    <a href={`${ARBISCAN_BASE}/address/${address}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs underline" style={{ color: 'var(--color-accent)' }}>
                      Arbiscan
                    </a>
                  )}
                </div>
                <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  Tier: <TierBadge tier={position.tier ?? 0} />
                </div>
              </div>
              {user?.email?.address && (
                <p className="mt-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                  Signed in as {user.email.address}
                </p>
              )}
            </div>

            {/* Balances */}
            <h2 className="mt-8 mb-3 font-display text-lg font-bold" style={{ color: 'var(--color-text)' }}>Balances</h2>
            <div className="rounded-xl border divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {rows.map((r) => (
                <div key={r.symbol} className="flex items-center justify-between gap-4 px-4 py-3" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{r.symbol}</div>
                    <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{r.name}</div>
                  </div>
                  <div className="font-mono text-sm text-right" style={{ color: 'var(--color-text)' }}>
                    {fmt(r.value, r.decimals)}
                  </div>
                </div>
              ))}
            </div>

            {/* Funding note */}
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
              Buying AGENT is <strong>gasless</strong> — <Link to="/buy" className="underline font-semibold">buy with a card</Link> and it's minted straight to this wallet (no ETH or USDC needed). The on-chain USDC path is only for crypto-native users who already hold USDC + ETH.
            </div>

            <div className="mt-8">
              <button onClick={() => logout()} className="text-sm px-4 py-2 rounded-lg border cursor-pointer"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
