import { trackLabel } from "@varzino/demo-data";
import { Button } from "@varzino/ui/components/button";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { BarList, PageHeader, Stat } from "@varzino/ui/components/data-display";
import { formatNumber, formatPercent } from "@varzino/utils";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import { EducationView } from "@/components/education-view";
import { getData } from "@/lib/session";

export const metadata: Metadata = { title: "آموزش" };

export default async function EducationPage() {
  const { trackStats } = await getData();
  const learners = trackStats.reduce((s, t) => s + t.learners, 0);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="آموزش و ارتقای صلاحیت"
        description="دوره‌های مربیگری، داوری، پزشکی و مدیریت، با آزمون و گواهی قابل استعلام"
        actions={
          <Button>
            <Plus />
            تعریف دوره
          </Button>
        }
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-2">
          <Stat label="فراگیران امسال" value={formatNumber(learners)} change={{ value: 11.2, against: "سال قبل" }} />
          <Stat label="دوره‌های در جریان" value={formatNumber(2)} hint="۷۳ فراگیر" />
          <Stat label="گواهی صادرشده امسال" value={formatNumber(3420)} hint="۱۸ مورد در صف صدور" />
          <Stat label="میانگین نمره قبولی" value="۸۴٫۶" hint="از ۱۰۰" />
        </div>
        <Card>
          <CardHeader title="نرخ قبولی به تفکیک حوزه" description="امسال" />
          <CardBody>
            <BarList
              format={(n) => formatPercent(n)}
              items={trackStats.map((t) => ({ key: t.track, label: trackLabel[t.track], value: t.passRate, meta: `${formatNumber(t.learners)} نفر` }))}
            />
          </CardBody>
        </Card>
      </div>
      <EducationView />
    </div>
  );
}
