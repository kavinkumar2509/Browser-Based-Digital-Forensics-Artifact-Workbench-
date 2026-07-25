import type { FC } from "react";

export type RiskLevel = "low" | "moderate" | "high" | "critical";

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
}

const riskStyles: Record<RiskLevel, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  },
  moderate: {
    label: "Moderate",
    className: "border-yellow-400/30 bg-yellow-400/10 text-yellow-400",
  },
  high: {
    label: "High",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-400",
  },
  critical: {
    label: "Critical",
    className: "border-red-400/30 bg-red-400/10 text-red-400",
  },
};

const RiskBadge: FC<RiskBadgeProps> = ({ level, score }) => {
  const { label, className } = riskStyles[level];
  const normalizedScore = typeof score === "number" ? Math.round(score) : undefined;

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide ${className}`}
      aria-label={`${label} risk${normalizedScore === undefined ? "" : `: ${normalizedScore}`}`}
    >
      {label}
      {normalizedScore !== undefined && <span className="ml-1 opacity-80">{normalizedScore}</span>}
    </span>
  );
};

export default RiskBadge;
