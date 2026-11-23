"use client";

import { demoRoles } from "@varzino/demo-data";
import { Button } from "@varzino/ui/components/button";
import { cn } from "@varzino/ui/lib/cn";
import { Building, Building2, Landmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const icons = { federation: Landmark, board: Building2, club: Building } as const;

export function RolePicker() {
  const [selected, setSelected] = useState(demoRoles[0]!.id);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  function enter() {
    setPending(true);
    document.cookie = `varzino-role=${selected}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    router.push("/");
  }

  return (
    <div className="mt-8">
      <fieldset>
        <legend className="sr-only">نقش کاربر</legend>
        <div className="flex flex-col gap-2">
          {demoRoles.map((r) => {
            const Icon = icons[r.id as keyof typeof icons] ?? Building;
            const active = selected === r.id;
            return (
              <label
                key={r.id}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-card border bg-surface p-4 transition-colors duration-150",
                  active ? "border-accent ring-3 ring-accent/10" : "border-hairline hover:border-hairline-strong",
                )}
              >
                <input
                  type="radio"
                  name="role"
                  value={r.id}
                  checked={active}
                  onChange={() => setSelected(r.id)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-[10px] border",
                    active ? "border-accent/20 bg-accent-soft text-accent-ink" : "border-hairline bg-bg text-fg-muted",
                  )}
                >
                  <Icon aria-hidden className="size-[18px]" strokeWidth={1.6} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="font-medium text-fg">{r.title}</span>
                    <span className="text-sm text-fg-muted">{r.scope}</span>
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-fg-secondary">{r.description}</span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-1 flex size-4 shrink-0 items-center justify-center rounded-full border",
                    active ? "border-accent" : "border-hairline-strong",
                  )}
                >
                  {active ? <span className="size-2 rounded-full bg-accent" /> : null}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <Button size="xl" className="mt-6 w-full" onClick={enter} disabled={pending}>
        {pending ? "در حال ورود…" : "ورود به پنل"}
      </Button>
    </div>
  );
}
