import { useEffect, useRef } from 'react';
import { usePrivy, useWallets, useCreateWallet } from '@privy-io/react-auth';

/**
 * WalletBridge — ensures an authenticated user always has an embedded wallet.
 *
 * Privy's `embeddedWallets.createOnLogin: 'all-users'` only fires on a FRESH
 * login, not on session restore — and only for new logins after the config was
 * fixed to the v3 shape. So users who authenticated earlier (or via social
 * login that didn't auto-create) end up authenticated with zero wallets, and
 * every "connected" signal (user.wallet, useWallets, wagmi useAccount) is empty.
 *
 * This component explicitly calls createWallet() whenever the user is
 * authenticated but has no embedded wallet — the same on-demand pattern Casino
 * uses. Renders nothing.
 */
export default function WalletBridge() {
  const { ready, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const creating = useRef(false);

  useEffect(() => {
    if (!ready || !authenticated) return;
    const hasEmbedded =
      !!user?.wallet?.address ||
      (wallets ?? []).some((w) => w.walletClientType === 'privy');
    if (hasEmbedded || creating.current) return;
    creating.current = true;
    createWallet().catch(() => {
      // Most likely "user already has an embedded wallet" (created by
      // createOnLogin on a fresh login) — harmless. Allow a retry otherwise.
      creating.current = false;
    });
  }, [ready, authenticated, wallets, user, createWallet]);

  return null;
}
