"use client";

import { competitions, competitionStatusLabel, levelLabel, type CompetitionStatus } from "@varzino/demo-data";
import { StatusBadge } from "@varzino/ui/components/badge";
import { Card } from "@varzino/ui/components/card";
import { EmptyState, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { Progress } from "@varzino/ui/components/misc";
import { formatDate, formatNumber } from "@varzino/utils";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { statusTone } from "./tones";
import { FilterTabs, SearchInput, Toolbar } from "./list-toolbar";


const order: CompetitionStatus[] = ["live", "registration", "scheduled", "draft", "finished"];

export function CompetitionsList() {
  const [status, setStatus] = useState<string>("all");
  const [q, setQ] = useState("");
  const router = useRouter();

  const rows = useMemo(
    () =>
      competitions
        .filter((c) => status === "all" || c.status === status)
        .filter((c) => !q.trim() || c.title.includes(q.trim()) || c.city.includes(q.trim()))
        .sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status) || a.startDate.getTime() - b.startDate.getTime()),
    [status, q],
  );

  const options = [
    { value: "all", label: "همه", count: competitions.length },
    ...order.map((s) => ({ value: s, label: competitionStatusLabel[s], count: competitions.filter((c) => c.status === s).length })),
  ];

  return (
    <Card>
      <Toolbar>
        <FilterTabs label="وضعیت مسابقه" value={status} onChange={setStatus} options={options} />
        <SearchInput value={q} onChange={setQ} placeholder="عنوان یا شهر" />
      </Toolbar>
      {rows.length === 0 ? (
        <EmptyState icon={<Trophy />} title="مسابقه‌ای با این مشخصات نیست" description="فیلتر وضعیت را روی «همه» بگذارید یا عبارت دیگری جست‌وجو کنید." />
      ) : (
        <Table>
          <THead>
            <TH>مسابقه</TH>
            <TH>رده</TH>
            <TH>تاریخ</TH>
            <TH>محل</TH>
            <TH className="w-48">ثبت‌نام</TH>
            <TH>وضعیت</TH>
          </THead>
          <tbody>
            {rows.map((c) => (
              <TR key={c.id} onClick={() => router.push(`/competitions/${c.id}`)}>
                <TD>
                  <Link href={`/competitions/${c.id}`} className="font-medium text-fg hover:underline">
                    {c.title}
                  </Link>
                  <p className="text-xs text-fg-muted">{c.ageGroup}، {c.gender === "male" ? "آقایان" : c.gender === "female" ? "بانوان" : "آقایان و بانوان"}</p>
                </TD>
                <TD className="text-fg-secondary">{levelLabel[c.level]}</TD>
                <TD className="text-fg-secondary">{formatDate(c.startDate, "medium")}</TD>
                <TD className="text-fg-secondary">{c.city}</TD>
                <TD>
                  {c.status === "draft" ? (
                    <span className="text-sm text-fg-muted">هنوز باز نشده</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Progress value={c.registered} max={c.capacity} className="w-24" tone={c.status === "registration" ? "accent" : "muted"} label="ظرفیت ثبت‌نام" />
                      <span className="tabular text-xs text-fg-secondary">
                        {formatNumber(c.registered)} از {formatNumber(c.capacity)}
                      </span>
                    </div>
                  )}
                </TD>
                <TD>
                  <StatusBadge tone={statusTone[c.status]}>{competitionStatusLabel[c.status]}</StatusBadge>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
