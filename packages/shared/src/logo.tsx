import { cn } from "@varzino/ui/lib/cn";

/** Flat mark: a podium (2-1-3) cut from a court-green tile. Wordmark in the interface family. */
export function LogoMark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden className={className}>
      <rect width="28" height="28" rx="7" fill="var(--accent)" />
      <rect x="5.5" y="13" width="5" height="9" rx="1" fill="#fff" fillOpacity="0.72" />
      <rect x="11.5" y="7" width="5" height="15" rx="1" fill="#fff" />
      <rect x="17.5" y="16" width="5" height="6" rx="1" fill="#fff" fillOpacity="0.5" />
    </svg>
  );
}

export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("text-lg font-semibold leading-none", inverse ? "text-on-inverse" : "text-fg")}>ورزینو</span>
    </span>
  );
}
