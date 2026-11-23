import {
  activity,
  approvals,
  competitions,
  competitionStatusLabel,
  levelLabel,
  liveSchedule,
  nationalTotals,
  provinces,
  registrationTrend,
  wallet,
} from "@varzino/demo-data";
import { Button } from "@varzino/ui/components/button";
import { Legend, TrendChart } from "@varzino/ui/charts/charts";
import { StatusBadge } from "@varzino/ui/components/badge";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { BarList, PageHeader, Stat } from "@varzino/ui/components/data-display";
import { cn } from "@varzino/ui/lib/cn";
import {
  DEMO_NOW,
  formatDate,
  formatNumber,
  formatRelative,
  formatTomanCompact,
} from "@varzino/utils";
import { ArrowLeft, BadgeCheck, GraduationCap, Repeat, Trophy, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getDemoRole } from "@/lib/role";

export const metadata: Metadata = { title: "پیشخوان" };

const approvalIcon = { license: BadgeCheck, competition: Trophy, transfer: Repeat, finance: Wallet, course: GraduationCap } as const;

export default async function DashboardPage() {
  const role = await getDemoRole();
  const live = competitions.find((c) => c.status === "live")!;
  const upcoming = competitions
    .filter((c) => c.status === "registration" || c.status === "scheduled")
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 4);
  const thisYear = registrationTrend.reduce((s, m) => s + m.thisYear, 0);
  const lastYear = registrationTrend.reduce((s, m) => s + m.lastYear, 0);
  const incomeChange = ((wallet.incomeThisMonth - wallet.incomeLastMonth) / wallet.incomeLastMonth) * 100;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="پیشخوان"
        meta={
          <>
            <span>{role.scope}</span>
            <span aria-hidden>،</span>
            <span>{formatDate(DEMO_NOW, "weekday")}</span>
          </>
        }
        actions={
          <>
            <Button variant="secondary" asChild>
              <Link href="/licenses">درخواست‌های کارت</Link>
            </Button>
            <Button asChild>
              <Link href="/competitions/new">تعریف مسابقه</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Stat
          label="ورزشکاران ثبت‌شده"
          value={formatNumber(nationalTotals.athletes)}
          change={{ value: ((thisYear - lastYear) / lastYear) * 100, against: "سال قبل" }}
        />
        <Stat
          label="دریافتی آبان"
          value={formatTomanCompact(wallet.incomeThisMonth)}
          change={{ value: incomeChange, against: "مهر" }}
        />
        <Stat label="باشگاه‌های دارای پروانه" value={formatNumber(nationalTotals.clubs)} hint={`در ${formatNumber(provinces.length)} استان`} />
        <Stat label="در انتظار تأیید شما" value={formatNumber(approvals.length)} hint="قدیمی‌ترین: ۵ روز پیش" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader
            title="ثبت‌نام ورزشکاران"
            description="عضویت‌های جدید و تمدیدشده در ۱۲ ماه اخیر"
            action={
              <Legend
                series={[
                  { key: "thisYear", label: "امسال" },
                  { key: "lastYear", label: "سال قبل", emphasis: false },
                ]}
              />
            }
            className="flex-col sm:flex-row"
          />
          <CardBody className="pt-4">
            <TrendChart
              data={registrationTrend}
              xKey="month"
              height={320}
              series={[
                { key: "thisYear", label: "امسال" },
                { key: "lastYear", label: "سال قبل", emphasis: false },
              ]}
            />
          </CardBody>
        </Card>

        <Card className="flex flex-col">
          <CardHeader title="در انتظار تأیید" description="به ترتیب زمان انتظار" />
          <ul className="mt-3 flex flex-1 flex-col px-2 pb-2">
            {approvals.map((a) => {
              const Icon = approvalIcon[a.kind];
              return (
                <li key={a.id}>
                  <Link href={a.href} className="group flex items-start gap-3 rounded-control px-3 py-3 transition-colors hover:bg-raised">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-control border border-hairline bg-bg text-fg-muted">
                      <Icon aria-hidden className="size-4" strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-fg">{a.title}</span>
                      <span className="block text-xs text-fg-muted">
                        {a.from}، {formatRelative(a.waitingSince)}
                      </span>
                    </span>
                    <ArrowLeft aria-hidden className="icon-dir mt-2 size-4 shrink-0 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]">
        <Card>
          <CardHeader
            title={live.title}
            description={`${live.venue}، ${live.city}`}
            action={<StatusBadge tone="negative">{competitionStatusLabel.live}</StatusBadge>}
          />
          <CardBody>
            <ol className="flex flex-col">
              {liveSchedule.map((s) => (
                <li key={s.time} className="flex gap-4">
                  <span className={cn("tabular w-11 shrink-0 pt-2.5 text-sm", s.state === "now" ? "font-medium text-accent-ink" : "text-fg-muted")}>
                    {s.time}
                  </span>
                  <div
                    className={cn(
                      "flex-1 border-s py-2.5 ps-4",
                      s.state === "now" ? "border-accent" : "border-hairline-strong",
                      s.state === "done" && "text-fg-muted",
                    )}
                  >
                    <p className={cn("text-sm", s.state === "now" ? "font-medium text-fg" : s.state === "next" ? "text-fg" : "")}>{s.title}</p>
                    <p className="text-xs text-fg-muted">{s.mat}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Button variant="secondary" asChild className="mt-4 w-full">
              <Link href={`/competitions/${live.id}`}>جدول و نتایج زنده</Link>
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="ورزشکاران به تفکیک استان" description="۸ استان اول" action={<Link href="/organizations" className="text-sm text-accent-ink hover:underline">همه استان‌ها</Link>} />
          <CardBody>
            <BarList
              highlightFirst
              format={formatNumber}
              items={[...provinces]
                .sort((a, b) => b.athletes - a.athletes)
                .slice(0, 8)
                .map((p) => ({ key: p.id, label: p.name, value: p.athletes }))}
            />
          </CardBody>
        </Card>

        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader title="مسابقات پیش‌رو" />
          <ul className="mt-2 flex flex-col px-5 pb-3">
            {upcoming.map((c) => (
              <li key={c.id} className="border-b border-hairline py-3 last:border-b-0">
                <Link href={`/competitions/${c.id}`} className="group block">
                  <p className="text-sm text-fg group-hover:underline">{c.title}</p>
                  <p className="mt-0.5 text-xs text-fg-muted">
                    {levelLabel[c.level]}، {formatDate(c.startDate, "dayMonth")}، {c.city}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="آخرین فعالیت‌ها" description="در همه هیئت‌ها و کمیته‌ها" />
        <ul className="mt-2 grid px-5 pb-2 md:grid-cols-2 md:gap-x-10">
          {activity.map((a) => (
            <li key={a.id} className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 text-sm last:border-b-0 md:[&:nth-last-child(2)]:border-b-0">
              <p className="min-w-0 text-fg-secondary">
                <span className="font-medium text-fg">{a.actor}</span> {a.action}
                <span className="text-fg-muted">، {a.target}</span>
              </p>
              <span className="shrink-0 text-xs text-fg-muted">{formatRelative(a.at)}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
