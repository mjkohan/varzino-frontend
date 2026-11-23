import { competitionById, competitions, competitionStatusLabel, levelLabel } from "@varzino/demo-data";
import { StatusBadge } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { PageHeader, Stat } from "@varzino/ui/components/data-display";
import { formatDate, formatNumber, formatToman } from "@varzino/utils";
import { Download, Printer } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { CompetitionTabs } from "@/components/competition-tabs";
import { statusTone } from "@/components/tones";

export function generateStaticParams() {
  return competitions.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: competitionById[id]?.title ?? "مسابقه" };
}

export default async function CompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = competitionById[id];
  if (!c) notFound();

  const sameDay = formatDate(c.startDate) === formatDate(c.endDate);
  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/competitions" label="مسابقات" />
      <PageHeader
        title={c.title}
        meta={
          <>
            <StatusBadge tone={statusTone[c.status]}>{competitionStatusLabel[c.status]}</StatusBadge>
            <span>{levelLabel[c.level]}</span>
            <span aria-hidden>،</span>
            <span>{sameDay ? formatDate(c.startDate) : `${formatDate(c.startDate, "dayMonth")} تا ${formatDate(c.endDate)}`}</span>
            <span aria-hidden>،</span>
            <span>
              {c.venue}، {c.city}
            </span>
          </>
        }
        actions={
          <>
            <Button variant="secondary">
              <Printer />
              چاپ جدول
            </Button>
            <Button variant="secondary">
              <Download />
              خروجی اکسل
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="ثبت‌نام‌شدگان"
          value={`${formatNumber(c.registered)} از ${formatNumber(c.capacity)}`}
          hint={c.status === "registration" ? `مهلت ثبت‌نام: ${formatDate(c.registrationDeadline, "dayMonth")}` : "ثبت‌نام بسته است"}
        />
        <Stat label="اوزان" value={formatNumber(8)} hint="کیوروگی، طبق آیین‌نامه رده سنی" />
        <Stat label="داوران منصوب" value={formatNumber(c.referees)} hint="کمیته داوران" />
        <Stat label="ورودیه هر ورزشکار" value={formatToman(c.fee)} hint={`ضریب رنکینگ: ${formatNumber(c.rankingFactor)}`} />
      </div>
      <CompetitionTabs id={c.id} />
    </div>
  );
}
