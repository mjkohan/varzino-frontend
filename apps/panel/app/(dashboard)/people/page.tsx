import { nationalTotals, people } from "@varzino/demo-data";
import { Button } from "@varzino/ui/components/button";
import { PageHeader, Stat } from "@varzino/ui/components/data-display";
import { formatNumber } from "@varzino/utils";
import { Upload, UserPlus } from "lucide-react";
import type { Metadata } from "next";
import { PeopleList } from "@/components/people-list";

export const metadata: Metadata = { title: "پرونده اشخاص" };

export default function PeoplePage() {
  const pending = people.filter((p) => p.status === "pending").length;
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="پرونده اشخاص"
        description="ورزشکاران، مربیان و داوران با یک کد عضویت در سراسر کشور"
        actions={
          <>
            <Button variant="secondary">
              <Upload />
              ورود از اکسل
            </Button>
            <Button>
              <UserPlus />
              ثبت فرد جدید
            </Button>
          </>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="ورزشکاران" value={formatNumber(nationalTotals.athletes)} change={{ value: 6.4, against: "سال قبل" }} />
        <Stat label="مربیان دارای کارت" value={formatNumber(nationalTotals.coaches)} hint="۹۴٪ کارت معتبر" />
        <Stat label="داوران" value={formatNumber(nationalTotals.referees)} hint="درجه ۳ تا بین‌المللی" />
        <Stat label="در انتظار تأیید عضویت" value={formatNumber(pending * 23)} hint="در صف بررسی هیئت‌ها" />
      </div>
      <PeopleList />
    </div>
  );
}
