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
    // OWN (older) copy of @privy-io/react-auth in its node_modules. Without
    // dedupe, a production bundle pulls the SDK's <PrivyProvider> from one copy
    // while OIF's usePrivy() reads the other — two React contexts, so
    // usePrivy().ready never flips true and the login button sticks on
    // "Loading…". Dev masks this because vite resolves bare imports from the
    // project root. Dedupe forces a single instance in BOTH dev and build.
    // Only list packages that exist at OIF's root (not @privy-io/wagmi — the SDK
    // resolves that from its own node_modules and it's a different major).
    dedupe: ['react', 'react-dom', '@privy-io/react-auth'],
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
