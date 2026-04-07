import { FlowstackProvider } from '@flowstack/sdk';
import { getFlowstackConfig } from '@/lib/config';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'db5dc51e2c7f27a61548ceac5f99df92';

const wagmiConfig = createConfig({
  chains: [arbitrum],
  connectors: [
    injected(),
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: 'Open Inference Foundation',
        description: 'The Inference Co-op',
        url: 'https://openinference.org',
        icons: ['https://openinference.org/favicon.ico'],
      },
      showQrModal: true,
    }),
  ],
  transports: {
    [arbitrum.id]: http(),
  },
});

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FlowstackProvider config={getFlowstackConfig()}>
          {children as React.ReactNode}
        </FlowstackProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
