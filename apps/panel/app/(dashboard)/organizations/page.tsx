import { orgKindLabel, positionStatusLabel, type OrgNode } from "@varzino/demo-data";
import { StatusBadge, type Tone } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card, CardHeader } from "@varzino/ui/components/card";
import { PageHeader, Stat, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { cn } from "@varzino/ui/lib/cn";
import { formatNumber, formatPercent } from "@varzino/utils";
import { Building, Building2, ChevronDown, Landmark, Plus, UsersRound } from "lucide-react";
import type { Metadata } from "next";
import { getData } from "@/lib/session";

export const metadata: Metadata = { title: "سازمان‌ها" };

const kindIcon = { federation: Landmark, association: Landmark, committee: UsersRound, board: Building2, city: Building2, club: Building } as const;

function NodeRow({ node, depth }: { node: OrgNode; depth: number }) {
  const Icon = kindIcon[node.kind];
  return (
    <div className="flex min-h-12 flex-1 items-center gap-3 py-2" style={{ paddingInlineStart: depth === 0 ? 0 : 4 }}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-control border border-hairline bg-bg text-fg-muted">
        <Icon aria-hidden className="size-4" strokeWidth={1.6} />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm text-fg", depth === 0 && "font-medium")}>{node.name}</p>
        <p className="truncate text-xs text-fg-muted">
          {orgKindLabel[node.kind]}
          {node.head ? `، ${node.head}` : ""}
        </p>
      </div>
      {node.members !== undefined ? (
        <span className="tabular shrink-0 text-xs text-fg-muted">
          {formatNumber(node.members)} {node.kind === "committee" ? "عضو" : "ورزشکار"}
        </span>
      ) : null}
    </div>
  );
}

function Tree({ node, depth = 0 }: { node: OrgNode; depth?: number }) {
  if (!node.children?.length) {
    return (
      <li className="flex items-center ps-6">
        <NodeRow node={node} depth={depth} />
      </li>
    );
  }
  return (
    <li>
      <details open={depth < 1} className="group/tree">
        <summary className="flex cursor-pointer list-none items-center gap-1 rounded-control pe-2 transition-colors hover:bg-raised/60 [&::-webkit-details-marker]:hidden">
          <ChevronDown aria-hidden className="size-4 shrink-0 rotate-90 text-fg-muted transition-transform duration-200 group-open/tree:rotate-0" />
          <NodeRow node={node} depth={depth} />
        </summary>
        <ul className="ms-[11px] border-s border-hairline ps-3">
          {node.children.map((child) => (
            <Tree key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      </details>
    </li>
  );
}

const positionTone: Record<string, Tone> = { filled: "positive", vacant: "negative", acting: "warning" };

export default async function OrganizationsPage() {
  const { orgTree, positions, provinces } = await getData();
  const boards = provinces.length;
  const clubs = provinces.reduce((s, p) => s + p.clubs, 0);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="سازمان‌ها و ساختار"
        description="فدراسیون، کمیته‌ها، هیئت‌های استانی و باشگاه‌ها، با سمت‌ها و دوره تصدی"
        actions={
          <Button>
            <Plus />
            ثبت واحد جدید
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="هیئت‌های استانی" value={formatNumber(boards)} hint="همه استان‌ها فعال" />
        <Stat label="هیئت‌های شهرستان" value={formatNumber(286)} hint="۱۲ مورد بدون رئیس" />
        <Stat label="باشگاه‌های فعال" value={formatNumber(clubs)} change={{ value: 5.3, against: "سال قبل" }} />
        <Stat label="کمیته‌های تخصصی" value={formatNumber(6)} hint="۵۳ عضو" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <Card>
          <CardHeader title="نمودار سازمانی" description="برای دیدن زیرمجموعه‌ها، روی هر واحد بزنید" />
          <ul className="px-3 pb-4 pt-3">
            <Tree node={orgTree} />
          </ul>
        </Card>

        <Card className="h-fit">
          <CardHeader title="سمت‌های کلیدی" description="دوره چهارساله هیئت‌رئیسه" />
          <ul className="mt-3 flex flex-col px-5 pb-3">
            {positions.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 border-b border-hairline py-3 last:border-b-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{p.title}</p>
                  <p className="truncate text-xs text-fg-muted">
                    {p.holder === "—" ? "بدون متصدی" : p.holder}، {p.unit}
                  </p>
                </div>
                <StatusBadge tone={positionTone[p.status]}>{positionStatusLabel[p.status]}</StatusBadge>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="هیئت‌های استانی" description="آمار اعضا و رشد نسبت به سال قبل" />
        <Table className="mt-4">
          <THead>
            <TH>استان</TH>
            <TH numeric>ورزشکار</TH>
            <TH numeric>باشگاه</TH>
            <TH numeric>مربی</TH>
            <TH numeric>داور</TH>
            <TH numeric>رشد سالانه</TH>
          </THead>
          <tbody>
            {[...provinces]
              .sort((a, b) => b.athletes - a.athletes)
              .map((p) => (
                <TR key={p.id}>
                  <TD className="font-medium">هیئت {p.name}</TD>
                  <TD numeric>{formatNumber(p.athletes)}</TD>
                  <TD numeric>{formatNumber(p.clubs)}</TD>
                  <TD numeric>{formatNumber(p.coaches)}</TD>
                  <TD numeric>{formatNumber(p.referees)}</TD>
                  <TD numeric className={p.growth >= 8 ? "text-positive" : "text-fg-secondary"}>
                    <bdi dir="ltr">+{formatPercent(p.growth)}</bdi>
                  </TD>
                </TR>
              ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
