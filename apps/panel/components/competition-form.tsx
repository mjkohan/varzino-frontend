"use client";

import { levelLabel, scoringRules, type CompetitionLevel } from "@varzino/demo-data";
import { Button } from "@varzino/ui/components/button";
import { Card } from "@varzino/ui/components/card";
import { DescriptionList, Stepper } from "@varzino/ui/components/data-display";
import { Field, Input, NativeSelect, Textarea } from "@varzino/ui/components/input";
import { cn } from "@varzino/ui/lib/cn";
import { formatNumber, toPersianDigits } from "@varzino/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const steps = [{ label: "مشخصات" }, { label: "اوزان و رده" }, { label: "ثبت‌نام و هزینه" }, { label: "بازبینی" }];

const maleWeights = ["−۵۴", "−۵۸", "−۶۳", "−۶۸", "−۷۴", "−۸۰", "−۸۷", "+۸۷"];
const femaleWeights = ["−۴۶", "−۴۹", "−۵۳", "−۵۷", "−۶۲", "−۶۷", "−۷۳", "+۷۳"];

type Form = {
  title: string;
  level: CompetitionLevel;
  city: string;
  venue: string;
  start: string;
  days: string;
  ageGroup: string;
  gender: "male" | "female" | "mixed";
  weights: string[];
  capacity: string;
  fee: string;
  deadline: string;
  notes: string;
};

const initial: Form = {
  title: "",
  level: "national",
  city: "",
  venue: "",
  start: "۱۴۰۵/۱۰/۱۵",
  days: "۲",
  ageGroup: "بزرگسالان",
  gender: "male",
  weights: maleWeights,
  capacity: "۳۲۰",
  fee: "۳۰۰٬۰۰۰",
  deadline: "۱۴۰۵/۱۰/۰۵",
  notes: "",
};

