import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
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
        <Route path="*" element={<Layout />}>
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
