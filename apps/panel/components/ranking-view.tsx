"use client";

import { categoryLabel } from "@varzino/demo-data";
import { TrendChart } from "@varzino/ui/charts/charts";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { NativeSelect } from "@varzino/ui/components/input";
import { Avatar } from "@varzino/ui/components/misc";
import { cn } from "@varzino/ui/lib/cn";
import { formatNumber } from "@varzino/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterTabs } from "./list-toolbar";
import { useData } from "@/components/data-provider";

function Change({ value }: { value: number }) {
  if (value === 0) return <span className="text-fg-muted">–</span>;
  const up = value > 0;
  return (
    <span className={cn("tabular inline-flex items-center gap-0.5 text-sm", up ? "text-positive" : "text-negative")}>
      {up ? <ArrowUp aria-hidden className="size-3.5" /> : <ArrowDown aria-hidden className="size-3.5" />}
      {formatNumber(Math.abs(value))}
      <span className="sr-only">{up ? "پله صعود" : "پله نزول"}</span>
    </span>
  );
}

export function RankingView() {
  const { clubById, pointsHistory, profile, provinceById, rankingDisciplines, rankingFor, scoringRules } = useData();
  const [gender, setGender] = useState<"male" | "female">("male");
  const [disciplineId, setDisciplineId] = useState(profile.bracketDisciplineId);
  const [weight, setWeight] = useState<string>("all");
  const discipline = rankingDisciplines.find((d) => d.id === disciplineId) ?? rankingDisciplines[0]!;
  const entries = useMemo(
    () => rankingFor(gender, weight === "all" ? undefined : weight, discipline.id),
    [rankingFor, gender, weight, discipline.id],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = entries.find((e) => e.person.id === selectedId) ?? entries[0];
  const history = useMemo(() => (selected ? pointsHistory(selected.person) : []), [pointsHistory, selected]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <Card>
          <div className="flex flex-col gap-3 border-b border-hairline px-5 py-3 md:flex-row md:items-center md:justify-between">
            <FilterTabs
              label="بخش"
              value={gender}
              onChange={(v) => {
                setGender(v as "male" | "female");
                setWeight("all");
                setSelectedId(null);
              }}
              options={[
                { value: "male", label: "آقایان" },
                { value: "female", label: "بانوان" },
              ]}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              {rankingDisciplines.length > 1 ? (
                <NativeSelect
                  aria-label="رشته"
                  value={discipline.id}
                  onChange={(e) => {
                    setDisciplineId(e.target.value);
                    setWeight("all");
                    setSelectedId(null);
                  }}
                  className="w-full md:w-44"
                >
                  {rankingDisciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </NativeSelect>
              ) : null}
              <NativeSelect aria-label={profile.categoryTitle} value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full md:w-48">
                <option value="all">همه رده‌ها</option>
                {discipline.categories[gender].map((w) => (
                  <option key={w} value={w}>
                    {categoryLabel(w)}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </div>
          <Table>
            <THead>
              <TH className="w-14">رتبه</TH>
              <TH>ورزشکار</TH>
              <TH>استان</TH>
              <TH>{profile.categoryTitle}</TH>
              <TH>مدال‌ها</TH>
              <TH numeric>تغییر</TH>
              <TH numeric>امتیاز</TH>
            </THead>
            <tbody>
              {entries.map((e) => {
                const active = selected?.person.id === e.person.id;
                return (
                  <TR key={e.person.id} onClick={() => setSelectedId(e.person.id)} className={cn(active && "bg-accent-soft/50 hover:bg-accent-soft/60")}>
                    <TD className="tabular font-medium text-fg-secondary">{formatNumber(e.rank)}</TD>
                    <TD>
                      <button type="button" onClick={() => setSelectedId(e.person.id)} className="flex cursor-pointer items-center gap-3 text-start">
                        <Avatar name={e.person.fullName} size={28} />
                        <span>
                          <span className="block font-medium text-fg">{e.person.fullName}</span>
                          <span className="block text-xs text-fg-muted">{clubById[e.person.clubId]?.name}</span>
                        </span>
                      </button>
                    </TD>
                    <TD className="text-fg-secondary">{provinceById[e.person.provinceId]?.name}</TD>
                    <TD className="text-fg-secondary">{categoryLabel(e.person.category)}</TD>
                    <TD>
                      <span className="tabular flex items-center gap-3 text-xs text-fg-secondary">
                        {(["gold", "silver", "bronze"] as const).map((k) => (
                          <span key={k} className="inline-flex items-center gap-1" title={k === "gold" ? "طلا" : k === "silver" ? "نقره" : "برنز"}>
                            <span aria-hidden className={cn("size-2 rounded-full", k === "gold" ? "bg-gold" : k === "silver" ? "bg-silver" : "bg-bronze")} />
                            {formatNumber(e[k])}
                          </span>
                        ))}
                      </span>
                    </TD>
                    <TD numeric>
                      <Change value={e.change} />
                    </TD>
                    <TD numeric className="font-medium">
                      {formatNumber(e.points)}
                    </TD>
                  </TR>
                );
              })}
            </tbody>
          </Table>
        </Card>

        {selected ? (
          <Card className="h-fit xl:sticky xl:top-24">
            <CardBody className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <Avatar name={selected.person.fullName} size={44} />
                <div className="min-w-0">
                  <Link href={`/people/${selected.person.id}`} className="font-medium text-fg hover:underline">
                    {selected.person.fullName}
                  </Link>
                  <div className="mt-1 flex items-center gap-2 text-xs text-fg-muted">
                    <CodeChip value={selected.person.code} />
                    {provinceById[selected.person.provinceId]?.name}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-hairline rounded-card border border-hairline">
                {[
                  { l: "رتبه کشوری", v: formatNumber(selected.rank) },
                  { l: "امتیاز", v: formatNumber(selected.points) },
                  { l: "مسابقه رسمی", v: formatNumber(selected.events) },
                ].map((x) => (
                  <div key={x.l} className="px-3 py-3 text-center">
                    <p className="tabular text-lg font-medium text-fg">{x.v}</p>
                    <p className="text-xs text-fg-muted">{x.l}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium text-fg">روند امتیاز، ۸ دوره اخیر</p>
                <TrendChart className="mt-3" height={180} data={history} xKey="period" series={[{ key: "points", label: "امتیاز" }]} />
              </div>
            </CardBody>
          </Card>
        ) : null}
      </div>

      <Card>
        <CardHeader title="آیین‌نامه امتیازدهی" description="مصوب کمیته فنی، اجرا از ۱ فروردین ۱۴۰۵. امتیاز هر نتیجه پس از تأیید نتایج مسابقه به رنکینگ اضافه می‌شود." />
        <Table className="mt-4">
          <THead>
            <TH>رده مسابقه</TH>
            <TH numeric>اول</TH>
            <TH numeric>دوم</TH>
            <TH numeric>سوم</TH>
            <TH numeric>پنجم</TH>
            <TH numeric>شرکت</TH>
            <TH>اعتبار امتیاز</TH>
          </THead>
          <tbody>
            {scoringRules.map((r) => (
              <TR key={r.level}>
                <TD className="font-medium">{r.level}</TD>
                <TD numeric>{formatNumber(r.first)}</TD>
                <TD numeric>{formatNumber(r.second)}</TD>
                <TD numeric>{formatNumber(r.third)}</TD>
                <TD numeric>{r.fifth ? formatNumber(r.fifth) : "–"}</TD>
                <TD numeric>{formatNumber(r.participation)}</TD>
                <TD className="text-fg-secondary">{r.validity}</TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
