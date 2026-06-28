import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Dev only: the SDK lazy-imports `mermaid`, which OIF doesn't install.
      // `vite` dev fails import-analysis on the unresolved module, so alias it
      // to a no-op stub. The production build externalizes it instead (below).
      ...(command === 'serve'
        ? { mermaid: path.resolve(__dirname, './src/lib/mermaid-stub.ts') }
        : {}),
    },
    // CRITICAL: @flowstack/sdk is symlinked (file:../flowstack-sdk) and ships its
    // OWN copies of these packages in its node_modules (older majors:
    // @privy-io/react-auth@2, @privy-io/wagmi@1, wagmi@2). Without dedupe, a
    // production bundle pulls the SDK's <PrivyProvider>/<WagmiProvider> from one
    // copy while OIF's usePrivy()/useAccount() read another — separate React
    // contexts. Symptoms: login stuck on "Loading…" (Privy) and
    // WagmiProviderNotFoundError + "Connect" never clearing after connect
    // (wagmi). Dev masks it because vite resolves bare imports from the project
    // root. Dedupe forces a single instance of the whole Privy+wagmi stack in
    // BOTH dev and build. OIF must have each of these at its root (we install
    // @privy-io/wagmi@4 to pair with privy@3 + wagmi@3).
    dedupe: [
      'react',
      'react-dom',
      '@privy-io/react-auth',
      '@privy-io/wagmi',
      'wagmi',
      'viem',
      '@tanstack/react-query',
    ],
  },
  server: {
    port: 3001,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      // P0-88: @flowstack/sdk lazy-imports mermaid for markdown rendering. OIF
      // doesn't use that rendering path, so externalize rather than bundling
      // ~3MB of unused code. (This is the same fix Yeezy Studio uses.)
      external: ['mermaid'],
      // NOTE: do NOT manually split react / react-dom / @tanstack/react-query /
      // wagmi into separate chunks. Privy (@privy-io/react-auth + @privy-io/wagmi)
      // shares React context and a react-query client with the app; splitting
      // those packages across chunks makes Privy's init silently stall so
      // usePrivy().ready never becomes true (login button stuck on "Loading…").
      // Let Rollup decide chunking. See WalletButton/WalletProvider.
    },
  },
}));
