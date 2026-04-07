const TIER_CONFIG: Record<number, { label: string; colorVar: string }> = {
  0: { label: 'Base', colorVar: '--color-tier-base' },
  1: { label: 'Member', colorVar: '--color-tier-member' },
  2: { label: 'Pro', colorVar: '--color-tier-pro' },
  3: { label: 'Founder', colorVar: '--color-tier-founder' },
};

interface TierBadgeProps {
  tier: number;
  size?: 'sm' | 'md';
}

export default function TierBadge({ tier, size = 'sm' }: TierBadgeProps) {
  const config = TIER_CONFIG[tier] ?? TIER_CONFIG[0];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
      style={{
        color: `var(${config.colorVar})`,
        backgroundColor: `color-mix(in srgb, var(${config.colorVar}) 12%, transparent)`,
        border: `1px solid color-mix(in srgb, var(${config.colorVar}) 30%, transparent)`,
      }}
    >
      {config.label}
    </span>
  );
}
