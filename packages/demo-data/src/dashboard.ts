import { daysFromNow } from "@varzino/utils";

export type Approval = {
  id: string;
  title: string;
  from: string;
  kind: "license" | "competition" | "transfer" | "finance" | "course";
  href: string;
  waitingSince: Date;
};

export const approvals: Approval[] = [
  { id: "a-1", title: "پروانه فعالیت باشگاه مهرگان", from: "هیئت تکواندو اصفهان", kind: "license", href: "/licenses", waitingSince: daysFromNow(-2) },
  { id: "a-2", title: "جدول قرعه انتخابی جوانان بانوان", from: "کمیته مسابقات", kind: "competition", href: "/competitions/c-2", waitingSince: daysFromNow(-1) },
  { id: "a-3", title: "تسویه سهم هیئت خراسان رضوی", from: "امور مالی", kind: "finance", href: "/finance", waitingSince: daysFromNow(-3) },
  { id: "a-4", title: "انتقال ورزشکار به باشگاه ستارگان", from: "هیئت تکواندو تهران", kind: "transfer", href: "/people", waitingSince: daysFromNow(-4) },
  { id: "a-5", title: "برگزاری دوره مربیگری درجه ۲ در شیراز", from: "کمیته آموزش", kind: "course", href: "/education", waitingSince: daysFromNow(-5) },
];

export type Activity = { id: string; actor: string; action: string; target: string; at: Date };

export const activity: Activity[] = [
  { id: "ac-1", actor: "کمیته مسابقات", action: "نتایج وزن تا ۵۸ کیلوگرم را ثبت کرد", target: "قهرمانی کشور بزرگسالان", at: daysFromNow(0, 9) },
  { id: "ac-2", actor: "هیئت البرز", action: "حق عضویت ۲۴ ورزشکار را پرداخت کرد", target: "۷٫۲ میلیون تومان", at: daysFromNow(0, 8) },
  { id: "ac-3", actor: "کمیته داوران", action: "۱۸ داور را به لیگ برتر منصوب کرد", target: "هفته نهم", at: daysFromNow(-1, 18) },
  { id: "ac-4", actor: "کمیته آموزش", action: "۲۴ گواهی صادر کرد", target: "دوره داوری درجه ۳ پومسه", at: daysFromNow(-1, 14) },
  { id: "ac-5", actor: "دبیرخانه", action: "آیین‌نامه امتیازدهی را ابلاغ کرد", target: "همه هیئت‌ها", at: daysFromNow(-1, 10) },
  { id: "ac-6", actor: "هیئت مازندران", action: "۳ باشگاه جدید ثبت کرد", target: "ساری و بابل", at: daysFromNow(-2, 12) },
];

export const DEMO_USER = {
  name: "محمدرضا کاظمی",
  title: "دبیر کل فدراسیون",
  initials: "م‌ک",
};

export type DemoRole = { id: string; title: string; scope: string; description: string; /** where this role lands after login */ home: string };

export const demoRoles: DemoRole[] = [
  { id: "federation", title: "دبیر کل فدراسیون", scope: "فدراسیون تکواندو، سراسر کشور", description: "همه هیئت‌ها، مسابقات کشوری، مالی و گزارش‌های مدیریتی", home: "/" },
  { id: "board", title: "رئیس هیئت استان", scope: "هیئت تکواندو اصفهان", description: "باشگاه‌ها، ورزشکاران و مسابقات استان، سهم مالی هیئت", home: "/" },
  { id: "club", title: "مدیر باشگاه", scope: "باشگاه پیشگامان، تهران", description: "ورزشکاران باشگاه، ثبت‌نام در مسابقات، پروانه و پرداخت‌ها", home: "/" },
  { id: "participant", title: "ورزشکار", scope: "پرتال شرکت‌کنندگان", description: "پرونده و کارت عضویت خودم، ثبت‌نام در مسابقات و دوره‌ها، پرداخت‌ها", home: "/me" },
];
