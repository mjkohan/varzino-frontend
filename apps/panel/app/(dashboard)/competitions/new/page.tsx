import { PageHeader } from "@varzino/ui/components/data-display";
import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { CompetitionForm } from "@/components/competition-form";

export const metadata: Metadata = { title: "تعریف مسابقه" };

export default function NewCompetitionPage() {
  return (
    <div className="flex flex-col gap-6">
      <BackLink href="/competitions" label="مسابقات" />
      <PageHeader title="تعریف مسابقه" description="مسابقه به‌صورت پیش‌نویس ذخیره می‌شود و تا انتشار، برای هیئت‌ها نمایش داده نمی‌شود." />
      <CompetitionForm />
    </div>
  );
}
