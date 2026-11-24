import type { Metadata } from "next";
import { ParticipantHeader } from "@/components/participant/nav";

export const metadata: Metadata = { title: { default: "پرتال ورزشکاران", template: "%s | پرتال ورزشکاران ورزینو" } };

export default function ParticipantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <ParticipantHeader />
      <main className="mx-auto w-full max-w-[1120px] px-4 pb-16 pt-6 md:px-8 md:pt-8">{children}</main>
    </div>
  );
}
