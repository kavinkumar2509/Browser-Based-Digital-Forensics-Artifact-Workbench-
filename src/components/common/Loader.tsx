import React from 'react';

/** Props for the Loader component. */
interface LoaderProps {
  /** Optional status label (e.g. "Decrypting payload..."). */
  text?: string;
  /** Size of the spinner ring in pixels. Defaults to 64. */
  size?: number;
}

/**
 * Inline `<style>` block that defines the custom keyframes used by the loader.
 * Scoped via unique animation names to avoid collisions.
 */
const LOADER_KEYFRAMES = `
@keyframes pwn-spin {
  to { transform: rotate(360deg); }
}
@keyframes pwn-pulse-core {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.4; transform: scale(0.6); }
}
@keyframes pwn-orbit {
  0%   { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); opacity: 0.8; }
  50%  { opacity: 0.2; }
  100% { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); opacity: 0.8; }
}
@keyframes pwn-scan {
  0%, 100% { opacity: 0; transform: translateY(-100%); }
  10%      { opacity: 0.5; }
  90%      { opacity: 0.5; }
  100%     { opacity: 0; transform: translateY(100%); }
}
@keyframes pwn-flicker {
  0%, 100% { opacity: 0.7; }
  50%      { opacity: 1; }
}
`;

/**
 * PWNDORA decryption / data-ingestion loader.
 *
 * A military-grade visual indicator featuring:
 * - A spinning conic-gradient ring (emerald → cyan)
 * - A pulsing core dot
 * - Orbiting satellite particles
 * - A vertical scan-line sweep
 * - An optional flickering status label
 *
 * @example
 * ```tsx
 * <Loader text="Decrypting payload..." />
 * <Loader size={48} />
 * ```
 */
const Loader: React.FC<LoaderProps> = ({ text, size = 64 }) => {
  const ringThickness = Math.max(2, Math.round(size * 0.06));
  const coreSize = Math.round(size * 0.18);
  const orbitRadius = Math.round(size * 0.44);
  const particleSize = Math.max(3, Math.round(size * 0.07));

  return (
    <>
      {/* Inject keyframes – only once in the DOM tree */}
      <style dangerouslySetInnerHTML={{ __html: LOADER_KEYFRAMES }} />

      <div
        role="status"
        aria-label={text ?? 'Loading'}
        className="flex flex-col items-center justify-center gap-4"
      >
        {/* ── Spinner assembly ── */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          {/* Outer glow halo */}
          <div
            className="absolute inset-0 rounded-full opacity-30 blur-md"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 40%, #34d399 70%, #22d3ee 100%)',
            }}
          />

          {/* Primary spinning ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'conic-gradient(from 180deg, transparent 30%, #34d399 60%, #22d3ee 90%, transparent 100%)',
              mask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), #000 calc(100% - ${ringThickness}px))`,
              WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${ringThickness}px), #000 calc(100% - ${ringThickness}px))`,
              animation: 'pwn-spin 1.4s linear infinite',
            }}
          />

          {/* Secondary counter-rotating ring (dimmer, offset phase) */}
          <div
            className="absolute rounded-full opacity-25"
            style={{
              inset: `${ringThickness + 3}px`,
              background:
                'conic-gradient(from 90deg, transparent 50%, #22d3ee 75%, #34d399 100%, transparent 100%)',
              mask: `radial-gradient(farthest-side, transparent calc(100% - ${Math.max(1, ringThickness - 1)}px), #000 calc(100% - ${Math.max(1, ringThickness - 1)}px))`,
              WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${Math.max(1, ringThickness - 1)}px), #000 calc(100% - ${Math.max(1, ringThickness - 1)}px))`,
              animation: 'pwn-spin 2.2s linear infinite reverse',
            }}
          />

          {/* Pulsing core dot */}
          <div
            className="absolute rounded-full bg-cyan-400"
            style={{
              width: coreSize,
              height: coreSize,
              boxShadow: '0 0 12px rgba(34,211,238,0.6), 0 0 24px rgba(34,211,238,0.25)',
              animation: 'pwn-pulse-core 1.8s ease-in-out infinite',
            }}
          />

          {/* Orbiting particles */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: particleSize,
                height: particleSize,
                marginLeft: -particleSize / 2,
                marginTop: -particleSize / 2,
                ['--orbit-r' as string]: `${orbitRadius}px`,
                animation: `pwn-orbit ${2.4 + i * 0.6}s linear infinite`,
                animationDelay: `${i * -0.8}s`,
              }}
            >
              <div
                className="h-full w-full rounded-full bg-emerald-400"
                style={{
                  boxShadow: '0 0 6px rgba(52,211,153,0.7)',
                }}
              />
            </div>
          ))}

          {/* Vertical scan line */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            style={{ animation: 'pwn-scan 3s ease-in-out infinite' }}
          >
            <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent" />
          </div>
        </div>

        {/* ── Status text ── */}
        {text && (
          <span
            className="max-w-[200px] truncate text-center font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-400/80"
            style={{ animation: 'pwn-flicker 2s ease-in-out infinite' }}
          >
            {text}
          </span>
        )}

        {/* Screenreader-only live region */}
        <span className="sr-only">{text ?? 'Loading'}</span>
      </div>
    </>
  );
};

Loader.displayName = 'Loader';

export { Loader };
export type { LoaderProps };
