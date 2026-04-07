import { SEO } from '@flowstack/sdk';
import { useAccount } from 'wagmi';
import { TIER_INFO } from '@/lib/contracts';
import TierBadge from '@/components/TierBadge';
import WalletButton from '@/components/WalletButton';
import { useStakingPosition } from '@/hooks/useStakingPosition';
import { useTokenBalances } from '@/hooks/useTokenBalances';
import { useTotalStaked } from '@/hooks/useTotalStaked';
import { useStake } from '@/hooks/useStake';
import { useUnstake } from '@/hooks/useUnstake';
import { formatTokenAmount, formatDate } from '@/lib/formatters';
import { useState } from 'react';

function TierTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
            {['Tier', 'INFER Required', 'Lock Period', 'AGENT Discount', 'Governance Weight'].map((h) => (
              <th key={h} className="text-left py-3 px-4 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TIER_INFO.map((t) => (
            <tr key={t.tier} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td className="py-3 px-4"><TierBadge tier={t.tier} /></td>
              <td className="py-3 px-4 font-mono" style={{ color: 'var(--color-text-secondary)' }}>{t.infer === 0 ? 'Free' : t.infer.toLocaleString()}</td>
              <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>{t.lock}</td>
              <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-accent-2)' }}>{t.discount}</td>
              <td className="py-3 px-4" style={{ color: 'var(--color-text-secondary)' }}>{t.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ConnectedDashboard() {
  const { address } = useAccount();
  const position = useStakingPosition(address);
  const balances = useTokenBalances(address);
  const totalStaked = useTotalStaked();
  const { stake, approve, isApproving, isStaking } = useStake();
  const { unstake, isUnstaking } = useUnstake();

  const [stakeAmount, setStakeAmount] = useState('');
  const [targetTier, setTargetTier] = useState(1);
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const handleStake = async () => {
    if (!stakeAmount) return;
    const amount = BigInt(Math.floor(parseFloat(stakeAmount) * 1e18));
    await approve(amount);
    await stake(amount, targetTier);
    setStakeAmount('');
  };

  const handleUnstake = async () => {
    if (!unstakeAmount) return;
    const amount = BigInt(Math.floor(parseFloat(unstakeAmount) * 1e18));
    await unstake(amount);
    setUnstakeAmount('');
  };

  return (
    <div className="space-y-8">
      {/* Position Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Your Tier', value: position.tier !== undefined ? <TierBadge tier={position.tier} size="md" /> : '—' },
          { label: 'Staked INFER', value: position.amount !== undefined ? formatTokenAmount(position.amount) : '—' },
          { label: 'Lock Ends', value: position.lockEnd !== undefined ? formatDate(Number(position.lockEnd)) : '—' },
          { label: 'INFER Balance', value: balances.infer !== undefined ? formatTokenAmount(balances.infer) : '—' },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
            <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-tertiary)' }}>{label}</p>
            <div className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Network Stats */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-surface-alt)' }}>
        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
          Total INFER Staked Network-Wide: <span className="font-mono font-semibold" style={{ color: 'var(--color-text)' }}>
            {totalStaked !== undefined ? formatTokenAmount(totalStaked) : '...'}
          </span>
          {balances.agent !== undefined && (
            <> &middot; Your AGENT Balance: <span className="font-mono font-semibold" style={{ color: 'var(--color-text)' }}>{formatTokenAmount(balances.agent)}</span></>
          )}
        </p>
      </div>

      {/* Stake Form */}
      <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--color-text)' }}>Stake INFER</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Amount</label>
            <input
              type="number"
              placeholder="0.00"
              value={stakeAmount}
              onChange={(e) => setStakeAmount(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-text)',
                '--tw-ring-color': 'var(--color-accent)',
              } as React.CSSProperties}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>Target Tier</label>
            <select
              value={targetTier}
              onChange={(e) => setTargetTier(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            >
              <option value={1}>Member (1,000 INFER / 3 months)</option>
              <option value={2}>Pro (10,000 INFER / 6 months)</option>
              <option value={3}>Founder (100,000 INFER / 12 months)</option>
            </select>
          </div>
          <button
            onClick={handleStake}
            disabled={isApproving || isStaking || !stakeAmount}
            className="w-full px-4 py-2.5 rounded-lg text-white font-semibold text-sm transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {isApproving ? 'Approving...' : isStaking ? 'Staking...' : 'Approve & Stake'}
          </button>
        </div>
      </div>

      {/* Unstake Form */}
      {position.amount !== undefined && position.amount > 0n && (
        <div className="p-6 rounded-xl border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--color-text)' }}>Unstake INFER</h3>
          {position.lockEnd !== undefined && Number(position.lockEnd) > Date.now() / 1000 && (
            <div className="p-3 rounded-lg mb-4 text-sm" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
              Lock active until {formatDate(Number(position.lockEnd))}. Early unstaking forfeits 30% of accumulated surplus. Your principal is always safe.
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Amount to unstake"
              value={unstakeAmount}
              onChange={(e) => setUnstakeAmount(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
            />
            <button
              onClick={handleUnstake}
              disabled={isUnstaking || !unstakeAmount}
              className="px-5 py-2 rounded-lg font-semibold text-sm border transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
            >
              {isUnstaking ? 'Unstaking...' : 'Unstake'}
            </button>
          </div>
        </div>
      )}

      {/* Tier Table */}
      <div>
        <h3 className="font-display font-bold text-lg mb-4" style={{ color: 'var(--color-text)' }}>All Tiers</h3>
        <TierTable />
      </div>
    </div>
  );
}

export default function Staking() {
  const { isConnected } = useAccount();

  return (
    <>
      <SEO
        title="Staking"
        description="Stake INFER to unlock discounted AGENT pricing and governance weight. Member, Pro, and Founder tiers available."
        siteName="Open Inference Foundation"
        baseUrl="https://openinference.org"
        canonicalUrl="/staking"
        keywords={['INFER staking', 'staking tiers', 'AGENT discount', 'DeFi staking', 'Arbitrum staking']}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: 'var(--color-text)' }}>
          Staking
        </h1>
        <p className="text-lg mb-10" style={{ color: 'var(--color-text-secondary)' }}>
          Stake INFER to join a tier. Higher tiers unlock deeper AGENT discounts and more governance weight.
          Your principal is always withdrawable.
        </p>

        {isConnected ? (
          <ConnectedDashboard />
        ) : (
          <div>
            <TierTable />
            <div className="mt-10 p-8 rounded-xl text-center" style={{ backgroundColor: 'var(--color-accent-light)', border: '1px solid var(--color-accent)' }}>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                Connect your wallet to view your staking position and manage your stake.
              </p>
              <WalletButton />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
