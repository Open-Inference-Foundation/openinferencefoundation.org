/**
 * AuthBrokerPage — OIF-as-IdP login broker for built apps.
 *
 * Flow:
 *   1. Built app at <site-id>.casino.flowstack.fun opens this page in a popup:
 *        /auth/broker?return=<built-app-origin>&state=<csrf-nonce>
 *   2. If the user is already authenticated (credentials.apiKey exists),
 *      we postMessage the credentials back to window.opener and close.
 *   3. Otherwise, we show a "Sign in with Flowstack" button that triggers
 *      usePrivy().login(). Once Privy auth completes we exchange the Privy
 *      access token for a Flowstack JWT via POST /auth/privy-verify, store it
 *      locally, and post the credentials back to the opener.
 *
 * Why this exists: Privy's Allowed Origins list has no wildcard support. Built
 * apps live at <site-id>.casino.flowstack.fun and can't each register a Privy
 * origin. Instead, openinferencefoundation.org is a single registered origin,
 * runs Privy, and brokers credentials back to any built app via postMessage.
 * One registration, unified identity, no per-built-app dashboard edits.
 *
 * Security:
 *   - Return origin is allowlist-validated (must be *.casino.flowstack.fun or
 *     http://localhost:*). postMessage uses the exact validated origin, never '*'.
 *   - The `state` param is a CSRF nonce; the opener checks it on response.
 *   - window.opener is required — if missing, we error out with a helpful message.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useFlowstack } from '@flowstack/sdk';

// Allowlist regex: only accept return origins matching these patterns.
// - *.casino.flowstack.fun (built apps on wildcard subdomains)
// - http://localhost:<port> (local dev)
// - https://keoncummings.com (Keon's personal site, uses SDK directly)
// - https://openinferencefoundation.org (OIF co-op site, uses SDK directly)
// - https://flowstack.fun (Flowstack marketing site, consumes the broker for
//   its /api-keys MCP flow)
// NOTE: keep this strict. Any relaxation here is a cross-origin auth risk.
const ALLOWED_RETURN_ORIGIN =
  /^https:\/\/[a-z0-9-]+\.casino\.flowstack\.fun$|^http:\/\/localhost:\d+$|^https:\/\/keoncummings\.com$|^https:\/\/openinferencefoundation\.org$|^https:\/\/flowstack\.fun$/;

// Redirect-mode allowlist for mobile native apps that can't receive postMessage
// (expo-web-browser.openAuthSessionAsync can only observe deep-link redirects).
// Each entry is an exact deep-link URL — NOT a scheme prefix — so a malicious
// app can't register e.g. `com.keoncummings.app://bank` and harvest creds.
const ALLOWED_REDIRECT_URL =
  /^(com\.keoncummings\.app|com\.lonelinesslab\.app):\/\/auth$/;

type BrokerStatus =
  | 'checking'       // initial — deciding whether to post back or prompt login
  | 'awaiting-login' // user needs to click the Privy button
  | 'logging-in'     // Privy modal is open / user is authenticating
  | 'minting'        // POSTing Privy token to /auth/privy-verify
  | 'posting'        // have credentials, about to postMessage back
  | 'error';

interface BrokerMessage {
  type: 'flowstack-auth-success';
  credentials: {
    apiKey: string;
    tenantId: string;
    userId?: string;
    email?: string;
    expiresAt?: string;
  };
  state: string;
}

// P0-127: persist broker params across Privy OAuth redirects. Privy's OAuth
// login (Google/Apple/Twitter/etc.) redirects the popup to the site root,
// losing ?return/?state/?app_scope on the URL. We save them to sessionStorage
// before Privy redirects, so when the popup lands back on /auth/broker OR /,
// we can restore the original context.
const BROKER_SESSION_KEY = 'flowstack-broker-params';

function saveBrokerParams(ret: string, st: string, appScope: string, mode: string) {
  try {
    sessionStorage.setItem(
      BROKER_SESSION_KEY,
      JSON.stringify({ ret, st, appScope, mode, ts: Date.now() }),
    );
  } catch { /* sessionStorage might be blocked */ }
}

