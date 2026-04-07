import { useReadContract } from 'wagmi';
import { CONTRACTS, STAKING_ABI } from '@/lib/contracts';

export function useTotalStaked(): bigint | undefined {
  const { data } = useReadContract({
    address: CONTRACTS.STAKING,
    abi: STAKING_ABI,
    functionName: 'totalStaked',
  });

  return data as bigint | undefined;
}
