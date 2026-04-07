import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, ERC20_ABI, STAKING_ABI } from '@/lib/contracts';

export function useStake() {
  const { writeContractAsync: writeApprove, data: approveHash, isPending: isApproving } = useWriteContract();
  const { writeContractAsync: writeStake, data: stakeHash, isPending: isStaking } = useWriteContract();

  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isStakeConfirming } = useWaitForTransactionReceipt({ hash: stakeHash });

  async function approve(amount: bigint) {
    const hash = await writeApprove({
      address: CONTRACTS.INFER,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.STAKING, amount],
    });
    return hash;
  }

  async function stake(amount: bigint, targetTier: number) {
    const hash = await writeStake({
      address: CONTRACTS.STAKING,
      abi: STAKING_ABI,
      functionName: 'stake',
      args: [amount, targetTier],
    });
    return hash;
  }

  return {
    approve,
    stake,
    isApproving: isApproving || isApproveConfirming,
    isStaking: isStaking || isStakeConfirming,
  };
}
