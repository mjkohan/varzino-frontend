"use client";

import { categoryLabel, levelLabel, type Competition, type MyRegistration } from "@varzino/demo-data";
import { StatusBadge } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card, CardHeader } from "@varzino/ui/components/card";
import { Stepper, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { Dialog, DialogContent } from "@varzino/ui/components/overlays";
import { cn } from "@varzino/ui/lib/cn";
import { formatDate, formatNumber, formatToman } from "@varzino/utils";
import { CircleAlert, CircleCheck, CreditCard, Wallet } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useData } from "@/components/data-provider";

const statusTone = { "pending-payment": "warning", registered: "info", weighed: "accent", finished: "neutral" } as const;

function RegisterDialog({ c, onClose, onDone }: { c: Competition; onClose: () => void; onDone: (r: MyRegistration) => void }) {
  const { me, myWallet, profile } = useData();
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<"wallet" | "gateway">("wallet");
  const fee = c.fee;
  const enough = myWallet.balance >= fee;

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent title={`ثبت‌نام: ${c.title}`} description={`${levelLabel[c.level]}، ${formatDate(c.startDate)}، ${c.city}`}>
        <div className="flex flex-col gap-6">
          <Stepper steps={[{ label: "بررسی شرایط" }, { label: "پرداخت ورودیه" }, { label: "ثبت‌نام قطعی" }]} current={step} />

          {step === 0 ? (
            <>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-fg-muted">{profile.categoryTitle}</dt>
                  <dd className="mt-0.5 text-fg">{categoryLabel(me.category)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-fg-muted">رده</dt>
                  <dd className="mt-0.5 text-fg">{c.ageGroup}</dd>
                </div>
              </dl>
              <ul className="flex flex-col divide-y divide-hairline rounded-card border border-hairline text-sm">
                {[
                  { t: "کارت عضویت معتبر", ok: true },
                  { t: profile.impairments ? "کلاس‌بندی پزشکی معتبر" : "معاینه پزشکی کمتر از ۶ ماه", ok: true },
                  { t: "بیمه ورزشی تا روز مسابقه معتبر است", ok: true },
                  { t: "تأیید مربی باشگاه", ok: true },
                ].map((x) => (
                  <li key={x.t} className="flex items-center gap-3 px-4 py-3">
                    {x.ok ? <CircleCheck className="size-4 text-positive" /> : <CircleAlert className="size-4 text-warning" />}
                    {x.t}
                  </li>
                ))}
              </ul>
              <Button onClick={() => setStep(1)}>ادامه و پرداخت</Button>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <div className="flex items-baseline justify-between rounded-card bg-raised px-4 py-3">
                <span className="text-sm text-fg-secondary">ورودیه</span>
                <span className="tabular text-lg font-medium text-fg">{formatToman(fee)}</span>
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium text-fg">روش پرداخت</legend>
                {[
                  { id: "wallet" as const, icon: Wallet, title: "کیف پول", meta: `موجودی ${formatToman(myWallet.balance)}`, disabled: !enough },
                  { id: "gateway" as const, icon: CreditCard, title: "درگاه پرداخت بانکی", meta: "کارت‌های عضو شتاب", disabled: false },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-card border p-3 transition-colors",
                      method === m.id ? "border-accent ring-3 ring-accent/10" : "border-hairline hover:border-hairline-strong",
                      m.disabled && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <input type="radio" name="pay" className="sr-only" disabled={m.disabled} checked={method === m.id} onChange={() => setMethod(m.id)} />
                    <m.icon aria-hidden className="size-5 text-fg-muted" strokeWidth={1.6} />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-fg">{m.title}</span>
                      <span className="block text-xs text-fg-muted">{m.meta}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <div className="flex gap-2">
                <Button onClick={() => setStep(2)}>پرداخت {formatToman(fee)}</Button>
                <Button variant="ghost" onClick={() => setStep(0)}>
                  مرحله قبل
                </Button>
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                  <CircleCheck className="size-6" />
                </span>
                <p className="text-lg font-medium text-fg">ثبت‌نام شما قطعی شد</p>
                <p className="text-sm text-fg-secondary">زمان {profile.checkIn} و قرعه‌کشی از طریق اعلان و پیامک به شما اطلاع داده می‌شود.</p>
              </div>
              <Button
                onClick={() => {
                  onDone({ id: `new-${c.id}`, competition: c, weight: me.category ?? "", status: "registered" });
                  toast.success("ثبت‌نام قطعی شد");
                }}
              >
                بازگشت به مسابقات من
              </Button>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MyCompetitions() {
  const { myRegistrationStatusLabel, myRegistrations, openForMe, profile } = useData();
  const params = useSearchParams();
  const [mine, setMine] = useState<MyRegistration[]>(myRegistrations);
  const [registering, setRegistering] = useState<Competition | null>(() => openForMe.find((c) => c.id === params.get("register")) ?? null);
  const open = openForMe.filter((c) => !mine.some((m) => m.competition.id === c.id));

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title="ثبت‌نام‌های من" description={`وضعیت ثبت‌نام، ${profile.checkIn} و نتیجه`} />
        <Table className="mt-4">
          <THead>
            <TH>مسابقه</TH>
            <TH>تاریخ</TH>
            <TH>{profile.categoryTitle}</TH>
            <TH>نتیجه</TH>
            <TH>وضعیت</TH>
          </THead>
          <tbody>
            {mine.map((r) => (
              <TR key={r.id}>
                <TD>
                  <p className="font-medium text-fg">{r.competition.title}</p>
                  <p className="text-xs text-fg-muted">{r.competition.city}</p>
                </TD>
                <TD className="text-fg-secondary">{formatDate(r.competition.startDate)}</TD>
                <TD className="text-fg-secondary">{categoryLabel(r.weight)}</TD>
                <TD className="text-fg-secondary">
                  {r.result ? (
                    <>
                      {r.result}
                      {r.points ? (
                        <span className="ms-2 text-xs text-positive">
                          <bdi dir="ltr">+{formatNumber(r.points)}</bdi> امتیاز
                        </span>
                      ) : null}
                    </>
                  ) : (
                    "—"
                  )}
                </TD>
                <TD>
                  <StatusBadge tone={statusTone[r.status]}>{myRegistrationStatusLabel[r.status]}</StatusBadge>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader title="مسابقات باز برای ثبت‌نام" description="فقط مسابقاتی که با رشته، بخش و رده سنی شما جور است" />
        <ul className="mt-2 flex flex-col px-5 pb-3">
          {open.map((c) => (
            <li key={c.id} className="flex flex-col gap-3 border-b border-hairline py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-fg">{c.title}</p>
                <p className="text-sm text-fg-muted">
                  {levelLabel[c.level]}، {formatDate(c.startDate)}، {c.venue}، {c.city}
                </p>
                <p className="text-xs text-fg-muted">
                  مهلت ثبت‌نام {formatDate(c.registrationDeadline, "dayMonth")}، ورودیه {formatToman(c.fee)}
                </p>
              </div>
              <Button className="shrink-0" onClick={() => setRegistering(c)}>
                ثبت‌نام
              </Button>
            </li>
          ))}
          {open.length === 0 ? <li className="py-8 text-center text-sm text-fg-muted">فعلاً مسابقه بازی برای شما نیست.</li> : null}
        </ul>
      </Card>

      {registering ? (
        <RegisterDialog
          c={registering}
          onClose={() => setRegistering(null)}
          onDone={(r) => {
            setMine((all) => [r, ...all]);
            setRegistering(null);
          }}
        />
      ) : null}
    </div>
  );
}
