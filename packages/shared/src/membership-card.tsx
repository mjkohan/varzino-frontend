import { Avatar } from "@varzino/ui/components/misc";
import { cn } from "@varzino/ui/lib/cn";
import { formatDate, toPersianDigits } from "@varzino/utils";
import { LogoMark } from "./logo";

/** Deterministic QR-like pattern (decorative, not a real code). */
function Pattern({ seed, size = 56 }: { seed: string; size?: number }) {
  const n = 11;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 33 + seed.charCodeAt(i)) >>> 0;
  const cells: { x: number; y: number }[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const finder = (x < 3 && y < 3) || (x > n - 4 && y < 3) || (x < 3 && y > n - 4);
      if (finder) continue;
      h = (h * 1103515245 + 12345) >>> 0;
      if ((h >>> 16) % 2 === 0) cells.push({ x, y });
    }
  }
  const c = size / n;
  const finder = (fx: number, fy: number) => (
    <g key={`${fx}-${fy}`}>
      <rect x={fx * c} y={fy * c} width={c * 3} height={c * 3} rx={c * 0.6} fill="none" stroke="currentColor" strokeWidth={c * 0.8} />
      <rect x={fx * c + c} y={fy * c + c} width={c} height={c} fill="currentColor" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="text-fg">
      {cells.map((cell) => (
        <rect key={`${cell.x}-${cell.y}`} x={cell.x * c} y={cell.y * c} width={c} height={c} rx={c * 0.25} fill="currentColor" />
      ))}
      {finder(0, 0)}
      {finder(n - 3, 0)}
      {finder(0, n - 3)}
    </svg>
  );
}

export type MembershipCardProps = {
  title: string;
  name: string;
  code: string;
  rows: { label: string; value: string }[];
  validUntil: Date;
  className?: string;
};

/** The federation membership card, rendered as a physical object. */
export function MembershipCard({ title, name, code, rows, validUntil, className }: MembershipCardProps) {
  return (
    <div
      className={cn(
        "relative aspect-[1.586] w-full max-w-[380px] overflow-hidden rounded-[16px] border border-black/5 text-fg",
        className,
      )}
      style={{
        background: "linear-gradient(160deg, #ffffff 0%, #f3f5f4 100%)",
        boxShadow: "0 1px 1px rgb(0 0 0 / 0.04), 0 12px 32px -8px rgb(16 40 32 / 0.22), inset 0 1px 0 #fff",
      }}
    >
      {/* court-green band at the inline start, like a lanyard card stripe */}
      <div aria-hidden className="absolute inset-y-0 start-0 w-2 bg-accent" />
      <div className="flex h-full flex-col justify-between p-5 ps-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <LogoMark size={22} />
            <div className="leading-tight">
              <p className="text-xs font-semibold">فدراسیون تکواندو</p>
              <p className="text-[11px] text-fg-muted">{title}</p>
            </div>
          </div>
          <bdi dir="ltr" className="tabular rounded-[5px] border border-hairline-strong px-1.5 py-0.5 text-[11px] font-medium text-fg-secondary">
            {toPersianDigits(code)}
          </bdi>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar name={name} size={44} />
            <div className="min-w-0">
              <p className="truncate text-md font-semibold">{name}</p>
              <dl className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11px]">
                {rows.map((r) => (
                  <div key={r.label} className="flex gap-1">
                    <dt className="text-fg-muted">{r.label}:</dt>
                    <dd className="truncate font-medium">{r.value}</dd>
                  </div>
                ))}
                <div className="col-span-2 flex gap-1">
                  <dt className="text-fg-muted">اعتبار تا:</dt>
                  <dd className="font-medium">{formatDate(validUntil, "short")}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="shrink-0 rounded-md bg-white p-1">
            <Pattern seed={code} size={52} />
          </div>
        </div>
      </div>
    </div>
  );
}
