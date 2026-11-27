"use client";

import { categoryLabel } from "@varzino/demo-data";
import { StatusBadge } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { EmptyState, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { NativeSelect } from "@varzino/ui/components/input";
import { Avatar } from "@varzino/ui/components/misc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@varzino/ui/components/overlays";
import { cn } from "@varzino/ui/lib/cn";
import { formatNumber } from "@varzino/utils";
import { CalendarClock, Swords } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Bracket } from "@varzino/shared/bracket";
import { useData } from "@/components/data-provider";

export function CompetitionTabs({ id }: { id: string }) {
  const { bracketFor, categoriesFor, clubById, competitionById, liveSchedule, medalTable, people, profile, provinceById } = useData();
  const station = profile.copy.myStation[0];
  const c = competitionById[id]!;
  const categories = useMemo(() => categoriesFor(c), [categoriesFor, c]);
  const [category, setCategory] = useState(categories[3]?.id ?? "");
  const rounds = useMemo(() => bracketFor(c.id), [bracketFor, c.id]);
  const hasDraw = c.status === "live" || c.status === "finished" || c.status === "scheduled";
  const registrants = useMemo(
    () =>
      people
        .filter((p) => p.role === "athlete" && p.disciplineId === c.disciplineId && (c.gender === "mixed" || p.gender === c.gender))
        .slice(0, 14),
    [people, c.disciplineId, c.gender],
  );

  return (
    <Tabs defaultValue={hasDraw ? "draw" : "registrations"} className="flex flex-col gap-5">
      <TabsList>
        <TabsTrigger value="draw">جدول مسابقات</TabsTrigger>
        <TabsTrigger value="categories">رده‌ها</TabsTrigger>
        <TabsTrigger value="registrations">ثبت‌نام‌ها</TabsTrigger>
        <TabsTrigger value="schedule">برنامه</TabsTrigger>
        <TabsTrigger value="medals">جدول مدال</TabsTrigger>
      </TabsList>

      <TabsContent value="draw" className="focus-visible:outline-none">
        <Card>
          <CardHeader
            title="جدول حذفی"
            description="هشت نفر برتر پس از مرحله مقدماتی، بر اساس رنکینگ سرگروه‌بندی شده‌اند"
            className="flex-col sm:flex-row"
            action={
              <NativeSelect aria-label={profile.categoryTitle} value={category} onChange={(e) => setCategory(e.target.value)} className="w-44">
                {categories.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label}
                  </option>
                ))}
              </NativeSelect>
            }
          />
          <CardBody>
            {hasDraw ? (
              <Bracket rounds={rounds} />
            ) : (
              <EmptyState
                icon={<Swords />}
                title="قرعه‌کشی هنوز انجام نشده"
                description={`پس از پایان مهلت ثبت‌نام و ${profile.checkIn}، جدول به‌صورت خودکار و بر اساس رنکینگ ساخته می‌شود.`}
                action={
                  <Button variant="secondary" onClick={() => toast("پیش‌نمایش قرعه ساخته شد، هنوز منتشر نشده")}>
                    پیش‌نمایش قرعه
                  </Button>
                }
              />
            )}
          </CardBody>
        </Card>
      </TabsContent>

      <TabsContent value="categories" className="focus-visible:outline-none">
        <Card>
          <Table>
            <THead>
              <TH>{profile.categoryTitle}</TH>
              <TH numeric>ثبت‌نام</TH>
              <TH>{station}</TH>
              <TH>وضعیت</TH>
            </THead>
            <tbody>
              {categories.map((w) => (
                <TR key={w.id}>
                  <TD className="font-medium">{w.label}</TD>
                  <TD numeric>{formatNumber(w.registered)}</TD>
                  <TD className="text-fg-secondary">{station} {formatNumber(w.mat)}</TD>
                  <TD>
                    {w.status === "done" ? (
                      <StatusBadge tone="positive">نتایج ثبت شد</StatusBadge>
                    ) : w.status === "in-progress" ? (
                      <StatusBadge tone="negative">در حال برگزاری</StatusBadge>
                    ) : (
                      <StatusBadge>در انتظار</StatusBadge>
                    )}
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="registrations" className="focus-visible:outline-none">
        <Card>
          <CardHeader
            title="ثبت‌نام‌شدگان"
            description={`${formatNumber(c.registered)} ورزشکار، ۱۴ نفر آخر`}
            action={
              <Button variant="secondary" size="sm" onClick={() => toast.success("فهرست برای کمیته پزشکی ارسال شد")}>
                ارسال به کمیته پزشکی
              </Button>
            }
          />
          <Table className="mt-4">
            <THead>
              <TH>ورزشکار</TH>
              <TH>کد عضویت</TH>
              <TH>باشگاه</TH>
              <TH>{profile.categoryTitle}</TH>
              <TH>مدارک</TH>
            </THead>
            <tbody>
              {registrants.map((p, i) => (
                <TR key={p.id}>
                  <TD>
                    <Link href={`/people/${p.id}`} className="flex items-center gap-3 hover:underline">
                      <Avatar name={p.fullName} size={28} />
                      <span className="font-medium">{p.fullName}</span>
                    </Link>
                  </TD>
                  <TD>
                    <CodeChip value={p.code} />
                  </TD>
                  <TD className="text-fg-secondary">
                    {clubById[p.clubId]?.name}
                    <span className="text-fg-muted">، {provinceById[p.provinceId]?.name}</span>
                  </TD>
                  <TD className="text-fg-secondary">{categoryLabel(p.category)}</TD>
                  <TD>
                    {i % 6 === 4 ? (
                      <StatusBadge tone="warning">بیمه منقضی</StatusBadge>
                    ) : p.medicalStatus !== "fit" ? (
                      <StatusBadge tone="warning">معاینه پزشکی</StatusBadge>
                    ) : (
                      <StatusBadge tone="positive">کامل</StatusBadge>
                    )}
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="schedule" className="focus-visible:outline-none">
        <Card>
          <CardHeader title="برنامه روز" description="زمان‌ها با ورود نتایج به‌روز می‌شود" />
          <CardBody>
            {c.status === "live" ? (
              <ol className="flex flex-col">
                {liveSchedule.map((s) => (
                  <li key={s.time} className="flex gap-4">
                    <span className={cn("tabular w-12 shrink-0 pt-3 text-sm", s.state === "now" ? "font-medium text-accent-ink" : "text-fg-muted")}>
                      {s.time}
                    </span>
                    <div className={cn("flex-1 border-s py-3 ps-4", s.state === "now" ? "border-accent" : "border-hairline-strong")}>
                      <p className={cn("text-sm", s.state === "done" ? "text-fg-muted" : "text-fg", s.state === "now" && "font-medium")}>{s.title}</p>
                      <p className="text-xs text-fg-muted">{s.mat}</p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <EmptyState icon={<CalendarClock />} title="برنامه هنوز منتشر نشده" description="برنامه زمانی پس از قرعه‌کشی و تعیین زمین‌ها منتشر می‌شود." />
            )}
          </CardBody>
        </Card>
      </TabsContent>

      <TabsContent value="medals" className="focus-visible:outline-none">
        <Card>
          <Table>
            <THead>
              <TH>رتبه</TH>
              <TH>استان</TH>
              <TH numeric>طلا</TH>
              <TH numeric>نقره</TH>
              <TH numeric>برنز</TH>
              <TH numeric>مجموع</TH>
            </THead>
            <tbody>
              {medalTable.map((m, i) => (
                <TR key={m.provinceId}>
                  <TD className="tabular text-fg-muted">{formatNumber(i + 1)}</TD>
                  <TD className="font-medium">{provinceById[m.provinceId]?.name}</TD>
                  {(["gold", "silver", "bronze"] as const).map((k) => (
                    <TD key={k} numeric>
                      <span className="inline-flex items-center gap-1.5">
                        {formatNumber(m[k])}
                        <span aria-hidden className={cn("size-2 rounded-full", k === "gold" ? "bg-gold" : k === "silver" ? "bg-silver" : "bg-bronze")} />
                      </span>
                    </TD>
                  ))}
                  <TD numeric className="font-medium">
                    {formatNumber(m.gold + m.silver + m.bronze)}
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
