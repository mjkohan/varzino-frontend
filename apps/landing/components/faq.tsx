"use client";

import { ChevronDown } from "lucide-react";
import { Accordion } from "radix-ui";
import { SectionHeading } from "./heading";

const faqs = [
  {
    q: "آیا اطلاعات فعلی فدراسیون و هیئت‌ها منتقل می‌شود؟",
    a: "بله. فهرست ورزشکاران، باشگاه‌ها، مربیان و داوران از فایل‌های اکسل و سامانه‌های قبلی وارد می‌شود و تکراری‌ها با کد ملی یکی می‌شوند.",
  },
  {
    q: "هیئت‌های استانی به چه زیرساختی نیاز دارند؟",
    a: "فقط مرورگر و اینترنت. سامانه روی رایانه و تلفن همراه کار می‌کند و نصب نرم‌افزار جداگانه لازم نیست.",
  },
  {
    q: "آیین‌نامه امتیازدهی رنکینگ قابل تغییر است؟",
    a: "بله. امتیاز هر رده مسابقه و هر مقام، و مدت اعتبار امتیاز را کمیته فنی تعریف می‌کند و تغییرات با تاریخ اجرا ثبت می‌شود.",
  },
  {
    q: "پرداخت‌ها چگونه بین فدراسیون و هیئت‌ها تقسیم می‌شود؟",
    a: "سهم هر طرف از ورودیه، حق عضویت و شهریه دوره‌ها از پیش تعریف می‌شود و تسویه با هیئت‌ها دوره‌ای و با گزارش قابل حسابرسی انجام می‌شود.",
  },
  {
    q: "نسخه نمایشی با داده واقعی کار می‌کند؟",
    a: "خیر. همه نام‌ها، اعداد و پرونده‌ها در نسخه نمایشی ساختگی است و فقط برای نشان دادن روند کار ساخته شده است.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-hairline bg-surface py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <SectionHeading title="پرسش‌های رایج" lead="اگر پرسش شما اینجا نیست، در جلسه معرفی پاسخ می‌دهیم." />
        <Accordion.Root type="single" collapsible className="divide-y divide-hairline border-y border-hairline">
          {faqs.map((f, i) => (
            <Accordion.Item key={f.q} value={`q${i}`}>
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-start text-md font-medium text-fg">
                  {f.q}
                  <ChevronDown
                    aria-hidden
                    className="size-4 shrink-0 text-fg-muted transition-transform duration-200 ease-brand group-data-[state=open]:rotate-180"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden pb-5 text-base leading-8 text-fg-secondary">{f.a}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
