"use client";

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
import { Bell, LogOut, Menu, X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@varzino/shared/logo";
import { CommandMenu } from "./command-menu";
import { SidebarNav } from "./sidebar";
import { LANDING_URL } from "@varzino/shared/urls";
import { logout } from "@/app/login/actions";
import { useData, useSessionUser } from "./data-provider";

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

export function Topbar() {
  const user = useSessionUser();
  const { approvals } = useData();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-hairline bg-bg/90 px-4 backdrop-blur-md md:px-8">
      <MobileNav />

      <div className="flex h-10 min-w-0 items-center px-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium leading-5 text-fg">{user.scope}</p>
          <p className="hidden truncate text-xs leading-4 text-fg-muted sm:block">{user.title}</p>
        </div>
      </div>

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
              <Avatar name={user.name} size={34} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            <div className="px-2.5 py-2">
              <p className="text-sm font-medium text-fg">{user.name}</p>
              <p className="text-xs text-fg-muted">{user.title}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={LANDING_URL}>صفحه معرفی ورزینو</a>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void logout()}>
              <LogOut className="icon-dir" />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
