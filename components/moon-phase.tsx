import { clsx } from "@/lib/clsx";
import { litPath } from "@/lib/moon";

interface MoonPhaseProps {
  /** Synodic fraction 0..1 (0/1 = new, 0.5 = full) */
  phase: number;
  /** Pixel diameter */
  size?: number;
  /** Soft moonlit glow ring behind the disk */
  glow?: boolean;
  className?: string;
}

/**
 * High-contrast silver-on-navy moon with a soft-gradient terminator.
 * Pure SVG, no client JS — safe in Server Components.
 */
export function MoonPhase({ phase, size = 96, glow = true, className }: MoonPhaseProps) {
  const id = `moon-${phase.toFixed(4).replace(".", "")}`;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label={`Mēness fāze ${Math.round(((1 - Math.cos(2 * Math.PI * phase)) / 2) * 100)}% apgaismojums`}
      className={clsx("shrink-0", className)}
    >
      <defs>
        <radialGradient id={`${id}-lit`} cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#f4f7ff" />
          <stop offset="60%" stopColor="#dde3eb" />
          <stop offset="100%" stopColor="#aeb4bb" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.9" />
        </filter>
        {glow && (
          <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="rgba(221,227,235,0.35)" />
            <stop offset="100%" stopColor="rgba(221,227,235,0)" />
          </radialGradient>
        )}
      </defs>

      {glow && <circle cx="50" cy="50" r="50" fill={`url(#${id}-glow)`} />}

      {/* Dark disk — the shadowed Moon body */}
      <circle cx="50" cy="50" r="42" fill="#0f1729" stroke="#2d3449" strokeWidth="0.75" />

      {/* Illuminated region, terminator softened to a gradient edge */}
      <g clipPath={`url(#${id}-clip)`}>
        <clipPath id={`${id}-clip`}>
          <circle cx="50" cy="50" r="42" />
        </clipPath>
        <path
          d={litPath(phase)}
          fill={`url(#${id}-lit)`}
          filter={`url(#${id}-soft)`}
          transform="translate(50 50) scale(0.84) translate(-50 -50)"
        />
      </g>
    </svg>
  );
}
