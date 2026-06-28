import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

import Home from '@/pages/Home';

const TokenEconomics = lazy(() => import('@/pages/TokenEconomics'));
const Staking = lazy(() => import('@/pages/Staking'));
const Agents = lazy(() => import('@/pages/Agents'));
const Governance = lazy(() => import('@/pages/Governance'));
const Docs = lazy(() => import('@/pages/Docs'));
const Buy = lazy(() => import('@/pages/Buy'));
const Thesis = lazy(() => import('@/pages/Thesis'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const AuthBrokerPage = lazy(() => import('@/pages/AuthBrokerPage'));

/**
 * P0-127: Rescue-from-OAuth-redirect for the built-app login broker.
 *
 * When a user logs in via Privy OAuth (Google/Apple/Twitter) from a built
 * app's popup, Privy's OAuth callback redirects the popup to this site's root
 * instead of back to /auth/broker?return=... — the query params are lost and
 * the user lands on the landing page inside the popup.
 *
 * AuthBrokerPage persists the original params to sessionStorage. This hook
 * checks on every route change: if we're in a popup AND sessionStorage has
 * fresh broker params AND we're not already on /auth/broker, navigate back
 * there so the broker can complete the Privy → JWT → postMessage flow.
 */
function BrokerRescue() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === '/auth/broker') return;
    if (typeof window === 'undefined') return;
    if (!window.opener || window.opener.closed) return;
    try {
      const raw = sessionStorage.getItem('flowstack-broker-params');
      if (!raw) return;
      const d = JSON.parse(raw);
      if (!d?.ret || !d?.st) return;
      if (Date.now() - d.ts > 10 * 60 * 1000) {
        sessionStorage.removeItem('flowstack-broker-params');
        return;
      }
      navigate('/auth/broker', { replace: true });
    } catch { /* noop */ }
  }, [location.pathname, navigate]);
  return null;
}

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
      <span className="w-6 h-6 rounded-full border-2 spin" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-accent)' }} />
    </div>
  );
}

export default function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BrokerRescue />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tokenomics" element={<TokenEconomics />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/buy" element={<Buy />} />
          <Route path="/thesis" element={<Thesis />} />
          <Route path="/privacy" element={<Privacy />} />
        </Route>

        {/* OIF-as-IdP login broker for built apps. Built apps open this in a
            popup to delegate Privy login here. Standalone full-screen page —
            intentionally outside <Layout> (no nav/footer). */}
        <Route path="/auth/broker" element={<AuthBrokerPage />} />

        <Route path="*" element={<Layout />}>
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
