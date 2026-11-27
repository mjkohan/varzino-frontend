import { categoryLabel, levelLabel } from "@varzino/demo-data";
import { Dot, StatusBadge } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { Avatar } from "@varzino/ui/components/misc";
import { MembershipCard } from "@varzino/shared/membership-card";
import { daysFromNow, formatDate, formatNumber, formatRelative } from "@varzino/utils";
import { ArrowLeft, CircleAlert, CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getData } from "@/lib/session";

export const metadata: Metadata = { title: "خانه" };

export default async function ParticipantHome() {
  const { clubById, disciplineName, me, myNotifications, profile, myRegistrationStatusLabel, myRegistrations, openForMe, provinceById, rankingFor } = await getData();
  const club = clubById[me.clubId];
  const province = provinceById[me.provinceId];
  const ranking = rankingFor(me.gender, me.category, me.disciplineId);
  const myRank = ranking.find((r) => r.person.id === me.id);
  const today = myRegistrations.find((r) => r.status === "weighed");
  const upcoming = myRegistrations.filter((r) => r.status === "registered" || r.status === "pending-payment");

  const checks = [
    { label: "عضویت ۱۴۰۵", ok: true, detail: "معتبر تا ۱۵ مهر ۱۴۰۶" },
    { label: "بیمه ورزشی", ok: false, detail: "۴۵ روز تا انقضا", href: "/me/card", action: "تمدید" },
    { label: profile.impairments ? "کلاس‌بندی پزشکی" : "معاینه پزشکی", ok: true, detail: profile.impairments ? `کلاس ${me.category ?? ""} تأیید شده، ۲ ماه پیش` : "بلامانع، ۲ ماه پیش" },
    { label: "مدارک هویتی", ok: true, detail: "تأیید شده" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar name={me.fullName} size={56} />
        <div>
          <h1 className="text-2xl font-medium text-fg">{me.fullName}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-fg-muted">
            <CodeChip value={me.code} label="کد عضویت" />
            <span>{club?.name}</span>
            <span aria-hidden>،</span>
            <span>{province?.name}</span>
            <span aria-hidden>،</span>
            <span>{disciplineName(me.disciplineId)}، {categoryLabel(me.category)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-4">
          {today ? (
            <Card className="border-accent/30">
              <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-accent-ink">نوبت بعدی شما، امروز</p>
                  <p className="mt-1 text-lg font-medium text-fg">{today.competition.title}</p>
                  <p className="text-sm text-fg-secondary">
                    ساعت ۱۱:۰۰، {profile.copy.myStation.join(" ")}، {today.competition.venue}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-6 rounded-card bg-raised px-5 py-3 text-center">
                  <div>
                    <p className="tabular text-xl font-medium text-fg">۱۱:۰۰</p>
                    <p className="text-xs text-fg-muted">شروع</p>
                  </div>
                  <div>
                    <p className="tabular text-xl font-medium text-fg">{profile.copy.myStation[1]}</p>
                    <p className="text-xs text-fg-muted">{profile.copy.myStation[0]}</p>
                  </div>
                  <div>
                    <p className="text-xl font-medium text-fg">یک‌چهارم</p>
                    <p className="text-xs text-fg-muted">مرحله</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : null}

          <Card>
            <CardHeader
              title="مسابقات من"
              action={
                <Link href="/me/competitions" className="text-sm text-accent-ink hover:underline">
                  همه
                </Link>
              }
            />
            <ul className="mt-2 flex flex-col px-5 pb-3">
              {[...(today ? [today] : []), ...upcoming].map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 border-b border-hairline py-3 last:border-b-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{r.competition.title}</p>
                    <p className="text-xs text-fg-muted">
                      {formatDate(r.competition.startDate)}، {r.competition.city}
                    </p>
                  </div>
                  <StatusBadge tone={r.status === "weighed" ? "accent" : "info"}>{myRegistrationStatusLabel[r.status]}</StatusBadge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="ثبت‌نام باز برای شما" description="بر اساس رشته، رده سنی و رده مسابقه شما" />
            <ul className="mt-2 flex flex-col px-5 pb-3">
              {openForMe.slice(0, 3).map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 border-b border-hairline py-3 last:border-b-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-fg">{c.title}</p>
                    <p className="text-xs text-fg-muted">
                      {levelLabel[c.level]}، {formatDate(c.startDate)}، مهلت ثبت‌نام {formatDate(c.registrationDeadline, "dayMonth")}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/me/competitions?register=${c.id}`}>ثبت‌نام</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="اعلان‌ها" />
            <ul className="mt-2 flex flex-col px-5 pb-3">
              {myNotifications.map((n) => (
                <li key={n.id} className="flex gap-3 border-b border-hairline py-3 last:border-b-0">
                  <Dot tone={n.tone} className="mt-2" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-fg">{n.title}</p>
                    <p className="text-sm text-fg-secondary">{n.body}</p>
                  </div>
                  <span className="shrink-0 text-xs text-fg-muted">{formatRelative(n.at)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardBody className="flex flex-col items-center gap-4">
              <MembershipCard
                title="کارت عضویت ورزشکار"
                federation={profile.name}
                name={me.fullName}
                code={me.code}
                validUntil={daysFromNow(318)}
                rows={[
                  { label: "استان", value: province?.name ?? "" },
                  { label: "رشته", value: disciplineName(me.disciplineId) },
                ]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="آمادگی برای مسابقه" description="بدون این موارد ثبت‌نام قطعی نمی‌شود" />
            <ul className="mt-2 flex flex-col px-5 pb-3">
              {checks.map((c) => (
                <li key={c.label} className="flex items-center gap-3 border-b border-hairline py-3 last:border-b-0">
                  {c.ok ? (
                    <CircleCheck aria-hidden className="size-5 shrink-0 text-positive" strokeWidth={1.75} />
                  ) : (
                    <CircleAlert aria-hidden className="size-5 shrink-0 text-warning" strokeWidth={1.75} />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-fg">{c.label}</p>
                    <p className="text-xs text-fg-muted">{c.detail}</p>
                  </div>
                  {c.href ? (
                    <Button asChild size="sm">
                      <Link href={c.href}>{c.action}</Link>
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader title="رنکینگ من" description={`${disciplineName(me.disciplineId)}، ${categoryLabel(me.category)}`} />
            <CardBody className="flex items-center justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="tabular text-3xl font-medium text-fg">{myRank ? formatNumber(myRank.rank) : "—"}</p>
                  <p className="text-xs text-fg-muted">رتبه کشوری</p>
                </div>
                <div>
                  <p className="tabular text-3xl font-medium text-fg">{formatNumber(me.rankingPoints)}</p>
                  <p className="text-xs text-fg-muted">امتیاز</p>
                </div>
              </div>
              <Link href="/me/profile" className="inline-flex items-center gap-1 text-sm text-accent-ink hover:underline">
                روند امتیاز
                <ArrowLeft aria-hidden className="size-4" />
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
