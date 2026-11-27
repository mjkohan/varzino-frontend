"use client";

import { Button } from "@varzino/ui/components/button";
import { Field, Input, NativeSelect, Textarea } from "@varzino/ui/components/input";
import { Check } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { toast } from "sonner";
import { panelLoginUrl } from "@varzino/shared/urls";

type Errors = Partial<Record<"name" | "org" | "phone", string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  if (!String(data.get("name") ?? "").trim()) errors.name = "نام و نام خانوادگی را وارد کنید";
  if (!String(data.get("org") ?? "").trim()) errors.org = "نام فدراسیون یا هیئت را وارد کنید";
  const phone = String(data.get("phone") ?? "")
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/\D/g, "");
  if (!/^09\d{9}$/.test(phone)) errors.phone = "شماره همراه ۱۱ رقمی، مثل ۰۹۱۲۱۲۳۴۵۶۷";
  return errors;
}

export function Contact() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  function onSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next = validate(data);
    setErrors(next);
    if (Object.keys(next).length) return;
    setPending(true);
    // Front-end only demo: no request leaves the browser.
    setTimeout(() => {
      setPending(false);
      setSent(true);
      toast.success("درخواست جلسه معرفی ثبت شد");
    }, 600);
  }

  return (
    <section id="contact" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h2 className="text-[28px] font-semibold leading-[1.5] text-fg md:text-[32px]">ورزینو را با داده فدراسیون خودتان ببینید</h2>
          <p className="mt-3 text-lg leading-[1.9] text-fg-secondary">
            در یک جلسه یک‌ساعته، فرایند ثبت‌نام، مسابقه و صدور کارت را با نمونه‌ای از داده‌های رشته شما مرور می‌کنیم.
          </p>
          <p className="mt-6 text-sm text-fg-muted">
            حساب کاربری دارید؟{" "}
            <a href={panelLoginUrl} className="font-medium text-accent-ink underline-offset-4 hover:underline">
              ورود به سامانه
            </a>
          </p>
        </div>

        <div className="rounded-panel border border-hairline bg-surface p-6 shadow-sm md:p-8">
          {sent ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                <Check className="size-5" strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-lg font-medium text-fg">درخواست جلسه معرفی ثبت شد</p>
                <p className="mt-1 text-fg-secondary">برای هماهنگی زمان جلسه، طی دو روز کاری تماس می‌گیریم.</p>
              </div>
              <Button variant="secondary" onClick={() => setSent(false)}>
                ثبت درخواست دیگر
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <Field label="نام و نام خانوادگی" htmlFor="name" error={errors.name}>
                <Input id="name" name="name" autoComplete="name" aria-invalid={!!errors.name} />
              </Field>
              <Field label="سمت" htmlFor="role">
                <Input id="role" name="role" placeholder="مثلاً دبیر هیئت" />
              </Field>
              <Field label="فدراسیون یا هیئت" htmlFor="org" error={errors.org}>
                <Input id="org" name="org" aria-invalid={!!errors.org} />
              </Field>
              <Field label="نوع مجموعه" htmlFor="kind">
                <NativeSelect id="kind" name="kind" defaultValue="federation">
                  <option value="federation">فدراسیون</option>
                  <option value="board">هیئت استانی</option>
                  <option value="club">باشگاه</option>
                  <option value="other">سایر</option>
                </NativeSelect>
              </Field>
              <Field label="شماره همراه" htmlFor="phone" error={errors.phone} className="sm:col-span-2">
                <Input
                  id="phone"
                  name="phone"
                  inputMode="tel"
                  autoComplete="tel"
                  dir="ltr"
                  className="text-end"
                  aria-invalid={!!errors.phone}
                />
              </Field>
              <Field label="توضیح کوتاه" htmlFor="msg" hint="اختیاری، مثلاً تعداد هیئت‌ها یا مشکل اصلی امروز" className="sm:col-span-2">
                <Textarea id="msg" name="msg" rows={3} />
              </Field>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
                  {pending ? "در حال ثبت…" : "ثبت درخواست جلسه معرفی"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