function loadBrokerParams(): { ret: string; st: string; appScope: string; mode?: string } | null {
  try {
    const raw = sessionStorage.getItem(BROKER_SESSION_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    // Stale after 10 minutes — don't restore ancient sessions.
    if (Date.now() - d.ts > 10 * 60 * 1000) {
      sessionStorage.removeItem(BROKER_SESSION_KEY);
      return null;
    }
    return { ret: d.ret, st: d.st, appScope: d.appScope, mode: d.mode };
  } catch { return null; }
}

export default function AuthBrokerPage() {
  const [params] = useSearchParams();
  const urlReturn = params.get('return') || '';
  const urlState = params.get('state') || '';
  const urlAppScope = params.get('app_scope') || '';
  const urlMode = (params.get('mode') as 'redirect' | 'postMessage' | null) || null;
  // force_login=1 tells the broker to ignore cached credentials + the
  // sticky Privy session, and always re-prompt. Used by "Switch account"
  // flows in consumer sites so the user can pick a different identity instead
  // of getting silently re-authenticated into the same account they just
  // signed out of.
  const forceLogin = params.get('force_login') === '1';

  // If URL has params, use and persist them. Otherwise try restoring from
  // sessionStorage (covers the post-Privy-OAuth case where the popup returned
  // to /auth/broker without query params, or even to /).
  let returnOrigin = urlReturn, state = urlState, appScope = urlAppScope;
  let mode: 'redirect' | 'postMessage' = urlMode === 'redirect' ? 'redirect' : 'postMessage';
  if (urlReturn) {
    saveBrokerParams(urlReturn, urlState, urlAppScope, mode);
  } else {
    const restored = loadBrokerParams();
    if (restored) {
      returnOrigin = restored.ret;
      state = restored.st;
      appScope = restored.appScope;
      if (restored.mode === 'redirect' || restored.mode === 'postMessage') {
        mode = restored.mode;
      }
    }
  }

  const { credentials, setCredentials, config, logout: flowstackLogout } = useFlowstack();
  const { login: privyLogin, logout: privyLogout, authenticated: privyAuthenticated, ready: privyReady, user: privyUser, getAccessToken } =
    usePrivy();

  const [status, setStatus] = useState<BrokerStatus>('checking');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const verifying = useRef(false);
  const posted = useRef(false);
  // Guard: only run the force-login purge once per mount, even if the effect
  // re-fires due to state changes.
  const forcePurged = useRef(false);

  const originValid =
    mode === 'redirect'
      ? ALLOWED_REDIRECT_URL.test(returnOrigin)
      : ALLOWED_RETURN_ORIGIN.test(returnOrigin);

  // -----------------------------------------------------------------------
  // Post credentials back to the built-app opener and close this popup.
  // -----------------------------------------------------------------------
  const postCredentialsBack = useCallback(
    (creds: { apiKey: string; tenantId: string; userId?: string; email?: string; expiresAt?: string }) => {
      if (posted.current) return;

      // Redirect mode: return creds as query params on an allowlisted deep-link
      // URL. Used by mobile apps (expo-web-browser.openAuthSessionAsync) which
      // can't receive postMessage.
      if (mode === 'redirect') {
        posted.current = true;
        const url = new URL(returnOrigin);
        url.searchParams.set('state', state);
        url.searchParams.set('apiKey', creds.apiKey);
        url.searchParams.set('tenantId', creds.tenantId);
        if (creds.userId) url.searchParams.set('userId', creds.userId);
        if (creds.email) url.searchParams.set('email', creds.email);
        if (creds.expiresAt) url.searchParams.set('expiresAt', creds.expiresAt);
        setStatus('posting');
        window.location.replace(url.toString());
        return;
      }

      // postMessage mode: return creds to opener window.
      if (!window.opener || window.opener.closed) {
        setErrorMsg(
          'This page must be opened from a built app. Please return to the app and try again.'
        );
        setStatus('error');
        return;
      }
      posted.current = true;
      const message: BrokerMessage = {
        type: 'flowstack-auth-success',
        credentials: {
          apiKey: creds.apiKey,
          tenantId: creds.tenantId,
          userId: creds.userId,
          email: creds.email,
          expiresAt: creds.expiresAt,
        },
        state,
      };
      window.opener.postMessage(message, returnOrigin); // exact origin, never '*'
      setStatus('posting');
      // Give the listener a moment to ACK before closing.
      setTimeout(() => {
        try {
          window.close();
        } catch {
          // ignore — popup may already be closed
        }
      }, 200);
    },
    [returnOrigin, state, mode]
  );

  // -----------------------------------------------------------------------
  // Mint a Flowstack JWT from a Privy access token, then post back.
  // -----------------------------------------------------------------------
  const mintAndPostBack = useCallback(async () => {
    if (verifying.current) return;
    verifying.current = true;
    setStatus('minting');
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error('Could not get Privy access token');

      const baseUrl = config.baseUrl || 'https://sage-api.flowstack.fun';
      const res = await fetch(`${baseUrl}/auth/privy-verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privy_token: accessToken,
          ...(appScope ? { app_scope: appScope } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Backend verification failed');
      }

      const data = await res.json();
      const newCreds = {
        apiKey: data.session_token,
        tenantId: data.tenant_id || config.tenantId || '',
        userId: data.user_id,
        email: data.email,
        expiresAt: data.expires_at,
      };

      // Store locally so subsequent broker opens skip the Privy flow.
      setCredentials(newCreds);

      postCredentialsBack(newCreds);
    } catch (e) {
      verifying.current = false;
      setErrorMsg(e instanceof Error ? e.message : 'Login failed');
      setStatus('error');
    }
  }, [getAccessToken, config, setCredentials, postCredentialsBack]);

  // -----------------------------------------------------------------------
  // Decide what to do on mount / when Privy state changes.
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!originValid) {
      setErrorMsg(
        mode === 'redirect'
          ? `Invalid return URL "${returnOrigin}". Redirect mode only accepts known mobile deep links.`
          : `Invalid return origin "${returnOrigin}". This broker only accepts *.casino.flowstack.fun, localhost, keoncummings.com, or openinferencefoundation.org.`
      );
      setStatus('error');
      return;
    }

    // 0. force_login=1 — user asked to switch accounts. Clear cached
    // credentials + the sticky Privy session so the next Privy call shows
    // the modal instead of silently re-auth'ing into the same account.
    if (forceLogin && !forcePurged.current) {
      forcePurged.current = true;
      if (credentials) {
        try { flowstackLogout?.(); } catch {}
      }
      (async () => {
        try { await privyLogout(); } catch {}
        // After Privy clears, the next render will see privyAuthenticated=false
        // and route us to step 4 (awaiting-login). Show the button now so the
        // user knows we're ready for input.
        setStatus('awaiting-login');
      })();
      return;
    }

    // 1. Already have credentials — reuse ONLY if app_scope matches.
    // If the built app requests app_scope=XYZ but our cached JWT has a
    // different (or absent) app_scope, fall through to re-mint so the new
    // JWT carries the correct scope for collection/data access.
    if (credentials?.apiKey) {
      try {
        const parts = credentials.apiKey.split('.');
        const payload = JSON.parse(atob(parts[1]));
        const tokenAppScope: string | null = payload.app_scope ?? null;
        const scopeOk = !appScope || tokenAppScope === appScope;
        if (scopeOk) {
          postCredentialsBack(credentials);
          return;
        }
        // Cached creds have wrong/missing app_scope — fall through to re-mint.
        console.log(
          `[AuthBroker] cached token app_scope="${tokenAppScope}" ≠ requested "${appScope}" — re-minting`,
        );
      } catch {
        // Can't decode token — post back and let the app reject if needed.
        postCredentialsBack(credentials);
        return;
      }
    }

    // 2. Privy not ready yet → stay in 'checking' until it initializes.
    if (!privyReady) return;

    // 3. Privy authenticated but no Flowstack JWT yet → mint one.
    if (privyAuthenticated && privyUser && !verifying.current) {
      mintAndPostBack();
      return;
    }

    // 4. Not authenticated — show the login button.
    if (!privyAuthenticated) {
      setStatus('awaiting-login');
    }
  }, [
    originValid,
    returnOrigin,
    credentials,
    privyReady,
    privyAuthenticated,
    privyUser,
    mintAndPostBack,
    postCredentialsBack,
    forceLogin,
    flowstackLogout,
    privyLogout,
  ]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-8">
        <div className="max-w-md text-center">
          <h1 className="mb-3 text-xl font-semibold text-[var(--color-error)]">Authentication error</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (status === 'posting' || status === 'minting' || status === 'logging-in' || status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-8">
        <div className="flex items-center gap-3 text-[var(--color-text-secondary)]">
          <span className="inline-block h-5 w-5 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)] spin" />
          <span className="text-sm">Signing you in…</span>
        </div>
      </div>
    );
  }

  // awaiting-login
  let hostLabel = 'the app';
  try {
    hostLabel = new URL(returnOrigin).hostname;
  } catch {
    // keep fallback
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-bg)] p-8">
      <h1 className="text-2xl font-semibold text-[var(--color-text)]">
        Continue to {hostLabel}
      </h1>
      <p className="max-w-sm text-center text-sm text-[var(--color-text-secondary)]">
        Sign in with Flowstack to continue. Your identity, balances, and agents
        carry across every built app.
      </p>
      <button
        type="button"
        onClick={() => {
          setStatus('logging-in');
          privyLogin();
        }}
        disabled={!privyReady}
        className="mt-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {privyReady ? 'Sign in with Flowstack' : 'Loading…'}
      </button>
    </div>
  );
}
