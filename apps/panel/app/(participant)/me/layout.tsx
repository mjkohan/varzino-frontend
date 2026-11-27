import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ParticipantHeader } from "@/components/participant/nav";
import { DataProvider } from "@/components/data-provider";
import { getSession, toSessionUser } from "@/lib/session";

export const metadata: Metadata = { title: { default: "پرتال ورزشکاران", template: "%s | پرتال ورزشکاران ورزینو" } };

export default async function ParticipantLayout({ children }: { children: React.ReactNode }) {
  const account = await getSession();
  // Staff accounts use the panel, not the participant portal.
  if (account.home !== "/me") redirect(account.home);
  return (
    <DataProvider user={toSessionUser(account)}>
      <div className="min-h-dvh">
        <ParticipantHeader />
        <main className="mx-auto w-full max-w-[1120px] px-4 pb-16 pt-6 md:px-8 md:pt-8">{children}</main>
      </div>
    </DataProvider>
  );
}
