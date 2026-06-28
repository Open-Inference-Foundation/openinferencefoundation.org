import { useReadContract } from 'wagmi';
import { CONTRACTS, STABLECOINS, ERC20_ABI, AGENT_PAYMENT_ABI } from '@/lib/contracts';

interface TokenBalances {
  infer: bigint | undefined;
  /** AGENT held as ERC-20 in the wallet */
  agent: bigint | undefined;
  /** AGENT credited inside the AgentPayment contract (from card purchases) */
  agentDeposited: bigint | undefined;
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
  // AGENT credited inside the AgentPayment contract (card purchases deposit here
  // rather than as ERC-20). Counted by the backend balance — count it here too.
  const { data: agentDep, isLoading: depLoading } = useReadContract({
    address: CONTRACTS.AGENT_PAYMENT, abi: AGENT_PAYMENT_ABI, functionName: 'getBalance', args, ...enabled,
  });

  return {
    infer: inferBalance as bigint | undefined,
    agent: agentBalance as bigint | undefined,
    agentDeposited: agentDep as bigint | undefined,
    usdc: usdcBalance as bigint | undefined,
    usdt: usdtBalance as bigint | undefined,
    isLoading: inferLoading || agentLoading || usdcLoading || usdtLoading || depLoading,
  };
}
