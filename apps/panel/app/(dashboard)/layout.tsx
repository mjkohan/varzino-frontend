import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { getDemoRole } from "@/lib/role";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const role = await getDemoRole();
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar role={role} />
        <main id="main" className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-16 pt-6 md:px-8 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
