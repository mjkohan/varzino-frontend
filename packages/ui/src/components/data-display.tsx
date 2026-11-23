import { formatSignedPercent } from "@varzino/utils";
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../lib/cn";
import { Delta } from "./misc";

/* ---------------- Page header ---------------- */

export function PageHeader({
  title,
  description,
  actions,
  meta,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0">
        {meta ? <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-fg-muted">{meta}</div> : null}
        <h1 className="text-2xl font-medium text-fg">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-base text-fg-secondary">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/* ---------------- Stat ---------------- */

export function Stat({
  label,
  value,
  change,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  change?: { value: number; against: string; invert?: boolean };
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-h-28 flex-col justify-between gap-3 rounded-card border border-hairline bg-surface p-5 shadow-sm", className)}>
      <p className="text-sm text-fg-secondary">{label}</p>
      <div>
        <p className="tabular text-2xl font-medium leading-none text-fg">{value}</p>
        {change ? (
          <Delta className="mt-2 block" value={change.value} against={change.against} invert={change.invert} format={formatSignedPercent} />
        ) : hint ? (
          <p className="mt-2 text-sm text-fg-muted">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- Table primitives ---------------- */

export function Table({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("scrollbar-thin w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-start text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-hairline bg-raised/60">{children}</tr>
    </thead>
  );
}

export function TH({ children, className, numeric }: { children?: ReactNode; className?: string; numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        "h-10 whitespace-nowrap px-4 text-start text-xs font-medium text-fg-muted first:ps-5 last:pe-5",
        numeric && "text-end",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TR({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-hairline transition-colors duration-150 last:border-b-0 hover:bg-raised/50",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TD({ children, className, numeric }: { children?: ReactNode; className?: string; numeric?: boolean }) {
  return (
    <td className={cn("h-13 whitespace-nowrap px-4 text-fg first:ps-5 last:pe-5", numeric && "tabular text-end", className)}>
      {children}
    </td>
  );
}

/* ---------------- Empty state ---------------- */

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-14 text-center", className)}>
      {icon ? (
        <div className="flex size-11 items-center justify-center rounded-full bg-raised text-fg-muted [&_svg]:size-5">{icon}</div>
      ) : null}
      <div>
        <p className="font-medium text-fg">{title}</p>
        {description ? <p className="mt-1 max-w-sm text-sm text-fg-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Stepper (fills from the right in RTL) ---------------- */

export type Step = { label: string; meta?: string };

export function Stepper({ steps, current, failed, className }: { steps: Step[]; current: number; failed?: boolean; className?: string }) {
  return (
    <ol className={cn("flex w-full items-start", className)}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const isFailed = failed && active;
        return (
          <li key={step.label} className="relative flex flex-1 flex-col items-center gap-2 text-center">
            {i > 0 ? (
              <span
                aria-hidden
                className={cn("absolute end-1/2 top-3.5 h-px w-full", done || active ? "bg-accent" : "bg-hairline-strong")}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 flex size-7 items-center justify-center rounded-full border text-xs font-medium",
                done && "border-accent bg-accent text-on-accent",
                active && !isFailed && "border-accent bg-surface text-accent-ink ring-4 ring-accent-soft",
                isFailed && "border-negative bg-negative-soft text-negative",
                !done && !active && "border-hairline-strong bg-surface text-fg-muted",
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={2.25} /> : <span className="tabular">{(i + 1).toLocaleString("fa-IR")}</span>}
            </span>
            <span className={cn("px-1 text-xs leading-5", active ? "font-medium text-fg" : "text-fg-muted")}>{step.label}</span>
            {step.meta ? <span className="text-[11px] leading-4 text-fg-muted">{step.meta}</span> : null}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------- Timeline ---------------- */

export function Timeline({
  items,
  className,
}: {
  items: { id: string; title: ReactNode; meta: ReactNode; detail?: ReactNode; icon?: ReactNode; highlight?: boolean }[];
  className?: string;
}) {
  return (
    <ol className={cn("relative", className)}>
      {items.map((item, i) => (
        <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < items.length - 1 ? <span aria-hidden className="absolute start-[15px] top-8 bottom-0 w-px bg-hairline-strong" /> : null}
          <span
            className={cn(
              "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border [&_svg]:size-4",
              item.highlight ? "border-accent/30 bg-accent-soft text-accent-ink" : "border-hairline bg-surface text-fg-muted",
            )}
          >
            {item.icon}
          </span>
          <div className="min-w-0 pt-1">
            <p className="text-sm font-medium text-fg">{item.title}</p>
            {item.detail ? <p className="text-sm text-fg-secondary">{item.detail}</p> : null}
            <p className="mt-0.5 text-xs text-fg-muted">{item.meta}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------------- Definition list ---------------- */

export function DescriptionList({ items, className }: { items: { term: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2", className)}>
      {items.map((it) => (
        <div key={it.term} className="min-w-0">
          <dt className="text-xs text-fg-muted">{it.term}</dt>
          <dd className="mt-0.5 truncate text-sm text-fg">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------------- Ranked bar list (share / comparison without a chart library) ---------------- */

export function BarList({
  items,
  format,
  highlightFirst = false,
  className,
}: {
  items: { label: ReactNode; value: number; key: string; meta?: ReactNode }[];
  format: (n: number) => string;
  highlightFirst?: boolean;
  className?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => (
        <li key={item.key} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-fg">{item.label}</span>
            <span className="tabular shrink-0 text-fg-secondary">
              {format(item.value)}
              {item.meta ? <span className="ms-2 text-fg-muted">{item.meta}</span> : null}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-sunken">
            <div
              className={cn("h-full rounded-full", highlightFirst && i === 0 && "bg-accent")}
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: highlightFirst && i === 0 ? undefined : "var(--chart-muted-strong)" }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
