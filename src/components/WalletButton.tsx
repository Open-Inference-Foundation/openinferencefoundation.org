import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { formatAddress } from '@/lib/formatters';

/**
 * WalletButton — uses Privy directly because the SDK's `useWalletAuth().login()`
 * helper is a broken placeholder (throws "use LoginButton instead" instead of
 * actually opening the Privy modal). `usePrivy` works because the app is wrapped
 * in `<WalletProvider>` which internally mounts `<PrivyProvider>`.
 */
export default function WalletButton() {
  const { ready, authenticated, user, login } = usePrivy();
  const navigate = useNavigate();
  const address = user?.wallet?.address;

  if (!ready) {
    return (
      <button
        disabled
        className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white opacity-60 cursor-not-allowed"
        style={{ backgroundColor: 'var(--color-accent)' }}
      >
        Loading…
      </button>
    );
  }

  if (authenticated && address) {
    return (
      <button
        onClick={() => navigate('/account')}
        className="px-3 py-1.5 rounded-lg text-sm font-mono font-medium border transition-colors cursor-pointer"
        style={{
          borderColor: 'var(--color-accent)',
          color: 'var(--color-accent)',
          backgroundColor: 'var(--color-accent-light)',
        }}
        aria-label={`View account ${formatAddress(address)}`}
        title="View account & balances"
      >
        {formatAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer"
      style={{ backgroundColor: 'var(--color-accent)' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
    >
      Connect
    </button>
  );
}
