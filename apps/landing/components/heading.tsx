import { cn } from "@varzino/ui/lib/cn";

export function SectionHeading({ title, lead, className, inverse }: { title: string; lead?: string; className?: string; inverse?: boolean }) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <h2 className={cn("text-[28px] font-semibold leading-[1.5] md:text-[32px]", inverse ? "text-on-inverse" : "text-fg")}>{title}</h2>
      {lead ? <p className={cn("mt-3 text-lg leading-[1.9]", inverse ? "text-on-inverse-muted" : "text-fg-secondary")}>{lead}</p> : null}
    </div>
  );
}
