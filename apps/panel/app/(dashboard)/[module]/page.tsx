import { moduleById, modules, overviews, type Cell } from "@varzino/demo-data";
import { ColumnChart, TrendChart } from "@varzino/ui/charts/charts";
import { Dot, StatusBadge } from "@varzino/ui/components/badge";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { BarList, PageHeader, Stat, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { formatNumber, toPersianDigits } from "@varzino/utils";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModuleIcon } from "@varzino/shared/module-icon";
import { workspaces } from "@varzino/demo-data";
import { Messenger, RoleMatrix } from "@/components/module-extras";
import { ModuleWorkspace } from "@/components/workspace";

export const dynamicParams = false;

export function generateStaticParams() {
  return modules.filter((m) => m.depth === "light").map((m) => ({ module: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }): Promise<Metadata> {
  const { module } = await params;
  return { title: moduleById[module]?.title ?? "بخش" };
}

function CellView({ cell }: { cell: Cell }) {
  if (typeof cell === "string") return <>{cell}</>;
  return <StatusBadge tone={cell.tone}>{cell.text}</StatusBadge>;
}

export default async function ModuleOverviewPage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  const mod = moduleById[module];
  const data = overviews[module];
  if (!mod || !data) notFound();

  const { chart } = data;
  // Long or many category labels read better as a ranked list than as columns.
  const asList = chart.kind === "bar" && (chart.data.length > 7 || chart.data.some((d) => d.label.length > 12));
  const decimal = chart.data.some((d) => !Number.isInteger(d.value));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={mod.title}
        description={mod.fullTitle}
        meta={
          <span className="inline-flex items-center gap-2">
            <ModuleIcon name={mod.icon} className="size-4" />
            {mod.summary}
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {data.stats.map((s) => (
          <Stat key={s.label} label={s.label} value={s.value} change={s.change} />
        ))}
      </div>

      {workspaces[module] ? <ModuleWorkspace id={module} /> : null}
      {module === "users" ? <RoleMatrix /> : null}
      {module === "messaging" ? <Messenger /> : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <Card>
          <CardHeader title={chart.title} description={chart.caption} />
          <CardBody>
            {asList ? (
              <BarList
                highlightFirst
                format={(n) => `${n.toLocaleString("fa-IR")}${chart.unit === "٪" ? "٪" : ""}`}
                items={chart.data.map((d) => ({ key: d.label, label: toPersianDigits(d.label), value: d.value }))}
              />
            ) : chart.kind === "line" ? (
              <TrendChart
                height={260}
                data={chart.data}
                xKey="label"
                valueFormat={chart.unit === "٪" ? "percent" : "number"}
                series={[{ key: "value", label: chart.unit }]}
              />
            ) : (
              <ColumnChart
                height={260}
                data={chart.data}
                label={chart.unit}
                valueFormat={chart.unit === "٪" ? "percent" : decimal ? "decimal" : "number"}
              />
            )}
          </CardBody>
        </Card>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title={data.attention.title} />
            <ul className="mt-2 flex flex-col px-5 pb-3">
              {data.attention.items.map((it) => (
                <li key={it.text} className="flex gap-3 border-b border-hairline py-3 last:border-b-0">
                  <Dot tone={it.tone} className="mt-2" />
                  <div className="min-w-0">
                    <p className="text-sm text-fg">{it.text}</p>
                    <p className="text-xs text-fg-muted">{it.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="امکانات این زیرسامانه" description="طبق سند نیازمندی‌ها" />
            <ul className="flex flex-col gap-2.5 px-5 pb-5 pt-4">
              {mod.capabilities.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-sm text-fg-secondary">
                  <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-accent-ink" strokeWidth={2.25} />
                  {c}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {module === "leagues" || !workspaces[module] ? (
      <Card>
        <CardHeader title={data.table.title} description={`${formatNumber(data.table.rows.length)} مورد اخیر`} />
        <Table className="mt-4">
          <THead>
            {data.table.columns.map((c) => (
              <TH key={c}>{c}</TH>
            ))}
          </THead>
          <tbody>
            {data.table.rows.map((row, i) => (
              <TR key={i}>
                {row.map((cell, j) => (
                  <TD key={j} className={j === 0 ? "font-medium" : "text-fg-secondary"}>
                    <CellView cell={cell} />
                  </TD>
                ))}
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>
      ) : null}
    </div>
  );
}
