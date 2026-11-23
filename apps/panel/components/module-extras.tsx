"use client";

import { conversations, permissionMatrix } from "@varzino/demo-data";
import { Button } from "@varzino/ui/components/button";
import { Card, CardHeader } from "@varzino/ui/components/card";
import { Avatar } from "@varzino/ui/components/misc";
import { cn } from "@varzino/ui/lib/cn";
import { Check, Send } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { toast } from "sonner";

/** Users module: roles × permissions, toggled per cell. */
export function RoleMatrix() {
  const [grants, setGrants] = useState(permissionMatrix.roles.map((r) => [...r.grants]));
  const [dirty, setDirty] = useState(false);

  function toggle(ri: number, pi: number) {
    setGrants((g) => g.map((row, i) => (i === ri ? row.map((v, j) => (j === pi ? (v ? 0 : 1) : v)) : row)));
    setDirty(true);
  }

  return (
    <Card>
      <CardHeader
        title="نقش‌ها و سطوح دسترسی"
        description="برای دادن یا گرفتن یک دسترسی، روی خانه جدول بزنید. دامنه هر نقش (کشور، استان یا باشگاه) جداگانه تعریف می‌شود."
        className="flex-col sm:flex-row"
        action={
          <Button
            variant={dirty ? "primary" : "secondary"}
            disabled={!dirty}
            onClick={() => {
              setDirty(false);
              toast.success("دسترسی نقش‌ها ذخیره شد و در گزارش تغییرات ثبت شد");
            }}
          >
            ذخیره تغییرات
          </Button>
        }
      />
      <div className="scrollbar-thin mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-hairline bg-raised/60">
              <th className="h-10 whitespace-nowrap ps-5 pe-4 text-start text-xs font-medium text-fg-muted">نقش</th>
              {permissionMatrix.permissions.map((p) => (
                <th key={p} className="h-10 min-w-24 px-2 text-center text-xs font-medium leading-5 text-fg-muted">
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {permissionMatrix.roles.map((r, ri) => (
              <tr key={r.role} className="border-b border-hairline last:border-b-0">
                <td className="h-12 whitespace-nowrap ps-5 pe-4 font-medium text-fg">{r.role}</td>
                {permissionMatrix.permissions.map((p, pi) => {
                  const on = grants[ri]?.[pi] === 1;
                  return (
                    <td key={p} className="text-center">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        aria-label={`${r.role}: ${p}`}
                        onClick={() => toggle(ri, pi)}
                        className={cn(
                          "inline-flex size-6 cursor-pointer items-center justify-center rounded-md border transition-colors duration-150",
                          on ? "border-accent bg-accent text-on-accent" : "border-hairline-strong bg-surface hover:bg-raised",
                        )}
                      >
                        {on ? <Check className="size-3.5" strokeWidth={2.5} /> : null}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

type Msg = { from: string; text: string; time: string; mine: boolean };

/** Messaging module: internal messenger between federation units. */
export function Messenger() {
  const [threads, setThreads] = useState(conversations.map((c) => ({ ...c, messages: [...c.messages] as Msg[] })));
  const [activeId, setActiveId] = useState(threads[0]!.id);
  const [draft, setDraft] = useState("");
  const active = threads.find((t) => t.id === activeId)!;

  function send(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setThreads((all) => all.map((t) => (t.id === activeId ? { ...t, messages: [...t.messages, { from: "من", text, time: "اکنون", mine: true }] } : t)));
    setDraft("");
  }

  return (
    <Card>
      <CardHeader title="پیام‌رسان داخلی" description="گفت‌وگو بین کمیته‌ها، هیئت‌ها و دبیرخانه، بدون نیاز به پیام‌رسان‌های عمومی" />
      <div className="mt-4 grid border-t border-hairline md:grid-cols-[240px_minmax(0,1fr)]">
        <ul className="flex flex-col border-hairline p-2 md:border-e">
          {threads.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setActiveId(t.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-control px-3 py-2.5 text-start transition-colors",
                  t.id === activeId ? "bg-raised" : "hover:bg-raised/60",
                )}
              >
                <Avatar name={t.with} size={32} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-fg">{t.with}</span>
                  <span className="block truncate text-xs text-fg-muted">{t.messages[t.messages.length - 1]?.text}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex min-h-80 flex-col">
          <div className="border-b border-hairline px-5 py-3">
            <p className="text-sm font-medium text-fg">{active.with}</p>
            <p className="text-xs text-fg-muted">{active.members}</p>
          </div>
          <ol className="flex flex-1 flex-col gap-3 px-5 py-4">
            {active.messages.map((m, i) => (
              <li key={i} className={cn("flex max-w-[80%] flex-col gap-1", m.mine ? "self-start" : "self-end")}>
                <div
                  className={cn(
                    "rounded-[14px] px-4 py-2.5 text-sm leading-7",
                    m.mine ? "rounded-ss-[4px] bg-accent text-on-accent" : "rounded-se-[4px] bg-raised text-fg",
                  )}
                >
                  {m.text}
                </div>
                <span className={cn("text-[11px] text-fg-muted", m.mine ? "text-start" : "text-end")}>
                  {m.mine ? "" : `${m.from}، `}
                  {m.time}
                </span>
              </li>
            ))}
          </ol>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-hairline p-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="پیام"
              aria-label="متن پیام"
              className="h-10 flex-1 rounded-control border border-hairline-strong bg-surface px-3 text-sm text-fg placeholder:text-fg-muted focus-visible:border-accent focus-visible:outline-none"
            />
            <Button type="submit" size="icon" aria-label="ارسال" disabled={!draft.trim()}>
              <Send className="icon-dir" />
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
}
