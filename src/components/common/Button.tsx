import React from 'react';

/** Available visual variants for the PWNDORA button system. */
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

/**
 * Props for the Button component.
 * Extends native HTML button attributes so all standard props
 * (onClick, disabled, type, aria-*, etc.) are forwarded transparently.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant. Defaults to 'primary'. */
  variant?: ButtonVariant;
}

/**
 * Variant-specific Tailwind class maps.
 *
 * Each variant defines three layers:
 *   base  – idle state colours, borders, and shadows
 *   hover – hover-state overrides
 *   focus – focus-visible ring colour
 */
const VARIANT_STYLES: Record<
  ButtonVariant,
  { base: string; hover: string; focus: string }
> = {
  primary: {
    base: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.2)]',
    hover:
      'hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_18px_rgba(34,211,238,0.35)] hover:text-cyan-200',
    focus: 'focus-visible:ring-cyan-400/50',
  },
  secondary: {
    base: 'border-slate-600 bg-slate-800/60 text-slate-300',
    hover:
      'hover:bg-slate-700/70 hover:border-slate-500 hover:text-slate-100',
    focus: 'focus-visible:ring-slate-400/50',
  },
  danger: {
    base: 'border-red-500/40 bg-red-500/10 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.15)]',
    hover:
      'hover:bg-red-500/20 hover:border-red-400/60 hover:shadow-[0_0_18px_rgba(239,68,68,0.3)] hover:text-red-300',
    focus: 'focus-visible:ring-red-400/50',
  },
  ghost: {
    base: 'border-transparent bg-transparent text-slate-400',
    hover: 'hover:bg-slate-800/50 hover:text-slate-200',
    focus: 'focus-visible:ring-slate-500/40',
  },
};

/**
 * PWNDORA design-system button.
 *
 * Renders a `<button>` with the selected `variant` styling, full keyboard
 * accessibility (focus-visible ring), and graceful disabled states.
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleScan}>
 *   INITIATE SCAN
 * </Button>
 *
 * <Button variant="danger" disabled>
 *   PURGE RECORDS
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', disabled, children, ...rest }, ref) => {
    const styles = VARIANT_STYLES[variant];

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={[
          // ── Shared base ──
          'inline-flex items-center justify-center gap-2',
          'rounded border px-4 py-2',
          'font-mono text-xs font-semibold uppercase tracking-widest',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-950',
          'cursor-pointer',
          // ── Variant layers ──
          styles.base,
          styles.hover,
          styles.focus,
          // ── Disabled override ──
          disabled
            ? 'pointer-events-none opacity-40 saturate-0'
            : '',
          // ── Consumer overrides ──
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps, ButtonVariant };
