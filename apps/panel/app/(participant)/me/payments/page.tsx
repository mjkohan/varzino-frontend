import { PageHeader } from "@varzino/ui/components/data-display";
import type { Metadata } from "next";
import { MyPaymentsView } from "@/components/participant/sections";

export const metadata: Metadata = { title: "پرداخت‌ها" };

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="پرداخت‌ها" description="کیف پول و سابقه پرداخت‌ها" />
      <MyPaymentsView />
    </div>
  );
}
