import { formatUnits } from 'viem';

/** Format a wallet address as 0x1234...abcd */
export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Format a wei amount to human-readable token amount (18 decimals) */
export function formatTokenAmount(wei: bigint, decimals = 2): string {
  const formatted = formatUnits(wei, 18);
  const num = parseFloat(formatted);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(decimals);
}

/** Format a unix timestamp to a readable date string */
export function formatDate(timestamp: number): string {
  if (timestamp === 0) return '—';
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Format discount basis points to percentage string */
export function formatDiscount(bps: bigint): string {
  return `${Number(bps) / 100}%`;
}
