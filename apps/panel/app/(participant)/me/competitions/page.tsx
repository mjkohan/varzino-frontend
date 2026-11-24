import { PageHeader } from "@varzino/ui/components/data-display";
import type { Metadata } from "next";
import { Suspense } from "react";
import { MyCompetitions } from "@/components/participant/competitions";

export const metadata: Metadata = { title: "مسابقات من" };

export default function MyCompetitionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="مسابقات" description="ثبت‌نام آنلاین، پرداخت ورودیه و پیگیری نتیجه" />
      <Suspense>
        <MyCompetitions />
      </Suspense>
    </div>
  );
}
