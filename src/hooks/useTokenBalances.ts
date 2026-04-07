import { useReadContract } from 'wagmi';
import { CONTRACTS, ERC20_ABI } from '@/lib/contracts';

interface TokenBalances {
  infer: bigint | undefined;
  agent: bigint | undefined;
  isLoading: boolean;
}

export function useTokenBalances(address: `0x${string}` | undefined): TokenBalances {
  const { data: inferBalance, isLoading: inferLoading } = useReadContract({
    address: CONTRACTS.INFER,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: agentBalance, isLoading: agentLoading } = useReadContract({
    address: CONTRACTS.AGENT,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  return {
    infer: inferBalance as bigint | undefined,
    agent: agentBalance as bigint | undefined,
    isLoading: inferLoading || agentLoading,
  };
}
