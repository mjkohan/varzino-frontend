import { cn } from "@varzino/ui/lib/cn";
import { formatNumber } from "@varzino/utils";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { ReactNode } from "react";

export function SearchInput({ value, onChange, placeholder = "جست‌وجو", className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={cn("relative w-full sm:w-64", className)}>
      <Search aria-hidden className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fg-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-control border border-hairline-strong bg-surface ps-9 pe-3 text-sm text-fg shadow-sm placeholder:text-fg-muted focus-visible:border-accent focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/15"
      />
    </div>
  );
}

export type FilterOption = { value: string; label: string; count?: number };

/** Segmented filter, scrolls horizontally on small screens. */
export function FilterTabs({ value, onChange, options, label }: { value: string; onChange: (v: string) => void; options: FilterOption[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="scrollbar-thin -mx-1 flex max-w-full items-center gap-1 overflow-x-auto px-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-control px-3 text-sm transition-colors duration-150",
              active ? "bg-fg text-surface" : "text-fg-secondary hover:bg-raised hover:text-fg",
            )}
          >
            {o.label}
            {o.count !== undefined ? <span className={cn("tabular text-xs", active ? "text-surface/70" : "text-fg-muted")}>{formatNumber(o.count)}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

export function Pagination({ page, pageCount, total, onPage }: { page: number; pageCount: number; total: number; onPage: (p: number) => void }) {
  if (pageCount <= 1) return <p className="px-5 py-3 text-sm text-fg-muted">{formatNumber(total)} مورد</p>;
  return (
    <div className="flex items-center justify-between gap-4 border-t border-hairline px-5 py-3 text-sm">
      <p className="text-fg-muted">
        صفحه <span className="tabular text-fg">{formatNumber(page + 1)}</span> از <span className="tabular">{formatNumber(pageCount)}</span>، {formatNumber(total)} مورد
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="صفحه قبل"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-control border border-hairline-strong bg-surface text-fg-secondary transition-colors hover:bg-raised disabled:cursor-default disabled:opacity-40"
        >
          <ChevronRight className="size-4" />
        </button>
        <button
          type="button"
          aria-label="صفحه بعد"
          disabled={page >= pageCount - 1}
          onClick={() => onPage(page + 1)}
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-control border border-hairline-strong bg-surface text-fg-secondary transition-colors hover:bg-raised disabled:cursor-default disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-3 border-b border-hairline px-5 py-3 md:flex-row md:items-center md:justify-between">{children}</div>;
}
