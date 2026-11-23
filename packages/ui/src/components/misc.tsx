import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      dir="ltr"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border border-hairline-strong bg-surface px-1 font-sans text-[11px] font-medium text-fg-muted",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("rounded-md bg-raised", className)} />;
}

/** Fills from the inline start (right in RTL). */
export function Progress({
  value,
  max = 100,
  tone = "accent",
  className,
  label,
}: {
  value: number;
  max?: number;
  tone?: "accent" | "muted" | "warning" | "negative";
  className?: string;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill = {
    accent: "bg-accent",
    muted: "bg-fg-muted/50",
    warning: "bg-warning",
    negative: "bg-negative",
  }[tone];
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-sunken", className)}
    >
      <div className={cn("h-full rounded-full", fill)} style={{ width: `${pct}%` }} />
    </div>
  );
}

// Muted, distinct backgrounds; picked by name so the same person keeps the same color.
const avatarPalettes = [
  "bg-[#e4efe9] text-[#285a47]",
  "bg-[#e8ecf4] text-[#34497a]",
  "bg-[#f3ece3] text-[#7a5228]",
  "bg-[#efe8ef] text-[#64406a]",
  "bg-[#e6eef0] text-[#2f5862]",
  "bg-[#f1e9e6] text-[#7a3f34]",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return `${first}${last ? `‌${last}` : ""}`;
}

export function Avatar({ name, size = 32, className }: { name: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.34)) }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium leading-none",
        avatarPalettes[hash(name) % avatarPalettes.length],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

/** Signed change with its reference: «+۱۲٪ نسبت به ماه قبل». Up is good unless `invert`. */
export function Delta({
  value,
  against,
  invert = false,
  className,
  format,
}: {
  value: number;
  against?: string;
  invert?: boolean;
  className?: string;
  format: (n: number) => string;
}) {
  const good = invert ? value < 0 : value > 0;
  const tone = value === 0 ? "text-fg-muted" : good ? "text-positive" : "text-negative";
  return (
    <span className={cn("text-sm", className)}>
      <bdi dir="ltr" className={cn("tabular font-medium", tone)}>
        {format(value)}
      </bdi>
      {against ? <span className="text-fg-muted"> نسبت به {against}</span> : null}
    </span>
  );
}
