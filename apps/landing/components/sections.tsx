import { categoryLabel, getDataset } from "@varzino/demo-data";
import { Legend, TrendChart } from "@varzino/ui/charts/charts";
import { cn } from "@varzino/ui/lib/cn";
import { formatNumber } from "@varzino/utils";
import { Check, FileSpreadsheet, Lock, MessagesSquare, ScrollText, ServerCog, Stamp, UserCheck } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@varzino/shared/logo";
import { SectionHeading } from "./heading";

function Container({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("scroll-mt-20", className)}>
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">{children}</div>
    </section>
  );
}

/* ---------- Scope strip: product facts, not marketing claims ---------- */

export function ScopeStrip() {
  const items = [
    { value: "۱۹", label: "زیرسامانه در فاز اول" },
    { value: "۳", label: "سطح: فدراسیون، هیئت، باشگاه" },
    { value: "۳۱", label: "استان در یک نما" },
    { value: "۱", label: "پرونده برای هر نفر" },
  ];
  return (
    <Container className="border-y border-hairline bg-surface">
      <dl className="grid grid-cols-2 divide-hairline md:grid-cols-4 md:divide-x md:divide-x-reverse">
        {items.map((it) => (
          <div key={it.label} className="flex flex-col gap-1 py-6 md:px-8 md:first:ps-0">
            <dt className="order-2 text-sm text-fg-secondary">{it.label}</dt>
            <dd className="tabular order-1 text-3xl font-medium text-fg">{it.value}</dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}

/* ---------- Today vs with Varzino ---------- */

const before: { icon: ReactNode; text: string }[] = [
  { icon: <FileSpreadsheet />, text: "فهرست ورزشکاران در فایل‌های اکسل جدا در هر هیئت" },
  { icon: <MessagesSquare />, text: "ثبت‌نام مسابقه با پیام در گروه‌ها و فیش بانکی" },
  { icon: <Stamp />, text: "کارت مربیگری و پروانه باشگاه با نامه و چند هفته انتظار" },
  { icon: <ScrollText />, text: "رنکینگ دستی و اعتراض به انتخاب تیم ملی" },
];

const after: string[] = [
  "هر ورزشکار یک کد عضویت و یک پرونده در سراسر کشور دارد",
  "ثبت‌نام، پرداخت ورودیه و پذیرش ورزشکاران در خود سامانه انجام می‌شود",
  "درخواست کارت از هیئت به فدراسیون می‌رود و همان‌جا صادر می‌شود",
  "هر نتیجه طبق آیین‌نامه، خودکار به امتیاز رنکینگ تبدیل می‌شود",
];

export function BeforeAfter() {
  return (
    <Container className="py-24 md:py-32">
      <SectionHeading
        title="کاغذ و فایل پراکنده، جای خود را به یک پرونده می‌دهد"
        lead="بیشتر وقت هیئت‌ها صرف جمع کردن اطلاعات از چند جا می‌شود. ورزینو همان کارهای روزمره را در یک مسیر مشخص انجام می‌دهد."
      />
      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <div className="rounded-panel border border-hairline bg-raised/50 p-6 md:p-8">
          <p className="text-sm font-medium text-fg-muted">امروز</p>
          <ul className="mt-5 flex flex-col gap-4">
            {before.map((b) => (
              <li key={b.text} className="flex items-start gap-3 text-fg-secondary">
                <span className="mt-1 text-fg-muted [&_svg]:size-[18px] [&_svg]:stroke-[1.5]">{b.icon}</span>
                <span className="leading-8">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-panel border border-hairline bg-surface p-6 shadow-sm md:p-8">
          <p className="text-sm font-medium text-accent-ink">با ورزینو</p>
          <ul className="mt-5 flex flex-col gap-4">
            {after.map((a) => (
              <li key={a} className="flex items-start gap-3 text-fg">
                <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                <span className="leading-8">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
}

/* ---------- Data showcase (inverse band) ---------- */

export function Showcase() {
  const { disciplineName, nationalTotals, profile, rankingFor, registrationTrend } = getDataset("para");
  const ranking = rankingFor("male", undefined, profile.bracketDisciplineId).slice(0, 6);
  return (
    <section className="bg-inverse py-24 text-on-inverse md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <SectionHeading
          inverse
          title="داده‌ای که هر روز با آن تصمیم می‌گیرید"
          lead="نمودارها و جدول‌های زیر همان چیزی است که در پنل می‌بینید."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="rounded-panel bg-surface p-5 text-fg md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">ثبت‌نام ورزشکاران، ۱۲ ماه اخیر</p>
                <p className="mt-0.5 text-sm text-fg-muted">
                  مجموع ورزشکاران ثبت‌شده: <span className="tabular text-fg-secondary">{formatNumber(nationalTotals.athletes)}</span>
                </p>
              </div>
              <Legend
                series={[
                  { key: "thisYear", label: "امسال" },
                  { key: "lastYear", label: "سال قبل", emphasis: false },
                ]}
              />
            </div>
            <TrendChart
              className="mt-6"
              data={registrationTrend}
              xKey="month"
              height={280}
              series={[
                { key: "thisYear", label: "امسال" },
                { key: "lastYear", label: "سال قبل", emphasis: false },
              ]}
            />
          </div>
          <div className="rounded-panel bg-surface p-5 text-fg md:p-6">
            <p className="font-medium">رنکینگ کشوری {disciplineName(profile.bracketDisciplineId)}، بزرگسالان مردان</p>
            <p className="mt-0.5 text-sm text-fg-muted">به‌روز شده پس از هر مسابقه رسمی</p>
            <ol className="mt-5 flex flex-col">
              {ranking.map((r) => (
                <li key={r.person.id} className="flex h-12 items-center gap-3 border-b border-hairline text-sm last:border-b-0">
                  <span className="tabular w-5 text-fg-muted">{formatNumber(r.rank)}</span>
                  <span className="min-w-0 flex-1 truncate font-medium">{r.person.fullName}</span>
                  <span className="text-xs text-fg-muted">{categoryLabel(r.person.category)}</span>
                  <span className="tabular w-12 text-end text-fg-secondary">{formatNumber(r.points)}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Roles ---------- */

const roles = [
  {
    title: "فدراسیون",
    lead: "تصویر کشوری و تصمیم",
    items: ["داشبورد همه استان‌ها", "تأیید نهایی کارت‌ها و مجوزها", "تعریف مسابقات کشوری و آیین‌نامه امتیاز", "تسویه و گزارش مالی هیئت‌ها"],
  },
  {
    title: "هیئت استانی",
    lead: "اداره باشگاه‌ها و ورزشکاران استان",
    items: ["بررسی درخواست‌های باشگاه‌ها", "برگزاری مسابقات استانی", "سهم مالی شفاف از هر دریافت", "کارنامه ارزیابی هیئت"],
  },
  {
    title: "باشگاه",
    lead: "کار روزمره بدون نامه‌نگاری",
    items: ["ثبت ورزشکار و تمدید عضویت", "ثبت‌نام گروهی در مسابقات", "درخواست و تمدید پروانه", "پرداخت آنلاین ورودیه و حق عضویت"],
  },
  {
    title: "ورزشکار، مربی و داور",
    lead: "یک پرونده که همراه فرد می‌ماند",
    items: ["کارت عضویت با کد یکتا", "سوابق مسابقه، مدال و امتیاز", "ثبت‌نام در دوره‌ها و دریافت گواهی", "وضعیت بیمه و معاینه پزشکی"],
  },
];

export function Roles() {
  return (
    <Container id="roles" className="py-24 md:py-32">
      <SectionHeading
        title="هر سطح، همان چیزی را می‌بیند که به آن نیاز دارد"
        lead="دسترسی‌ها بر اساس نقش و واحد تعریف می‌شود. رئیس هیئت فقط استان خودش را می‌بیند و مدیر باشگاه فقط باشگاه خودش را."
      />
      <div className="mt-12 grid overflow-hidden rounded-panel border border-hairline bg-surface md:grid-cols-2 lg:grid-cols-4">
        {roles.map((r, i) => (
          <div
            key={r.title}
            className={cn(
              "flex flex-col gap-4 p-6",
              i > 0 && "border-t border-hairline md:border-t-0",
              i % 2 === 1 && "md:border-s",
              i >= 2 && "md:border-t lg:border-t-0",
              i === 2 && "lg:border-s",
            )}
          >
            <div>
              <h3 className="text-lg font-medium text-fg">{r.title}</h3>
              <p className="text-sm text-fg-muted">{r.lead}</p>
            </div>
            <ul className="flex flex-col gap-2.5">
              {r.items.map((it) => (
                <li key={it} className="flex gap-2.5 text-sm leading-6 text-fg-secondary">
                  <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-fg-muted" />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Container>
  );
}

/* ---------- Onboarding steps (a real sequence) ---------- */

const steps = [
  { title: "جلسه معرفی و نیازسنجی", text: "با دبیرخانه و کمیته‌ها، فرایندهای فعلی و آیین‌نامه‌ها را مرور می‌کنیم." },
  { title: "انتقال داده‌های موجود", text: "فهرست ورزشکاران، باشگاه‌ها و مربیان از فایل‌های فعلی وارد سامانه می‌شود." },
  { title: "راه‌اندازی در چند استان پیشرو", text: "چند هیئت اول با پشتیبانی نزدیک شروع می‌کنند و بازخورد می‌دهند." },
  { title: "گسترش به همه هیئت‌ها", text: "آموزش کارشناسان هیئت‌ها و فعال‌سازی ثبت‌نام آنلاین در سراسر کشور." },
];

export function Onboarding() {
  return (
    <Container id="onboarding" className="border-t border-hairline bg-surface py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <SectionHeading title="راه‌اندازی در چهار مرحله" lead="بدون توقف کار جاری فدراسیون، از چند استان شروع می‌کنیم و گسترش می‌دهیم." />
        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="tabular flex size-9 shrink-0 items-center justify-center rounded-full border border-hairline-strong text-sm font-medium text-fg">
                {formatNumber(i + 1)}
              </span>
              <div>
                <h3 className="font-medium text-fg">{s.title}</h3>
                <p className="mt-1 text-sm leading-7 text-fg-secondary">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Container>
  );
}

/* ---------- Governance & security ---------- */

const security = [
  { icon: <UserCheck />, title: "دسترسی بر اساس نقش و واحد", text: "هر کاربر فقط داده واحد خود را می‌بیند و فقط عملیات نقش خود را انجام می‌دهد." },
  { icon: <ScrollText />, title: "ثبت همه تغییرات", text: "چه کسی، چه زمانی و چه چیزی را تغییر داد؛ برای حسابرسی و رسیدگی به اعتراض." },
  { icon: <ServerCog />, title: "قابل استقرار روی زیرساخت داخلی", text: "نصب روی سرورهای فدراسیون یا مرکز داده داخلی، مطابق الزامات حاکمیت داده." },
  { icon: <Lock />, title: "گردش کار تأیید چندمرحله‌ای", text: "کارت، پروانه و پرداخت‌ها مسیر تأیید تعریف‌شده هیئت و فدراسیون را طی می‌کنند." },
];

export function Security() {
  return (
    <Container className="py-24 md:py-32">
      <SectionHeading title="داده ورزش کشور، با حاکمیت و شفافیت" />
      <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {security.map((s) => (
          <div key={s.title}>
            <span className="text-fg-muted [&_svg]:size-5 [&_svg]:stroke-[1.5]">{s.icon}</span>
            <h3 className="mt-4 font-medium text-fg">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-7 text-fg-secondary">{s.text}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}

/* ---------- Footer ---------- */

export function Footer() {
  return (
    <footer className="bg-inverse text-on-inverse">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <Logo inverse />
          <p className="mt-3 max-w-sm text-sm leading-7 text-on-inverse-muted">سامانه یکپارچه مدیریت فدراسیون‌ها، هیئت‌های استانی و باشگاه‌های ورزشی</p>
        </div>
        <p className="text-sm text-on-inverse-muted">© ۱۴۰۵ ورزینو، همه حقوق محفوظ است</p>
      </div>
    </footer>
  );
}
