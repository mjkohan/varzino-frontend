"use client";

import { formatCompact, formatNumber, formatPercent, formatTomanCompact, toPersianDigits } from "@varzino/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useId } from "react";
import { cn } from "../lib/cn";

/*
 * Chart rules (dataviz skill + unslop):
 * - one accent for the series that matters, neutral for context
 * - 2px lines, bars <= 24px with 4px rounded data end, hairline solid grid
 * - RTL: time flows right to left (reversed x axis), y axis on the right
 * - text uses text tokens, never the series color
 */

const ACCENT = "var(--accent)";
const CONTEXT = "#858f8f";
const GRID = "var(--chart-grid)";
const TICK = { fill: "var(--fg-muted)", fontSize: 12, fontFamily: "inherit" };

type Series = { key: string; label: string; emphasis?: boolean };

/** Value formats as presets, so server components can pass them (functions cannot cross the server/client boundary). */
export type ValueFormat = "number" | "toman" | "percent" | "decimal";

const formatters: Record<ValueFormat, { value: (n: number) => string; axis: (n: number) => string }> = {
  number: { value: formatNumber, axis: formatCompact },
  toman: { value: (n) => formatTomanCompact(n), axis: (n) => formatCompact(n / 10) },
  percent: { value: formatPercent, axis: (n) => formatPercent(n) },
  decimal: { value: (n) => n.toLocaleString("fa-IR", { maximumFractionDigits: 1 }), axis: (n) => n.toLocaleString("fa-IR", { maximumFractionDigits: 1 }) },
};

type TooltipItem = { dataKey?: string | number; value?: number | string; color?: string; name?: string };

function ChartTooltip({
  active,
  payload,
  label,
  series,
  format,
}: {
  active?: boolean;
  payload?: TooltipItem[];
  label?: string | number;
  series: Series[];
  format: (n: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div dir="rtl" className="min-w-40 rounded-[10px] border border-hairline bg-surface px-3 py-2 text-sm shadow-float">
      <p className="mb-1 text-xs text-fg-muted">{toPersianDigits(String(label ?? ""))}</p>
      {series.map((s) => {
        const item = payload.find((p) => p.dataKey === s.key);
        if (!item) return null;
        return (
          <div key={s.key} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-fg-secondary">
              <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: s.emphasis === false ? CONTEXT : ACCENT }} />
              {s.label}
            </span>
            <span className="tabular font-medium text-fg">{format(Number(item.value))}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Legend({ series, className }: { series: Series[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-4 text-sm text-fg-secondary", className)}>
      {series.map((s) => (
        <li key={s.key} className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-0.5 w-4 rounded-full"
            style={
              s.emphasis === false
                ? { backgroundImage: `linear-gradient(to left, ${CONTEXT} 60%, transparent 60%)`, backgroundSize: "6px 2px" }
                : { background: ACCENT }
            }
          />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

/** Trend over time. First emphasized series gets the accent + wash; context series is a neutral dashed line. */
export function TrendChart({
  data,
  xKey,
  series,
  height = 300,
  valueFormat = "number",
  className,
}: {
  data: Record<string, string | number>[];
  xKey: string;
  series: Series[];
  height?: number;
  valueFormat?: ValueFormat;
  className?: string;
}) {
  const { value: format, axis: axisFormat } = formatters[valueFormat];
  const washId = `wash-${useId().replace(/:/g, "")}`;
  const main = series.find((s) => s.emphasis !== false) ?? series[0];
  const context = series.filter((s) => s !== main);
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 8 }}>
          <defs>
            <linearGradient id={washId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.14} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis
            dataKey={xKey}
            reversed
            tickLine={false}
            axisLine={false}
            tick={TICK}
            tickMargin={10}
            interval="preserveStartEnd"
            tickFormatter={(v) => toPersianDigits(String(v))}
          />
          <YAxis
            orientation="right"
            tickLine={false}
            axisLine={false}
            tick={TICK}
            width={64}
            tickMargin={8}
            tickFormatter={(v: number) => axisFormat(v)}
          />
          <Tooltip
            cursor={{ stroke: "var(--hairline-strong)", strokeWidth: 1 }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload as unknown as TooltipItem[]}
                label={props.label as string}
                series={series}
                format={format}
              />
            )}
          />
          {context.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={CONTEXT}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, fill: CONTEXT, stroke: "var(--surface)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          ))}
          {main ? (
            <Area
              type="monotone"
              dataKey={main.key}
              stroke={ACCENT}
              strokeWidth={2}
              fill={`url(#${washId})`}
              dot={false}
              activeDot={{ r: 5, fill: ACCENT, stroke: "var(--surface)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          ) : null}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Single-series columns. `highlight` index gets the accent, the rest stay neutral. Without highlight all bars are accent. */
export function ColumnChart({
  data,
  height = 260,
  valueFormat = "number",
  highlight,
  label,
  className,
}: {
  data: { label: string; value: number }[];
  height?: number;
  valueFormat?: ValueFormat;
  highlight?: number;
  label: string;
  className?: string;
}) {
  const { value: format, axis: axisFormat } = formatters[valueFormat];
  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: 4 }} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke={GRID} />
          <XAxis
            dataKey="label"
            reversed
            tickLine={false}
            axisLine={false}
            tick={TICK}
            tickMargin={10}
            interval={0}
            tickFormatter={(v) => toPersianDigits(String(v))}
          />
          <YAxis orientation="right" tickLine={false} axisLine={false} tick={TICK} width={48} tickFormatter={(v: number) => axisFormat(v)} />
          <Tooltip
            cursor={{ fill: "var(--raised)" }}
            content={(props) => (
              <ChartTooltip
                active={props.active}
                payload={props.payload as unknown as TooltipItem[]}
                label={props.label as string}
                series={[{ key: "value", label }]}
                format={format}
              />
            )}
          />
          <Bar dataKey="value" maxBarSize={24} radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {data.map((d, i) => (
              <Cell key={d.label} fill={highlight === undefined || highlight === i ? ACCENT : "var(--chart-muted)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
