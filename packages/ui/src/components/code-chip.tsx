import { toPersianDigits } from "@varzino/utils";
import { cn } from "../lib/cn";

/**
 * Signature element: identifiers (membership code, license no., letter no.) set like a bib number.
 * Always left-to-right inside RTL text, tabular Persian digits.
 */
export function CodeChip({ value, className, label }: { value: string | number; className?: string; label?: string }) {
  return (
    <bdi
      dir="ltr"
      aria-label={label}
      className={cn(
        "tabular inline-flex h-6 items-center rounded-[5px] border border-hairline-strong bg-surface px-1.5 text-xs font-medium text-fg-secondary",
        className,
      )}
    >
      {toPersianDigits(value)}
    </bdi>
  );
}
