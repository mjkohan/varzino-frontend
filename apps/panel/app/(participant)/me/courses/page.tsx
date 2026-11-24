import { PageHeader } from "@varzino/ui/components/data-display";
import type { Metadata } from "next";
import { MyCoursesView } from "@/components/participant/sections";

export const metadata: Metadata = { title: "دوره‌ها و گواهی‌ها" };

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="دوره‌ها و گواهی‌ها" description="ثبت‌نام در دوره‌های آموزشی و دریافت گواهی" />
      <MyCoursesView />
    </div>
  );
}
