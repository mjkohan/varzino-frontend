import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export type Tone = "neutral" | "positive" | "warning" | "negative" | "info" | "accent";

const toneClass: Record<Tone, string> = {
  neutral: "bg-raised text-fg-secondary",
  positive: "bg-positive-soft text-positive",
  warning: "bg-warning-soft text-warning",
  negative: "bg-negative-soft text-negative",
  info: "bg-info-soft text-info",
  accent: "bg-accent-soft text-accent-ink",
};

const dotClass: Record<Tone, string> = {
  neutral: "bg-fg-muted",
  positive: "bg-positive",
  warning: "bg-warning",
  negative: "bg-negative",
  info: "bg-info",
  accent: "bg-accent",
};

/** Status label: a small dot plus text, tinted by meaning. */
export function StatusBadge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md px-2 text-xs font-medium",
        toneClass[tone],
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", dotClass[tone])} />
      {children}
    </span>
  );
}

/** Plain dot used beside text in lists. */
export function Dot({ tone = "neutral", className }: { tone?: Tone; className?: string }) {
  return <span aria-hidden className={cn("inline-block size-2 shrink-0 rounded-full", dotClass[tone], className)} />;
}
