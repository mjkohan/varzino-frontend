import { PageHeader } from "@varzino/ui/components/data-display";
import type { Metadata } from "next";
import { MyCardView } from "@/components/participant/sections";

export const metadata: Metadata = { title: "کارت عضویت" };

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="کارت عضویت" description="کارت، تمدید عضویت، بیمه و مدارک" />
      <MyCardView />
    </div>
  );
}