export function CompetitionForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const router = useRouter();
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const rule = scoringRules.find((r) => (form.level === "national" || form.level === "selection" ? r.level.startsWith("قهرمانی کشور") : form.level === "league" ? r.level.startsWith("لیگ") : form.level === "provincial" ? r.level.startsWith("قهرمانی استان") : r.level.startsWith("رقابت")));
  const weightOptions = form.gender === "female" ? femaleWeights : maleWeights;

  function next() {
    if (step === 0) {
      const e: typeof errors = {};
      if (!form.title.trim()) e.title = "عنوان مسابقه را بنویسید";
      if (!form.city.trim()) e.city = "شهر محل برگزاری را بنویسید";
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    if (step === 1 && form.weights.length === 0) {
      setErrors({ weights: "حداقل یک وزن را انتخاب کنید" });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function submit() {
    toast.success("مسابقه به‌صورت پیش‌نویس ذخیره شد", { description: "برای باز کردن ثبت‌نام، آن را از فهرست مسابقات منتشر کنید." });
    router.push("/competitions");
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <div className="border-b border-hairline px-5 py-6 md:px-8">
        <Stepper steps={steps} current={step} />
      </div>
      <div className="px-5 py-6 md:px-8">
        {step === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="عنوان مسابقه" htmlFor="title" error={errors.title} className="sm:col-span-2">
              <Input id="title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="مثلاً قهرمانی کشور نوجوانان" aria-invalid={!!errors.title} />
            </Field>
            <Field label="رده مسابقه" htmlFor="level" hint="ضریب امتیاز رنکینگ از همین رده می‌آید">
              <NativeSelect id="level" value={form.level} onChange={(e) => set("level", e.target.value as CompetitionLevel)}>
                {(Object.keys(levelLabel) as CompetitionLevel[]).map((l) => (
                  <option key={l} value={l}>
                    {levelLabel[l]}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="شهر" htmlFor="city" error={errors.city}>
              <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} aria-invalid={!!errors.city} />
            </Field>
            <Field label="سالن" htmlFor="venue" hint="از فهرست اماکن استاندارد هم می‌توانید انتخاب کنید">
              <Input id="venue" value={form.venue} onChange={(e) => set("venue", e.target.value)} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="تاریخ شروع" htmlFor="start">
                <Input id="start" value={form.start} onChange={(e) => set("start", e.target.value)} dir="ltr" className="text-end" />
              </Field>
              <Field label="مدت (روز)" htmlFor="days">
                <Input id="days" value={form.days} onChange={(e) => set("days", e.target.value)} inputMode="numeric" dir="ltr" className="text-end" />
              </Field>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="flex flex-col gap-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="رده سنی" htmlFor="age">
                <NativeSelect id="age" value={form.ageGroup} onChange={(e) => set("ageGroup", e.target.value)}>
                  {["نونهالان", "نوجوانان", "جوانان", "بزرگسالان"].map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </NativeSelect>
              </Field>
              <Field label="بخش" htmlFor="gender">
                <NativeSelect
                  id="gender"
                  value={form.gender}
                  onChange={(e) => {
                    const g = e.target.value as Form["gender"];
                    setForm((f) => ({ ...f, gender: g, weights: g === "female" ? femaleWeights : maleWeights }));
                  }}
                >
                  <option value="male">آقایان</option>
                  <option value="female">بانوان</option>
                  <option value="mixed">آقایان و بانوان</option>
                </NativeSelect>
              </Field>
            </div>
            <fieldset>
              <legend className="text-sm font-medium text-fg">اوزان (کیلوگرم)</legend>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
                {weightOptions.map((w) => {
                  const on = form.weights.includes(w);
                  return (
                    <button
                      key={w}
                      type="button"
                      aria-pressed={on}
                      onClick={() => set("weights", on ? form.weights.filter((x) => x !== w) : [...form.weights, w])}
                      className={cn(
                        "tabular h-10 cursor-pointer rounded-control border text-sm transition-colors duration-150",
                        on ? "border-accent bg-accent-soft font-medium text-accent-ink" : "border-hairline-strong bg-surface text-fg-secondary hover:bg-raised",
                      )}
                    >
                      {w.startsWith("+") ? `بالای ${w.slice(1)}` : `تا ${w.slice(1)}`}
                    </button>
                  );
                })}
              </div>
              {errors.weights ? <p className="mt-2 text-sm text-negative">{errors.weights}</p> : null}
            </fieldset>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="ظرفیت کل" htmlFor="cap">
              <Input id="cap" value={form.capacity} onChange={(e) => set("capacity", e.target.value)} inputMode="numeric" dir="ltr" className="text-end" />
            </Field>
            <Field label="ورودیه هر ورزشکار (تومان)" htmlFor="fee" hint="سهم هیئت استان: ۳۰٪، خودکار تسویه می‌شود">
              <Input id="fee" value={form.fee} onChange={(e) => set("fee", e.target.value)} inputMode="numeric" dir="ltr" className="text-end" />
            </Field>
            <Field label="مهلت ثبت‌نام" htmlFor="deadline">
              <Input id="deadline" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} dir="ltr" className="text-end" />
            </Field>
            <div className="rounded-card border border-hairline bg-raised/60 p-4 text-sm">
              <p className="font-medium text-fg">مدارک لازم برای ثبت‌نام</p>
              <ul className="mt-2 flex flex-col gap-1 text-fg-secondary">
                <li>کارت عضویت معتبر</li>
                <li>بیمه ورزشی سال جاری</li>
                <li>معاینه پزشکی کمتر از ۶ ماه</li>
              </ul>
            </div>
            <Field label="توضیحات برای هیئت‌ها" htmlFor="notes" className="sm:col-span-2">
              <Textarea id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} />
            </Field>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="flex flex-col gap-6">
            <DescriptionList
              items={[
                { term: "عنوان", value: form.title || "—" },
                { term: "رده", value: levelLabel[form.level] },
                { term: "محل", value: [form.venue, form.city].filter(Boolean).join("، ") || "—" },
                { term: "زمان", value: `${toPersianDigits(form.start)}، ${toPersianDigits(form.days)} روز` },
                { term: "رده سنی و بخش", value: `${form.ageGroup}، ${form.gender === "male" ? "آقایان" : form.gender === "female" ? "بانوان" : "آقایان و بانوان"}` },
                { term: "اوزان", value: `${formatNumber(form.weights.length)} وزن` },
                { term: "ظرفیت", value: `${toPersianDigits(form.capacity)} نفر` },
                { term: "ورودیه", value: `${toPersianDigits(form.fee)} تومان` },
              ]}
            />
            {rule ? (
              <div className="rounded-card border border-hairline p-4">
                <p className="text-sm font-medium text-fg">امتیاز رنکینگ این مسابقه</p>
                <p className="mt-0.5 text-xs text-fg-muted">طبق آیین‌نامه: {rule.level}</p>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                  {[
                    { l: "اول", v: rule.first },
                    { l: "دوم", v: rule.second },
                    { l: "سوم", v: rule.third },
                    { l: "شرکت", v: rule.participation },
                  ].map((x) => (
                    <div key={x.l} className="rounded-control bg-raised py-2">
                      <p className="tabular text-lg font-medium text-fg">{formatNumber(x.v)}</p>
                      <p className="text-xs text-fg-muted">{x.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-4 md:px-8">
        <Button variant="ghost" onClick={() => (step === 0 ? router.push("/competitions") : setStep(step - 1))}>
          {step === 0 ? "انصراف" : "مرحله قبل"}
        </Button>
        {step < steps.length - 1 ? <Button onClick={next}>مرحله بعد</Button> : <Button onClick={submit}>ذخیره پیش‌نویس</Button>}
      </div>
    </Card>
  );
}
