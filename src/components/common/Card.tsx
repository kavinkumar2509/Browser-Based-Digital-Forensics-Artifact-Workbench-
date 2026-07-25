import React from 'react';

/** Accent colour presets for the Card's glowing top border. */
type CardAccent = 'cyan' | 'emerald' | 'amber' | 'red';

/** Props for the Card component. */
interface CardProps {
  /** Card body content. */
  children: React.ReactNode;
  /** Optional heading rendered at the top of the card. */
  title?: string;
  /**
   * When provided, renders a luminous gradient border along the top edge.
   * Accepts a preset colour key or `true` (defaults to cyan).
   */
  accent?: CardAccent | boolean;
  /** Additional class names merged onto the outermost wrapper. */
  className?: string;
  /** Optional unique id for the card root element. */
  id?: string;
}

/** Maps accent keys → gradient + glow colours. */
const ACCENT_STYLES: Record<CardAccent, { gradient: string; glow: string }> = {
  cyan: {
    gradient: 'from-cyan-400 via-cyan-500 to-transparent',
    glow: 'shadow-[0_-4px_12px_rgba(34,211,238,0.15)]',
  },
  emerald: {
    gradient: 'from-emerald-400 via-emerald-500 to-transparent',
    glow: 'shadow-[0_-4px_12px_rgba(52,211,153,0.15)]',
  },
  amber: {
    gradient: 'from-amber-400 via-amber-500 to-transparent',
    glow: 'shadow-[0_-4px_12px_rgba(251,191,36,0.15)]',
  },
  red: {
    gradient: 'from-red-400 via-red-500 to-transparent',
    glow: 'shadow-[0_-4px_12px_rgba(248,113,113,0.15)]',
  },
};

/**
 * Resolves the accent prop into a concrete `CardAccent` key, or `null`.
 */
function resolveAccent(accent?: CardAccent | boolean): CardAccent | null {
  if (accent === true) return 'cyan';
  if (typeof accent === 'string') return accent;
  return null;
}

/**
 * PWNDORA data-widget container.
 *
 * Provides a consistent dark panel with an optional glowing top-border
 * accent and title bar, designed to frame forensic data widgets.
 *
 * @example
 * ```tsx
 * <Card title="THREAT INTEL" accent="emerald">
 *   <p>192.168.1.42 flagged in 3 feeds.</p>
 * </Card>
 *
 * <Card accent className="col-span-2">
 *   <CustomChart />
 * </Card>
 * ```
 */
const Card: React.FC<CardProps> = ({
  children,
  title,
  accent,
  className = '',
  id,
}) => {
  const resolvedAccent = resolveAccent(accent);
  const accentConfig = resolvedAccent ? ACCENT_STYLES[resolvedAccent] : null;

  return (
    <div
      id={id}
      className={[
        'relative overflow-hidden rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur-sm',
        'transition-colors duration-200',
        accentConfig ? accentConfig.glow : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Glowing top-border accent ── */}
      {accentConfig && (
        <div
          aria-hidden="true"
          className={[
            'absolute inset-x-0 top-0 h-[2px]',
            'bg-gradient-to-r',
            accentConfig.gradient,
          ].join(' ')}
        />
      )}

      {/* ── Title bar ── */}
      {title && (
        <div className="flex items-center gap-2 border-b border-slate-800/60 px-4 py-3">
          {/* Status dot */}
          <span
            aria-hidden="true"
            className={[
              'inline-block h-1.5 w-1.5 rounded-full',
              resolvedAccent === 'red' || resolvedAccent === 'amber'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-emerald-400',
            ].join(' ')}
          />
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {title}
          </h3>
        </div>
      )}

      {/* ── Body ── */}
      <div className="p-4">{children}</div>
    </div>
  );
};

Card.displayName = 'Card';

export { Card };
export type { CardProps, CardAccent };
