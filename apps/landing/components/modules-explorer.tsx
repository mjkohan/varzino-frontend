"use client";

import { modulesByPillar, pillars } from "@varzino/demo-data";
import { Tabs, TabsContent } from "@varzino/ui/components/overlays";
import { cn } from "@varzino/ui/lib/cn";
import { toPersianDigits } from "@varzino/utils";
import { Tabs as TabsPrimitive } from "radix-ui";
import { ModuleIcon } from "@varzino/shared/module-icon";
import { SectionHeading } from "./heading";

export function ModulesExplorer() {
  return (
    <section id="modules" className="scroll-mt-20 border-t border-hairline bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <SectionHeading
          title="۱۹ زیرسامانه، در پنج حوزه کاری فدراسیون"
          lead="فهرست فاز اول، همان موارد منتخب از سند نیازمندی‌ها برای فدراسیون‌ها و هیئت‌های زیرمجموعه است."
        />
        <Tabs defaultValue={pillars[0]!.id} orientation="vertical" className="mt-12 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-12">
          <TabsPrimitive.List
            aria-label="حوزه‌های کاری"
            className="scrollbar-thin -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
          >
            {pillars.map((p) => (
              <TabsPrimitive.Trigger
                key={p.id}
                value={p.id}
                className={cn(
                  "group flex shrink-0 cursor-pointer items-center justify-between gap-4 rounded-[12px] border border-hairline px-4 py-3 text-start transition-colors duration-150 lg:border-transparent",
                  "hover:bg-raised data-[state=active]:border-hairline data-[state=active]:bg-raised",
                )}
              >
                <span className="text-sm font-medium text-fg-secondary group-data-[state=active]:text-fg lg:text-base">{p.title}</span>
                <span className="tabular hidden text-sm text-fg-muted lg:inline">{toPersianDigits(modulesByPillar(p.id).filter((m) => m.id !== "ranking").length)}</span>
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          {pillars.map((p) => (
            <TabsContent key={p.id} value={p.id} className="focus-visible:outline-none data-[state=active]:animate-[fade-in_220ms_var(--ease)]">
              <p className="mb-6 text-lg text-fg-secondary">{p.summary}</p>
              <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
                {modulesByPillar(p.id)
                  .filter((m) => m.id !== "ranking")
                  .map((m) => (
                  <article key={m.id} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-hairline bg-bg text-fg-secondary">
                      <ModuleIcon name={m.icon} className="size-[18px]" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-medium text-fg">{m.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-fg-secondary">{m.summary}</p>
                      <ul className="mt-3 flex flex-col gap-1.5">
                        {m.capabilities.map((c) => (
                          <li key={c} className="flex gap-2 text-sm text-fg-muted">
                            <span aria-hidden className="mt-2.5 h-px w-2 shrink-0 bg-fg-muted/60" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
