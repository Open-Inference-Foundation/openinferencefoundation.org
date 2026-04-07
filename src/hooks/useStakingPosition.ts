import { useReadContract } from 'wagmi';
import { CONTRACTS, STAKING_ABI } from '@/lib/contracts';

interface StakingPosition {
  amount: bigint | undefined;
  stakedAt: bigint | undefined;
  lockEnd: bigint | undefined;
  tier: number | undefined;
  isLoading: boolean;
}

export function useStakingPosition(address: `0x${string}` | undefined): StakingPosition {
  const { data, isLoading } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'getPosition',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  if (!data) {
    return { amount: undefined, stakedAt: undefined, lockEnd: undefined, tier: undefined, isLoading };
  }

  const [amount, stakedAt, lockEnd, tier] = data as [bigint, bigint, bigint, number];
  return { amount, stakedAt, lockEnd, tier, isLoading };
}
