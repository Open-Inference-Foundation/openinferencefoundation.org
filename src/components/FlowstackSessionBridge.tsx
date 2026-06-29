import { useEffect, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useFlowstack } from '@flowstack/sdk';

/**
 * FlowstackSessionBridge — mints a Flowstack session for OIF's own logged-in user.
 *
 * OIF authenticates with Privy directly (not via the broker), so it has no
 * Flowstack JWT by default. Authenticated backend calls (MCP API keys, builder
 * payouts) need one — apiKey + tenantId + user_id. After Privy auth we exchange
 * the Privy access token for a Flowstack session via POST /auth/privy-verify and
 * store it in FlowstackProvider, the same exchange AuthBrokerPage does for built
 * apps. Cleared when Privy logs out. Renders nothing.
 */
export default function FlowstackSessionBridge() {
  const { ready, authenticated, getAccessToken } = usePrivy();
  const { credentials, setCredentials, config } = useFlowstack();
  const minting = useRef(false);

  useEffect(() => {
    if (!ready) return;

    // Privy logged out → drop any stale Flowstack session and re-arm.
    if (!authenticated) {
      minting.current = false;
      if (credentials) setCredentials(null);
      return;
    }

    // Already have a session, or a mint is in flight → nothing to do.
    if (credentials?.apiKey || minting.current) return;

    minting.current = true;
    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error('No Privy access token');
        const baseUrl = config.baseUrl || 'https://sage-api.flowstack.fun';
        const res = await fetch(`${baseUrl}/auth/privy-verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ privy_token: token }),
        });
        if (!res.ok) throw new Error(`privy-verify ${res.status}`);
        const d = await res.json();
        setCredentials({
          apiKey: d.session_token,
          tenantId: d.tenant_id || config.tenantId || '',
          userId: d.user_id,
          email: d.email,
          expiresAt: d.expires_at,
        });
      } catch {
        // Leave unauthenticated; allow a retry on the next state change.
        minting.current = false;
      }
    })();
  }, [ready, authenticated, credentials, setCredentials, config, getAccessToken]);

  return null;
}
