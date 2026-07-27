import type { ReactNode } from "react";
import type { RiskLevel } from "../../types";

interface BadgeProps {
  variant: RiskLevel;
  children?: ReactNode;
}

const badgeClasses: Record<RiskLevel, string> = {
  Normal: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Elevated: "bg-amber-100 text-amber-700 border-amber-200",
  High: "bg-red-100 text-red-700 border-red-200",
  Critical: "bg-rose-100 text-rose-700 border-rose-200",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em]",
        badgeClasses[variant],
      ].join(" ")}
    >
      {children ?? variant}
    </span>
  );
}
