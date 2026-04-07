import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, STABLECOINS, ERC20_ABI, AGENT_PURCHASE_ABI } from '@/lib/contracts';
import { parseUnits } from 'viem';

/** Preview how much AGENT a buyer would receive for a given USDC/USDT amount */
export function usePreviewPurchase(buyer: `0x${string}` | undefined, usdAmount: string) {
  // USDC has 6 decimals
  const stableAmount = usdAmount && parseFloat(usdAmount) > 0
    ? parseUnits(usdAmount, 6)
    : 0n;

  const { data, isLoading } = useReadContract({
    address: CONTRACTS.AGENT_PURCHASE,
    abi: AGENT_PURCHASE_ABI,
    functionName: 'previewPurchase',
    args: buyer && stableAmount > 0n ? [buyer, stableAmount] : undefined,
    query: { enabled: !!buyer && stableAmount > 0n },
  });

  if (!data) {
    return { agentAmount: undefined, discountBps: undefined, effectivePrice: undefined, isLoading };
  }

  const [agentAmount, discountBps, effectivePrice] = data as [bigint, bigint, bigint];
  return { agentAmount, discountBps, effectivePrice, isLoading };
}

/** Buy AGENT with USDC or USDT: approve stablecoin + call purchase */
export function useBuyAgent() {
  const { writeContractAsync: writeApprove, data: approveHash, isPending: isApproving } = useWriteContract();
  const { writeContractAsync: writePurchase, data: purchaseHash, isPending: isPurchasing } = useWriteContract();

  const { isLoading: isApproveConfirming } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: isPurchaseConfirming } = useWaitForTransactionReceipt({ hash: purchaseHash });

  async function approve(stablecoin: 'USDC' | 'USDT', amount: string) {
    const decimals = stablecoin === 'USDC' ? 6 : 6; // both 6 on Arbitrum
    const parsedAmount = parseUnits(amount, decimals);
    await writeApprove({
      address: STABLECOINS[stablecoin],
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACTS.AGENT_PURCHASE, parsedAmount],
    });
  }

  async function purchase(stablecoin: 'USDC' | 'USDT', amount: string) {
    const decimals = 6;
    const parsedAmount = parseUnits(amount, decimals);
    await writePurchase({
      address: CONTRACTS.AGENT_PURCHASE,
      abi: AGENT_PURCHASE_ABI,
      functionName: 'purchase',
      args: [STABLECOINS[stablecoin], parsedAmount],
    });
  }

  return {
    approve,
    purchase,
    isApproving: isApproving || isApproveConfirming,
    isPurchasing: isPurchasing || isPurchaseConfirming,
  };
}
