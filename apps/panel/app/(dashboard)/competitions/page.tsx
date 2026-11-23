import { competitions } from "@varzino/demo-data";
import { Button } from "@varzino/ui/components/button";
import { PageHeader, Stat } from "@varzino/ui/components/data-display";
import { formatNumber } from "@varzino/utils";
import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CompetitionsList } from "@/components/competitions-list";

export const metadata: Metadata = { title: "مسابقات" };

export default function CompetitionsPage() {
  const open = competitions.filter((c) => c.status === "registration");
  const registered = competitions.filter((c) => c.status !== "draft" && c.status !== "finished").reduce((s, c) => s + c.registered, 0);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="مسابقات"
        description="تقویم مسابقات کشوری و استانی، ثبت‌نام، جدول و نتایج"
        actions={
          <Button asChild>
            <Link href="/competitions/new">
              <Plus />
              تعریف مسابقه
            </Link>
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="مسابقات امسال" value={formatNumber(competitions.length)} hint="کشوری، استانی و لیگ" />
        <Stat label="ثبت‌نام باز" value={formatNumber(open.length)} hint="مهلت نزدیک: ۸ روز دیگر" />
        <Stat label="ثبت‌نام‌شدگان مسابقات جاری" value={formatNumber(registered)} change={{ value: 14.2, against: "دوره مشابه پارسال" }} />
        <Stat label="داوران منصوب‌شده" value={formatNumber(competitions.reduce((s, c) => s + c.referees, 0))} hint="در همه مسابقات امسال" />
      </div>
      <CompetitionsList />
    </div>
  );
}
