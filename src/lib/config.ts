import type { FlowstackConfig } from '@flowstack/sdk';

export function getFlowstackConfig(): FlowstackConfig {
  return {
    mode: (import.meta.env.VITE_FLOWSTACK_MODE as 'mock' | 'production') ?? 'production',
    jwtSecret: import.meta.env.VITE_FLOWSTACK_JWT_SECRET ?? 'dev-secret',
    passwordSecret: import.meta.env.VITE_FLOWSTACK_PASSWORD_SECRET ?? 'dev-password-secret',
    tenantId: import.meta.env.VITE_FLOWSTACK_TENANT_ID ?? 'casino-dev',
    baseUrl: import.meta.env.VITE_FLOWSTACK_BASE_URL ?? 'https://sage-api.flowstack.fun',
  };
}
