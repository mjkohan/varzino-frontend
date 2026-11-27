import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { DataProvider } from "@/components/data-provider";
import { redirect } from "next/navigation";
import { getSession, toSessionUser } from "@/lib/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const account = await getSession();
  // The participant role has its own portal.
  if (account.home !== "/") redirect(account.home);
  return (
    <DataProvider user={toSessionUser(account)}>
      <div className="flex min-h-dvh">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main id="main" className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-16 pt-6 md:px-8 md:pt-8">
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  );
}
