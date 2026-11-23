import { clubById, medicalLabel, people, personById, pointsHistory, provinceById, roleLabel, statusLabel, weightLabel, type TimelineEvent } from "@varzino/demo-data";
import { TrendChart } from "@varzino/ui/charts/charts";
import { StatusBadge } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { DescriptionList, Timeline } from "@varzino/ui/components/data-display";
import { Avatar, Progress } from "@varzino/ui/components/misc";
import { DEMO_NOW, daysFromNow, formatDate, formatNumber, formatPercent } from "@varzino/utils";
import { Award, BadgeCheck, GraduationCap, HeartPulse, Pencil, Repeat, Swords, UserCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { MembershipCard } from "@varzino/shared/membership-card";
import { personStatusTone } from "@/components/tones";

export function generateStaticParams() {
  return people.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: personById[id]?.fullName ?? "پرونده" };
}

const eventIcon: Record<TimelineEvent["kind"], React.ReactNode> = {
  competition: <Swords />,
  medal: <Award />,
  course: <GraduationCap />,
  license: <BadgeCheck />,
  medical: <HeartPulse />,
  membership: <UserCheck />,
  transfer: <Repeat />,
};

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = personById[id];
  if (!p) notFound();
  const club = clubById[p.clubId];
  const province = provinceById[p.provinceId];
  const insuranceValid = p.insuranceExpiry > DEMO_NOW;
  const history = p.role === "athlete" ? pointsHistory(p) : [];

  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/people" label="پرونده اشخاص" />

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={p.fullName} size={64} />
          <div>
            <h1 className="text-2xl font-medium text-fg">{p.fullName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-fg-muted">
              <CodeChip value={p.code} label="کد عضویت" />
              <span>{roleLabel[p.role]}</span>
              <span aria-hidden>،</span>
              <span>{club?.name}</span>
              <span aria-hidden>،</span>
              <span>{province?.name}</span>
              <StatusBadge tone={personStatusTone[p.status]}>{statusLabel[p.status]}</StatusBadge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <Repeat />
            انتقال باشگاه
          </Button>
          <Button variant="secondary">
            <Pencil />
            ویرایش
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="مشخصات" />
            <CardBody>
              <DescriptionList
                className="lg:grid-cols-3"
                items={[
                  { term: "تاریخ تولد", value: `${formatDate(p.birthDate)} (${formatNumber(p.age)} ساله)` },
                  { term: "رده سنی", value: p.ageGroup },
                  { term: "جنسیت", value: p.gender === "male" ? "مرد" : "زن" },
                  { term: p.role === "athlete" ? "کمربند" : "درجه", value: p.grade ?? p.belt },
                  ...(p.weightClass ? [{ term: "وزن", value: weightLabel(p.weightClass) }] : []),
                  { term: "عضویت از", value: formatDate(p.memberSince) },
                  { term: "تلفن همراه", value: <bdi dir="ltr">{p.phone}</bdi> },
                  { term: "باشگاه", value: club?.name ?? "—" },
                  { term: "هیئت", value: `هیئت تکواندو ${province?.name ?? ""}` },
                ]}
              />
            </CardBody>
          </Card>

          {p.role === "athlete" ? (
            <Card>
              <CardHeader
                title="امتیاز رنکینگ"
                description={`امتیاز فعلی ${formatNumber(p.rankingPoints)}، ۸ دوره اخیر`}
              />
              <CardBody>
                <TrendChart height={220} data={history} xKey="period" series={[{ key: "points", label: "امتیاز" }]} />
              </CardBody>
            </Card>
          ) : null}

          <Card>
            <CardHeader title="سوابق" description="مسابقات، مدال‌ها، دوره‌ها و مجوزها به ترتیب زمان" />
            <CardBody>
              <Timeline
                items={p.timeline.map((e) => ({
                  id: e.id,
                  title: e.title,
                  detail: e.detail,
                  meta: formatDate(e.date),
                  icon: eventIcon[e.kind],
                  highlight: e.kind === "medal",
                }))}
              />
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardBody className="flex flex-col items-center gap-4">
              <MembershipCard
                title={`کارت عضویت ${roleLabel[p.role]}`}
                name={p.fullName}
                code={p.code}
                validUntil={daysFromNow(212)}
                rows={[
                  { label: "استان", value: province?.name ?? "" },
                  { label: p.role === "athlete" ? "کمربند" : "درجه", value: p.grade ?? p.belt },
                ]}
              />
              <Button variant="secondary" className="w-full">
                چاپ کارت
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="وضعیت پرونده" />
            <CardBody className="flex flex-col gap-4">
              <div>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="text-fg-secondary">تکمیل پرونده</span>
                  <span className="tabular font-medium text-fg">{formatPercent(p.completeness)}</span>
                </div>
                <Progress className="mt-2" value={p.completeness} tone={p.completeness < 80 ? "warning" : "accent"} label="تکمیل پرونده" />
              </div>
              <ul className="flex flex-col divide-y divide-hairline text-sm">
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-fg-secondary">بیمه ورزشی</span>
                  {insuranceValid ? (
                    <StatusBadge tone="positive">معتبر تا {formatDate(p.insuranceExpiry, "short")}</StatusBadge>
                  ) : (
                    <StatusBadge tone="negative">منقضی</StatusBadge>
                  )}
                </li>
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-fg-secondary">معاینه پزشکی</span>
                  <StatusBadge tone={p.medicalStatus === "fit" ? "positive" : "warning"}>{medicalLabel[p.medicalStatus]}</StatusBadge>
                </li>
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-fg-secondary">کارت ملی</span>
                  <StatusBadge tone="positive">تأیید شده</StatusBadge>
                </li>
                <li className="flex items-center justify-between py-2.5">
                  <span className="text-fg-secondary">رضایت‌نامه ولی</span>
                  {p.age < 18 ? <StatusBadge tone="positive">بارگذاری شده</StatusBadge> : <span className="text-fg-muted">لازم نیست</span>}
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
