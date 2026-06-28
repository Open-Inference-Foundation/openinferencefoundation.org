import { useReadContract } from 'wagmi';
import { CONTRACTS, STABLECOINS, ERC20_ABI } from '@/lib/contracts';

interface TokenBalances {
  infer: bigint | undefined;
  agent: bigint | undefined;
  usdc: bigint | undefined;
  usdt: bigint | undefined;
  isLoading: boolean;
}

/**
 * Reads the wallet's on-chain token balances on Arbitrum. Works with just an
 * address (read-only via the configured http transport) — the wallet does not
 * need to be "connected" in wagmi. INFER/AGENT are 18-decimal; USDC/USDT are
 * 6-decimal (format accordingly at the call site).
 */
export function useTokenBalances(address: `0x${string}` | undefined): TokenBalances {
  const enabled = { query: { enabled: !!address } };
  const args = address ? ([address] as const) : undefined;

  const { data: inferBalance, isLoading: inferLoading } = useReadContract({
    address: CONTRACTS.INFER, abi: ERC20_ABI, functionName: 'balanceOf', args, ...enabled,
  });
  const { data: agentBalance, isLoading: agentLoading } = useReadContract({
    address: CONTRACTS.AGENT, abi: ERC20_ABI, functionName: 'balanceOf', args, ...enabled,
  });
  const { data: usdcBalance, isLoading: usdcLoading } = useReadContract({
    address: STABLECOINS.USDC, abi: ERC20_ABI, functionName: 'balanceOf', args, ...enabled,
  });
  const { data: usdtBalance, isLoading: usdtLoading } = useReadContract({
    address: STABLECOINS.USDT, abi: ERC20_ABI, functionName: 'balanceOf', args, ...enabled,
  });

  return {
    infer: inferBalance as bigint | undefined,
    agent: agentBalance as bigint | undefined,
    usdc: usdcBalance as bigint | undefined,
    usdt: usdtBalance as bigint | undefined,
    isLoading: inferLoading || agentLoading || usdcLoading || usdtLoading,
  };
}
