import { useCallback, useEffect, useState } from 'react';
import { useFlowstack } from '@flowstack/sdk';
import { SEO } from '@/components/SEO';
import WalletButton from '@/components/WalletButton';

/**
 * MCP API keys — create, list, revoke keys for the authenticated member.
 * Keys authenticate the MCP server (Claude Desktop / Cursor) and direct API
 * access. Requires a Flowstack session (minted by FlowstackSessionBridge).
 */

interface ApiKey {
  key_id: string;
  name: string;
  api_key?: string; // only present on creation
  created_at: string;
  last_used: string | null;
  is_active: boolean;
}

const DEFAULT_SCOPES = ['agent:query', 'agent:stream', 'dataset:read', 'dataset:write'];

function timeAgo(iso: string | null): string {
  if (!iso) return 'Never';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ApiKeys() {
  const { credentials, config } = useFlowstack() as any;
  const baseUrl: string = config?.baseUrl || 'https://sage-api.flowstack.fun';
  const tenantId: string = credentials?.tenantId ?? '';
  const token: string = credentials?.apiKey ?? '';
  const authed = !!token && !!tenantId;

  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<ApiKey | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  const fetchKeys = useCallback(async () => {
    if (!authed) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/tenants/${tenantId}/api-keys`, { headers: authHeaders });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const data = await res.json();
      setKeys(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e.message || 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  }, [authed, tenantId, token, baseUrl]);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  async function handleCreate() {
    if (!name.trim()) return;
    setCreating(true);
    setCreateError(null);
    setNewKey(null);
    try {
      const res = await fetch(`${baseUrl}/tenants/${tenantId}/api-keys`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ name: name.trim(), scopes: DEFAULT_SCOPES }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `${res.status} ${res.statusText}`);
      }
      setNewKey(await res.json());
      setName('');
      await fetchKeys();
    } catch (e: any) {
      setCreateError(e.message || 'Failed to create API key');
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(keyId: string) {
    setRevoking(keyId);
    try {
      await fetch(`${baseUrl}/tenants/${tenantId}/api-keys/${keyId}`, { method: 'DELETE', headers: authHeaders });
      await fetchKeys();
      if (newKey?.key_id === keyId) setNewKey(null);
    } finally {
      setRevoking(null);
    }
  }

  function copy(text: string, id: string) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  const mcpUrl = newKey?.api_key ? `${baseUrl}/mcp/sse?api_key=${newKey.api_key}` : null;

  const card = { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' };
  const codeBox = 'flex-1 text-xs font-mono rounded px-3 py-2 break-all border';
  const codeStyle = { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' };
  const copyBtn = 'flex-shrink-0 text-[11px] tracking-[0.1em] uppercase px-3 py-2 rounded-md border cursor-pointer';

  return (
    <>
      <SEO title="API Keys" description="Generate and manage MCP API keys for the Open Inference Foundation." siteName="Open Inference Foundation" canonicalUrl="/api-keys" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: 'var(--color-text)' }}>API Keys</h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          Keys authenticate the MCP server (Claude Desktop, Cursor) and direct API access. A key is shown once at creation — save it.
        </p>

        {!authed ? (
          <div className="p-6 rounded-xl border text-center" style={card}>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>Sign in to generate and manage your API keys.</p>
            <div className="max-w-xs mx-auto"><WalletButton /></div>
          </div>
        ) : (
          <>
            {/* New key — shown once */}
            {newKey?.api_key && (
              <div className="mb-6 p-4 rounded-md border" style={{ borderColor: 'var(--color-accent-2)', backgroundColor: 'var(--color-accent-2-light)' }}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    Key created: <span style={{ color: 'var(--color-accent-2)' }}>{newKey.name}</span>
                  </p>
                  <button onClick={() => setNewKey(null)} className="text-xs cursor-pointer" style={{ color: 'var(--color-text-tertiary)' }}>Dismiss</button>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--color-accent-2)' }}>Copy this now — it won't be shown again.</p>
                <div className="flex items-center gap-2 mb-3">
                  <code className={codeBox} style={codeStyle}>{newKey.api_key}</code>
                  <button onClick={() => copy(newKey.api_key!, 'key')} className={copyBtn} style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>{copied === 'key' ? 'Copied!' : 'Copy'}</button>
                </div>
                {mcpUrl && (
                  <div>
                    <p className="text-[10px] tracking-[0.12em] uppercase mb-1" style={{ color: 'var(--color-text-tertiary)' }}>MCP connection URL</p>
                    <div className="flex items-center gap-2">
                      <code className={codeBox} style={codeStyle}>{mcpUrl}</code>
                      <button onClick={() => copy(mcpUrl, 'mcp')} className={copyBtn} style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>{copied === 'mcp' ? 'Copied!' : 'Copy'}</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Create */}
            <section className="mb-6 p-4 rounded-md border" style={card}>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Create new key</h2>
              <div className="flex gap-2">
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                  placeholder="e.g. mcp-key, local-dev"
                  className="flex-1 px-3 py-2 text-sm rounded-md border outline-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
                />
                <button onClick={handleCreate} disabled={creating || !name.trim()}
                  className="flex-shrink-0 text-[11px] tracking-[0.12em] uppercase px-4 py-2 rounded-md text-white disabled:opacity-50 cursor-pointer"
                  style={{ backgroundColor: 'var(--color-accent)' }}>
                  {creating ? 'Creating…' : 'Create'}
                </button>
              </div>
              {createError && <p className="mt-2 text-xs" style={{ color: '#ef4444' }}>{createError}</p>}
              <p className="mt-2 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Grants: {DEFAULT_SCOPES.join(', ')}</p>
            </section>

            {/* List */}
            <section>
              <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Your keys</h2>
              {error && <p className="text-sm mb-3" style={{ color: '#ef4444' }}>{error}</p>}
              {loading ? (
                <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Loading…</p>
              ) : keys.length === 0 ? (
                <div className="p-6 rounded-md border border-dashed text-center" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>No API keys yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {keys.map((k) => (
                    <div key={k.key_id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-md border" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>{k.name}</span>
                          {!k.is_active && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: '#ef4444', border: '1px solid #ef444433' }}>Revoked</span>}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Created {timeAgo(k.created_at)} · Last used {timeAgo(k.last_used)}</div>
                        <div className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{k.key_id}</div>
                      </div>
                      {k.is_active && (
                        <button onClick={() => handleRevoke(k.key_id)} disabled={revoking === k.key_id}
                          className="flex-shrink-0 text-[11px] tracking-[0.1em] uppercase px-3 py-1.5 rounded-md disabled:opacity-50 cursor-pointer" style={{ color: '#ef4444' }}>
                          {revoking === k.key_id ? '…' : 'Revoke'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Setup guide */}
            <section className="mt-8 p-4 rounded-md border" style={card}>
              <h2 className="text-sm font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Connect Claude Desktop / Cursor</h2>
              <p className="text-xs mb-3" style={{ color: 'var(--color-text-secondary)' }}>Add this to your MCP settings, replacing <code className="font-mono">sage_xxx</code> with your key.</p>
              <pre className="text-xs font-mono rounded px-3 py-3 overflow-x-auto border" style={codeStyle}>{`{
  "mcpServers": {
    "casino": {
      "url": "${baseUrl}/mcp/sse?api_key=sage_xxx",
      "transport": "sse"
    }
  }
}`}</pre>
            </section>
          </>
        )}
      </div>
    </>
  );
}
