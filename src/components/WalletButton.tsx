import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { formatAddress } from '@/lib/formatters';

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-3 py-1.5 rounded-lg text-sm font-mono font-medium border transition-colors cursor-pointer"
        style={{
          borderColor: 'var(--color-accent)',
          color: 'var(--color-accent)',
          backgroundColor: 'var(--color-accent-light)',
        }}
      >
        {formatAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        const connector = connectors[0];
        if (connector) connect({ connector });
      }}
      className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer"
      style={{ backgroundColor: 'var(--color-accent)' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
    >
      Connect Wallet
    </button>
  );
}
