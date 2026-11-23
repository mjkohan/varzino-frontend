"use client";

import { competitions, modules, people, roleLabel } from "@varzino/demo-data";
import { Kbd } from "@varzino/ui/components/misc";
import { Command } from "cmdk";
import { CornerDownLeft, Search, Trophy, UserRound } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ModuleIcon } from "@varzino/shared/module-icon";

const itemClass =
  "flex h-10 cursor-pointer select-none items-center gap-3 rounded-control px-3 text-sm text-fg data-[selected=true]:bg-raised [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-muted";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-full max-w-sm cursor-pointer items-center gap-2 rounded-control border border-hairline-strong bg-surface px-3 text-sm text-fg-muted shadow-sm transition-colors hover:border-fg-muted/40"
      >
        <Search aria-hidden className="size-4" strokeWidth={1.75} />
        <span className="flex-1 text-start">جست‌وجو</span>
        <span className="hidden items-center gap-1 sm:flex">
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-fg/25 data-[state=open]:animate-[fade-in_180ms_var(--ease)]" />
          <DialogPrimitive.Content className="fixed left-1/2 top-[12vh] z-50 w-[calc(100vw-32px)] max-w-xl -translate-x-1/2 overflow-hidden rounded-panel border border-hairline bg-surface shadow-float data-[state=open]:animate-[dialog-in_200ms_var(--ease)]">
            <DialogPrimitive.Title className="sr-only">جست‌وجو در پنل</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">نام فرد، مسابقه یا بخش را بنویسید</DialogPrimitive.Description>
            <Command label="جست‌وجو در پنل" className="flex flex-col">
              <div className="flex items-center gap-2 border-b border-hairline px-4">
                <Search aria-hidden className="size-4 text-fg-muted" />
                <Command.Input
                  autoFocus
                  placeholder="نام ورزشکار، مسابقه یا بخش"
                  className="h-12 flex-1 bg-transparent text-base text-fg outline-none placeholder:text-fg-muted"
                />
              </div>
              <Command.List className="scrollbar-thin max-h-[56vh] overflow-y-auto p-2">
                <Command.Empty className="px-3 py-8 text-center text-sm text-fg-muted">نتیجه‌ای پیدا نشد</Command.Empty>
                <Command.Group heading="بخش‌ها" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-fg-muted">
                  {modules.map((m) => (
                    <Command.Item key={m.id} value={`${m.title} ${m.fullTitle}`} onSelect={() => go(m.href)} className={itemClass}>
                      <ModuleIcon name={m.icon} />
                      {m.title}
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="مسابقات" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-fg-muted">
                  {competitions.slice(0, 8).map((c) => (
                    <Command.Item key={c.id} value={c.title} onSelect={() => go(`/competitions/${c.id}`)} className={itemClass}>
                      <Trophy />
                      {c.title}
                    </Command.Item>
                  ))}
                </Command.Group>
                <Command.Group heading="اشخاص" className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-fg-muted">
                  {people.slice(0, 40).map((p) => (
                    <Command.Item key={p.id} value={`${p.fullName} ${p.code}`} onSelect={() => go(`/people/${p.id}`)} className={itemClass}>
                      <UserRound />
                      <span className="flex-1">{p.fullName}</span>
                      <span className="text-xs text-fg-muted">{roleLabel[p.role]}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
              <div className="flex items-center gap-2 border-t border-hairline px-4 py-2 text-xs text-fg-muted">
                <CornerDownLeft aria-hidden className="size-3.5" />
                برای باز کردن، Enter
              </div>
            </Command>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
