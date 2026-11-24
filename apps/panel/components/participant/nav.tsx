"use client";

import { me, myNotifications } from "@varzino/demo-data";
import { Button } from "@varzino/ui/components/button";
import { Avatar } from "@varzino/ui/components/misc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@varzino/ui/components/overlays";
import { cn } from "@varzino/ui/lib/cn";
import { Logo } from "@varzino/shared/logo";
import { LANDING_URL } from "@varzino/shared/urls";
import { formatRelative } from "@varzino/utils";
import { Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/me", label: "خانه" },
  { href: "/me/competitions", label: "مسابقات" },
  { href: "/me/courses", label: "دوره‌ها" },
  { href: "/me/card", label: "کارت عضویت" },
  { href: "/me/payments", label: "پرداخت‌ها" },
  { href: "/me/profile", label: "پرونده من" },
];

export function ParticipantHeader() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-hairline bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-3">
          <Link href="/me" aria-label="ورزینو، خانه">
            <Logo />
          </Link>
          <span className="hidden text-sm text-fg-muted sm:inline">پرتال ورزشکاران</span>
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative" aria-label="اعلان‌ها">
                <Bell />
                <span aria-hidden className="absolute end-2 top-2 size-2 rounded-full border-2 border-bg bg-negative" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80">
              <DropdownMenuLabel>اعلان‌ها</DropdownMenuLabel>
              {myNotifications.slice(0, 3).map((n) => (
                <DropdownMenuItem key={n.id} className="h-auto items-start py-2">
                  <span className="flex flex-col">
                    <span className="text-sm text-fg">{n.title}</span>
                    <span className="text-xs text-fg-muted">{formatRelative(n.at)}</span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label="حساب کاربری" className="ms-1 cursor-pointer rounded-full transition-opacity hover:opacity-85">
                <Avatar name={me.fullName} size={34} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              <div className="px-2.5 py-2">
                <p className="text-sm font-medium text-fg">{me.fullName}</p>
                <p className="text-xs text-fg-muted">ورزشکار</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={LANDING_URL}>صفحه معرفی ورزینو</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/login">
                  <LogOut className="icon-dir" />
                  ورود با نقش دیگر
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <nav aria-label="بخش‌های پرتال" className="mx-auto max-w-[1120px] px-4 md:px-8">
        <ul className="scrollbar-thin -mb-px flex gap-1 overflow-x-auto">
          {links.map((l) => {
            const active = l.href === "/me" ? pathname === "/me" : pathname.startsWith(l.href);
            return (
              <li key={l.href} className="shrink-0">
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-11 items-center border-b-2 px-3 text-sm transition-colors duration-150",
                    active ? "border-accent font-medium text-fg" : "border-transparent text-fg-muted hover:text-fg",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
