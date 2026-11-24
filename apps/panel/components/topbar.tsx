"use client";

import { approvals, demoRoles, type DemoRole } from "@varzino/demo-data";
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
import { formatNumber, formatRelative } from "@varzino/utils";
import { Bell, Check, ChevronsUpDown, LogOut, Menu, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@varzino/shared/logo";
import { CommandMenu } from "./command-menu";
import { SidebarNav } from "./sidebar";
import { LANDING_URL } from "@varzino/shared/urls";

const DEMO_PEOPLE: Record<string, string> = {
  federation: "محمدرضا کاظمی",
  board: "سارا کریمی",
  club: "بهنام عباسی",
};

function setRole(id: string) {
  document.cookie = `varzino-role=${id}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
}

function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="باز کردن منو">
          <Menu />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-fg/30 data-[state=open]:animate-[fade-in_200ms_var(--ease)]" />
        <DialogPrimitive.Content className="fixed inset-y-0 start-0 z-50 flex w-[288px] max-w-[85vw] flex-col border-e border-hairline bg-bg data-[state=open]:animate-[sheet-in_300ms_var(--ease)] [--dir:1] rtl:[--dir:1]">
          <DialogPrimitive.Title className="sr-only">منوی پنل</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">بخش‌های پنل ورزینو</DialogPrimitive.Description>
          <div className="flex h-16 items-center justify-between px-5">
            <Logo />
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon-sm" aria-label="بستن منو">
                <X />
              </Button>
            </DialogPrimitive.Close>
          </div>
          <div className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-6">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function Topbar({ role }: { role: DemoRole }) {
  const router = useRouter();
  const userName = DEMO_PEOPLE[role.id] ?? "کاربر نمایشی";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hairline bg-bg/90 px-4 backdrop-blur-md md:px-8">
      <MobileNav />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex h-10 min-w-0 cursor-pointer items-center gap-2 rounded-control px-2 text-start transition-colors hover:bg-raised"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-5 text-fg">{role.scope}</p>
              <p className="hidden truncate text-xs leading-4 text-fg-muted sm:block">{role.title}</p>
            </div>
            <ChevronsUpDown aria-hidden className="size-4 shrink-0 text-fg-muted" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          <DropdownMenuLabel>ورود با نقش دیگر</DropdownMenuLabel>
          {demoRoles.map((r) => (
            <DropdownMenuItem
              key={r.id}
              onSelect={() => {
                setRole(r.id);
                if (r.home !== "/") router.push(r.home);
                else router.refresh();
              }}
              className="h-auto items-start py-2"
            >
              <span className="mt-0.5 flex size-4 items-center justify-center">{r.id === role.id ? <Check /> : null}</span>
              <span className="flex flex-col">
                <span className="font-medium">{r.title}</span>
                <span className="text-xs text-fg-muted">{r.scope}</span>
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-1 justify-center px-2">
        <div className="hidden w-full max-w-sm md:block">
          <CommandMenu />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`اعلان‌ها، ${formatNumber(approvals.length)} مورد در انتظار`} className="relative">
              <Bell />
              <span aria-hidden className="absolute end-2 top-2 size-2 rounded-full border-2 border-bg bg-negative" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <DropdownMenuLabel>در انتظار تأیید شما</DropdownMenuLabel>
            {approvals.slice(0, 4).map((a) => (
              <DropdownMenuItem key={a.id} asChild className="h-auto items-start py-2">
                <Link href={a.href}>
                  <span className="flex flex-col">
                    <span className="text-sm text-fg">{a.title}</span>
                    <span className="text-xs text-fg-muted">
                      {a.from}، {formatRelative(a.waitingSince)}
                    </span>
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label="حساب کاربری" className={cn("ms-1 cursor-pointer rounded-full transition-opacity hover:opacity-85")}>
              <Avatar name={userName} size={34} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <div className="px-2.5 py-2">
              <p className="text-sm font-medium text-fg">{userName}</p>
              <p className="text-xs text-fg-muted">{role.title}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={LANDING_URL}>صفحه معرفی ورزینو</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogOut className="icon-dir" />
                خروج از نسخه نمایشی
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
