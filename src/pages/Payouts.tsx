import { useCallback, useEffect, useState } from 'react';
import { useFlowstack } from '@flowstack/sdk';
import { SEO } from '@/components/SEO';
import WalletButton from '@/components/WalletButton';

/**
 * Builder payouts — view accrued revenue and withdraw to a bank via Stripe
 * Connect Express. Requires a Flowstack session (FlowstackSessionBridge).
 */

interface Earnings { earned_cents: number; paid_cents: number; available_cents: number; min_payout_cents: number; }
interface ConnectStatus { connected: boolean; payouts_enabled: boolean; details_submitted: boolean; }

const usd = (cents: number) => `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Payouts() {
  const { credentials, config } = useFlowstack() as any;
  const baseUrl: string = config?.baseUrl || 'https://sage-api.flowstack.fun';
  const token: string = credentials?.apiKey ?? '';
  const authed = !!token && !!credentials?.tenantId;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [status, setStatus] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!authed) { setLoading(false); return; }
    setLoading(true); setError(null);
    try {
      const [e, s] = await Promise.all([
        fetch(`${baseUrl}/billing/builder/earnings`, { headers }).then((r) => r.ok ? r.json() : Promise.reject(new Error(`earnings ${r.status}`))),
        fetch(`${baseUrl}/billing/connect/status`, { headers }).then((r) => r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))),
      ]);
      setEarnings(e); setStatus(s);
    } catch (err: any) {
      setError(err.message || 'Failed to load payouts');
    } finally {
      setLoading(false);
    }
  }, [authed, baseUrl, token]);

  useEffect(() => {
    refresh();
    // returning from Stripe onboarding lands here — surface a note
    if (typeof window !== 'undefined' && window.location.search.includes('onboarded')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [refresh]);

  async function onboard() {
    setBusy('onboard'); setError(null);
    try {
      const origin = window.location.origin;
      const res = await fetch(`${baseUrl}/billing/connect/onboard`, {
        method: 'POST', headers,
        body: JSON.stringify({ return_url: `${origin}/payouts?onboarded=1`, refresh_url: `${origin}/payouts` }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || `onboard ${res.status}`);
      const d = await res.json();
      if (d.url) window.location.href = d.url;
    } catch (e: any) {
      setError(e.message || 'Could not start onboarding'); setBusy(null);
    }
  }

  async function withdraw() {
    setBusy('withdraw'); setError(null); setSuccess(null);
    try {
      const res = await fetch(`${baseUrl}/billing/builder/payout`, { method: 'POST', headers });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || `payout ${res.status}`);
      const d = await res.json();
      setSuccess(`Paid ${usd(d.paid_cents)} — it'll arrive in your bank per Stripe's payout schedule.`);
      await refresh();
    } catch (e: any) {
      setError(e.message || 'Payout failed');
    } finally {
      setBusy(null);
    }
  }

  const card = { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' };
  const primaryBtn = 'px-4 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-50 cursor-pointer';
  const available = earnings?.available_cents ?? 0;
  const min = earnings?.min_payout_cents ?? 1000;
  const canWithdraw = !!status?.payouts_enabled && available >= min;

  return (
    <>
      <SEO title="Payouts" description="Withdraw your builder earnings to your bank via Stripe." siteName="Open Inference Foundation" canonicalUrl="/payouts" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: 'var(--color-text)' }}>Payouts</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Withdraw the revenue your apps have earned. Paid to your bank via Stripe — no crypto involved.
        </p>

        {!authed ? (
          <div className="p-6 rounded-xl border text-center" style={card}>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Sign in to view your earnings and withdraw.</p>
            <div className="max-w-xs mx-auto"><WalletButton /></div>
          </div>
        ) : loading ? (
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading…</p>
        ) : (
          <>
            {success && <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: 'var(--color-accent-2-light)', color: 'var(--color-accent-2)', border: '1px solid var(--color-accent-2)' }}>{success}</div>}
            {error && <div className="mb-4 p-3 rounded-lg text-sm" style={{ color: '#ef4444', border: '1px solid #ef444433' }}>{error}</div>}

            {/* Balance */}
            <div className="p-5 rounded-xl border" style={card}>
              <p className="text-[10px] uppercase tracking-[0.2em] mb-1" style={{ color: 'var(--color-text-tertiary)' }}>Available to withdraw</p>
              <p className="text-3xl font-extrabold" style={{ color: 'var(--color-text)' }}>{usd(available)}</p>
              <div className="flex gap-6 mt-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                <span>Earned: {usd(earnings?.earned_cents ?? 0)}</span>
                <span>Paid out: {usd(earnings?.paid_cents ?? 0)}</span>
              </div>
            </div>

            {/* Action */}
            <div className="mt-6">
              {!status?.connected || !status?.details_submitted ? (
                <>
                  <button onClick={onboard} disabled={busy === 'onboard'} className={primaryBtn} style={{ backgroundColor: 'var(--color-accent)' }}>
                    {busy === 'onboard' ? 'Opening…' : 'Connect bank account'}
                  </button>
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>One-time setup with Stripe (handles identity verification).</p>
                </>
              ) : !status?.payouts_enabled ? (
                <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)' }}>
                  Your payout account is under review by Stripe. <button onClick={refresh} className="underline cursor-pointer">Refresh</button> · <button onClick={onboard} className="underline cursor-pointer">Finish setup</button>
                </div>
              ) : (
                <>
                  <button onClick={withdraw} disabled={!canWithdraw || busy === 'withdraw'} className={primaryBtn} style={{ backgroundColor: 'var(--color-accent-2)' }}>
                    {busy === 'withdraw' ? 'Processing…' : `Withdraw ${usd(available)}`}
                  </button>
                  {!canWithdraw && (
                    <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                      {available < min ? `Minimum payout is ${usd(min)}.` : 'Nothing available to withdraw yet.'}
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                    Bank account connected ✓ · payouts via Stripe.
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
