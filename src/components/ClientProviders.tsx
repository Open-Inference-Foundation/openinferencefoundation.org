import { FlowstackProvider } from '@flowstack/sdk';
import { WalletProvider } from '@flowstack/sdk/wallet';
import { getFlowstackConfig } from '@/lib/config';
import WalletBridge from '@/components/WalletBridge';

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || '';
const WALLETCONNECT_PROJECT_ID =
  import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'db5dc51e2c7f27a61548ceac5f99df92';

/**
 * Wallet auth + Flowstack context for the OIF site. The @flowstack/sdk/wallet
 * WalletProvider wraps Privy + Wagmi + WalletConnect into a single drop-in.
 *
 * If OIF ever adds authenticated backend calls that would trigger 401 storms on
 * stale sessions, port Casino's P0-72 bridge pattern (FlowstackProviderWithPrivy
 * that reads usePrivy() state). For now, OIF is read-only enough that the basic
 * wrapper is sufficient.
 */
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const config = getFlowstackConfig();

  return (
    <WalletProvider
      privyAppId={PRIVY_APP_ID}
      chain="arbitrum"
      baseUrl={config.baseUrl}
      walletConnectProjectId={WALLETCONNECT_PROJECT_ID}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <FlowstackProvider config={config}>
        <WalletBridge />
        {children as any}
      </FlowstackProvider>
    </WalletProvider>
  );
}
