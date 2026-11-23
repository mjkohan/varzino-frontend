import { Button } from "@varzino/ui/components/button";
import { PageHeader } from "@varzino/ui/components/data-display";
import { Download } from "lucide-react";
import type { Metadata } from "next";
import { RankingView } from "@/components/ranking-view";

export const metadata: Metadata = { title: "رنکینگ" };

export default function RankingPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="رنکینگ کشوری"
        description="بزرگسالان، به‌روز شده پس از قهرمانی کشور جوانان پسران"
        actions={
          <Button variant="secondary">
            <Download />
            خروجی PDF
          </Button>
        }
      />
      <RankingView />
    </div>
  );
}
