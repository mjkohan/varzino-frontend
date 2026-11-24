/**
 * Participant portal: what one athlete sees about themself.
 * The demo participant is the same athlete shown on the landing page card.
 */
import { daysFromNow } from "@varzino/utils";
import { competitions, type Competition } from "./competitions";
import { courses, type Course } from "./education";
import { people, type Person } from "./people";

export const me: Person = people.find((p) => p.role === "athlete" && p.gender === "male" && p.ageGroup === "بزرگسالان") ?? people[0]!;

export type MyRegistrationStatus = "pending-payment" | "registered" | "weighed" | "finished";

export type MyRegistration = {
  id: string;
  competition: Competition;
  weight: string;
  status: MyRegistrationStatus;
  result?: string;
  points?: number;
};

export const myRegistrationStatusLabel: Record<MyRegistrationStatus, string> = {
  "pending-payment": "در انتظار پرداخت",
  registered: "ثبت‌نام قطعی",
  weighed: "وزن‌کشی انجام شد",
  finished: "پایان‌یافته",
};

const byId = (id: string) => competitions.find((c) => c.id === id)!;

export const myRegistrations: MyRegistration[] = [
  { id: "mr1", competition: byId("c-1"), weight: me.weightClass ?? "−۶۸", status: "weighed" },
  { id: "mr2", competition: byId("c-3"), weight: me.weightClass ?? "−۶۸", status: "registered" },
  { id: "mr3", competition: byId("c-10"), weight: me.weightClass ?? "−۶۸", status: "finished", result: "مدال نقره", points: 72 },
  { id: "mr4", competition: byId("c-8"), weight: me.weightClass ?? "−۶۸", status: "finished", result: "مقام پنجم", points: 26 },
];

/** Competitions the participant can still register for. */
export const openForMe: Competition[] = competitions.filter(
  (c) => (c.status === "registration" || c.status === "scheduled") && (c.gender === "mixed" || c.gender === me.gender) && c.ageGroup === me.ageGroup && !myRegistrations.some((r) => r.competition.id === c.id),
);

export const openCoursesForMe: Course[] = courses.filter((c) => c.status === "enrolling" || c.status === "planned");

export const myCourses = [
  { id: "mc1", title: "آشنایی با مقررات ضد دوپینگ", status: "passed" as const, date: daysFromNow(-38), score: 92, serial: "TKD-EDU-۱۴۰۵-۰۸۲۱" },
  { id: "mc2", title: "کمک‌های اولیه و مدیریت آسیب در مبارزه", status: "running" as const, date: daysFromNow(-2), progress: 40 },
];

export type MyPayment = { id: string; title: string; date: Date; amount: number; status: "paid" | "pending" | "refunded"; ref: string };

export const myPayments: MyPayment[] = [
  { id: "mp1", title: "ورودیه قهرمانی کشور بزرگسالان", date: daysFromNow(-12), amount: 6_000_000, status: "paid", ref: "۸۴۱۹۹۰۲" },
  { id: "mp2", title: "ورودیه لیگ برتر، هفته نهم", date: daysFromNow(-4), amount: 3_000_000, status: "paid", ref: "۸۴۲۰۸۷۱" },
  { id: "mp3", title: "شهریه کارگاه کمک‌های اولیه", date: daysFromNow(-9), amount: 12_000_000, status: "paid", ref: "۸۴۲۰۳۱۴" },
  { id: "mp4", title: "حق عضویت سالانه ۱۴۰۵", date: daysFromNow(-160), amount: 3_000_000, status: "paid", ref: "۸۳۹۸۸۱۰" },
  { id: "mp5", title: "بازگشت ورودیه جام فجر ۱۴۰۴", date: daysFromNow(-210), amount: -4_500_000, status: "refunded", ref: "۸۳۷۷۰۲۱" },
];

export const myWallet = { balance: 8_400_000 };

export type MyNotification = { id: string; title: string; body: string; at: Date; tone: "info" | "warning" | "positive" };

export const myNotifications: MyNotification[] = [
  { id: "n1", title: "وزن‌کشی شما ثبت شد", body: "قهرمانی کشور بزرگسالان، مبارزه اول شما ساعت ۱۱:۰۰ روی زمین ۳ است.", at: daysFromNow(0, 8), tone: "positive" },
  { id: "n2", title: "بیمه ورزشی شما تا ۴۵ روز دیگر منقضی می‌شود", body: "برای شرکت در مسابقات دی‌ماه، بیمه را تمدید کنید.", at: daysFromNow(-1, 10), tone: "warning" },
  { id: "n3", title: "ثبت‌نام جام فجر باز شد", body: "رقابت‌های آزاد بین‌المللی، شیراز. مهلت ثبت‌نام ۲۰ روز دیگر.", at: daysFromNow(-3, 12), tone: "info" },
  { id: "n4", title: "امتیاز رنکینگ شما به‌روز شد", body: "+۷۲ امتیاز از انتخابی تیم ملی بزرگسالان.", at: daysFromNow(-8, 9), tone: "positive" },
];

/** Documents the federation needs on file for the participant. */
export const myDocuments = [
  { id: "doc1", title: "تصویر کارت ملی", status: "approved" as const, updated: daysFromNow(-300) },
  { id: "doc2", title: "عکس پرسنلی", status: "approved" as const, updated: daysFromNow(-300) },
  { id: "doc3", title: "بیمه ورزشی ۱۴۰۵", status: "expiring" as const, updated: daysFromNow(-320) },
  { id: "doc4", title: "گواهی معاینه پزشکی", status: "approved" as const, updated: daysFromNow(-60) },
];
