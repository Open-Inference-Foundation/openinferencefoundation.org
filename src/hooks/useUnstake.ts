import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, STAKING_ABI } from '@/lib/contracts';

export function useUnstake() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  async function unstake(amount: bigint) {
    const txHash = await writeContractAsync({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [amount],
    });
    return txHash;
  }

  async function unstakeAll() {
    const txHash = await writeContractAsync({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'unstakeAll',
    });
    return txHash;
  }

  return {
    unstake,
    unstakeAll,
    isUnstaking: isPending || isConfirming,
  };
}
