"use client";

import { cn } from "@varzino/ui/lib/cn";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@varzino/shared/logo";
import { ModuleIcon } from "@varzino/shared/module-icon";
import { navGroups } from "./nav";

function NavLink({ href, active, children, onNavigate }: { href: string; active: boolean; children: React.ReactNode; onNavigate?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex h-9 items-center gap-2.5 rounded-control px-2.5 text-sm transition-colors duration-150",
        active ? "bg-surface font-medium text-fg shadow-sm ring-1 ring-hairline" : "text-fg-secondary hover:bg-black/[0.035] hover:text-fg",
      )}
    >
      {children}
    </Link>
  );
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="منوی پنل" className="flex flex-col">
      <NavLink href="/" active={pathname === "/"} onNavigate={onNavigate}>
        <LayoutDashboard aria-hidden className="size-[18px] text-fg-muted" strokeWidth={1.6} />
        پیشخوان
      </NavLink>
      {navGroups.map((g) => (
        <div key={g.id} className="mt-6">
          <p className="mb-2 px-2.5 text-xs text-fg-muted">{g.title}</p>
          <ul className="flex flex-col gap-0.5">
            {g.items.map((m) => {
              const active = pathname === m.href || pathname.startsWith(`${m.href}/`);
              return (
                <li key={m.id}>
                  <NavLink href={m.href} active={active} onNavigate={onNavigate}>
                    <ModuleIcon name={m.icon} className={cn("size-[18px]", active ? "text-accent-ink" : "text-fg-muted")} />
                    <span className="flex-1 truncate">{m.title}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-[264px] shrink-0 flex-col border-e border-hairline bg-raised/70 lg:flex">
      <div className="flex h-16 items-center px-5">
        <Link href="/" aria-label="ورزینو، پیشخوان">
          <Logo />
        </Link>
      </div>
      <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-6 pt-2">
        <SidebarNav />
      </div>
      <div className="border-t border-hairline px-5 py-3 text-xs text-fg-muted">نسخه نمایشی، داده‌ها ساختگی است</div>
    </aside>
  );
}
