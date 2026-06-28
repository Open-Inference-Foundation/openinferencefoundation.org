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
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          wagmi: ['wagmi', 'viem', '@tanstack/react-query'],
        },
      },
    },
  },
}));
