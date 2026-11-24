import { clubById, me, medicalLabel, pointsHistory, provinceById, weightLabel, type TimelineEvent } from "@varzino/demo-data";
import { TrendChart } from "@varzino/ui/charts/charts";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { DescriptionList, PageHeader, Timeline } from "@varzino/ui/components/data-display";
import { formatDate, formatNumber } from "@varzino/utils";
import { Award, BadgeCheck, GraduationCap, HeartPulse, Repeat, Swords, UserCheck } from "lucide-react";
import type { Metadata } from "next";
import { ProfileEdit } from "@/components/participant/sections";

export const metadata: Metadata = { title: "پرونده من" };

const eventIcon: Record<TimelineEvent["kind"], React.ReactNode> = {
  competition: <Swords />,
  medal: <Award />,
  course: <GraduationCap />,
  license: <BadgeCheck />,
  medical: <HeartPulse />,
  membership: <UserCheck />,
  transfer: <Repeat />,
};

export default function MyProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="پرونده من" description="همان پرونده‌ای که فدراسیون و هیئت می‌بینند" />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="مشخصات" />
            <CardBody>
              <DescriptionList
                items={[
                  { term: "نام", value: me.fullName },
                  { term: "تاریخ تولد", value: formatDate(me.birthDate) },
                  { term: "باشگاه", value: clubById[me.clubId]?.name ?? "—" },
                  { term: "هیئت", value: `هیئت تکواندو ${provinceById[me.provinceId]?.name ?? ""}` },
                  { term: "کمربند", value: me.belt },
                  { term: "وزن", value: weightLabel(me.weightClass) },
                  { term: "عضویت از", value: formatDate(me.memberSince) },
                  { term: "معاینه پزشکی", value: medicalLabel[me.medicalStatus] },
                ]}
              />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="روند امتیاز رنکینگ" description={`امتیاز فعلی ${formatNumber(me.rankingPoints)}`} />
            <CardBody>
              <TrendChart height={220} data={pointsHistory(me)} xKey="period" series={[{ key: "points", label: "امتیاز" }]} />
            </CardBody>
          </Card>
          <ProfileEdit />
        </div>
        <Card className="h-fit">
          <CardHeader title="سوابق" description="مسابقات، مدال‌ها، دوره‌ها و معاینات" />
          <CardBody>
            <Timeline
              items={me.timeline.map((e) => ({
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
    </div>
  );
}
