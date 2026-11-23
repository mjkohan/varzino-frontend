import { licensesIssuedTrend, stageDurations } from "@varzino/demo-data";
import { ColumnChart } from "@varzino/ui/charts/charts";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { BarList, PageHeader, Stat } from "@varzino/ui/components/data-display";
import { formatNumber } from "@varzino/utils";
import type { Metadata } from "next";
import { LicensesView } from "@/components/licenses-view";

export const metadata: Metadata = { title: "مجوزها و کارت‌ها" };

export default function LicensesPage() {
  const monthly = licensesIssuedTrend.map((m) => ({ label: m.month, value: m.club + m.coach + m.referee + m.athlete }));
  const last = licensesIssuedTrend[licensesIssuedTrend.length - 1]!;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="مجوزها و کارت‌ها" description="از درخواست باشگاه تا تأیید هیئت و صدور در فدراسیون، در یک مسیر" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="صادرشده در آبان" value={formatNumber(monthly[monthly.length - 1]!.value)} change={{ value: 13.4, against: "مهر" }} />
        <Stat label="کارت مربیگری آبان" value={formatNumber(last.coach)} hint={`${formatNumber(last.referee)} کارت داوری`} />
        <Stat label="میانگین زمان صدور" value="۴٫۵ روز" change={{ value: -38, against: "پیش از سامانه", invert: true }} />
        <Stat label="رو به انقضا در ۳۰ روز" value={formatNumber(412)} hint="یادآوری خودکار ارسال شد" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <Card>
          <CardHeader title="کارت و پروانه صادرشده" description="همه انواع، ۶ ماه اخیر" />
          <CardBody>
            <ColumnChart data={monthly} label="صادرشده" highlight={monthly.length - 1} height={240} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="زمان هر مرحله" description="میانگین روز، آبان" />
          <CardBody>
            <BarList format={(n) => `${n.toLocaleString("fa-IR")} روز`} items={stageDurations.map((s) => ({ key: s.stage, label: s.stage, value: s.days }))} />
          </CardBody>
        </Card>
      </div>
      <LicensesView />
    </div>
  );
}
