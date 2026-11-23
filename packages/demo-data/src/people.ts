import { daysFromNow } from "@varzino/utils";
import { FEMALE_FIRST, LAST, MALE_FIRST } from "./names";
import { createRandom } from "./random";
import { provinces } from "./provinces";

export type Gender = "male" | "female";
export type PersonRole = "athlete" | "coach" | "referee";
export type PersonStatus = "active" | "pending" | "suspended" | "expired";
export type AgeGroup = "نونهالان" | "نوجوانان" | "جوانان" | "بزرگسالان";

export type Club = {
  id: string;
  name: string;
  provinceId: string;
  city: string;
  manager: string;
  athletes: number;
  coaches: number;
  licenseStatus: "valid" | "expiring" | "expired";
  licenseExpiry: Date;
  rating: number;
  founded: number;
};

export type TimelineEvent = {
  id: string;
  date: Date;
  kind: "competition" | "medal" | "course" | "license" | "medical" | "membership" | "transfer";
  title: string;
  detail?: string;
};

export type Person = {
  id: string;
  /** membership code, printed like a bib number */
  code: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: Gender;
  role: PersonRole;
  birthDate: Date;
  age: number;
  ageGroup: AgeGroup;
  provinceId: string;
  clubId: string;
  belt: string;
  /** kyorugi weight class label, athletes only */
  weightClass?: string;
  rankingPoints: number;
  /** coach / referee grade */
  grade?: string;
  status: PersonStatus;
  memberSince: Date;
  insuranceExpiry: Date;
  medicalStatus: "fit" | "needs-review" | "injured";
  phone: string;
  completeness: number;
  timeline: TimelineEvent[];
};

const rnd = createRandom(1405);

const CITY_BY_PROVINCE: Record<string, string[]> = {
  thr: ["تهران", "شهریار", "اسلامشهر", "ورامین"],
  isf: ["اصفهان", "کاشان", "نجف‌آباد", "خمینی‌شهر"],
  krz: ["مشهد", "نیشابور", "سبزوار"],
  frs: ["شیراز", "مرودشت", "کازرون"],
  kzs: ["اهواز", "دزفول", "آبادان"],
  eaz: ["تبریز", "مراغه", "مرند"],
  maz: ["ساری", "بابل", "آمل", "قائم‌شهر"],
  alb: ["کرج", "فردیس", "نظرآباد"],
  krm: ["کرمان", "رفسنجان", "سیرجان"],
  gil: ["رشت", "لاهیجان", "انزلی"],
};

const CLUB_PREFIX = ["باشگاه", "مجموعه ورزشی", "خانه تکواندو", "آکادمی"] as const;
const CLUB_NAMES = [
  "پیشگامان", "ستارگان", "سپهر", "آرش", "رستم", "فجر", "المپیک", "پرواز", "نوین", "تختی",
  "شهدا", "آزادی", "ققنوس", "پارس", "البرز", "مهرگان", "کوثر", "اندیشه", "سایه", "آفتاب",
] as const;

const mainProvinceIds = ["thr", "isf", "krz", "frs", "kzs", "eaz", "maz", "alb", "krm", "gil"];

export const clubs: Club[] = Array.from({ length: 42 }, (_, i) => {
  const provinceId = i < 30 ? (mainProvinceIds[i % mainProvinceIds.length] as string) : rnd.pick(provinces).id;
  const cities = CITY_BY_PROVINCE[provinceId] ?? [provinces.find((p) => p.id === provinceId)?.name ?? ""];
  const expiryDays = rnd.int(-40, 420);
  return {
    id: `club-${i + 1}`,
    name: `${rnd.pick(CLUB_PREFIX)} ${CLUB_NAMES[i % CLUB_NAMES.length]}${i >= CLUB_NAMES.length ? ` ${rnd.pick(cities)}` : ""}`,
    provinceId,
    city: rnd.pick(cities),
    manager: `${rnd.pick(MALE_FIRST)} ${rnd.pick(LAST)}`,
    athletes: rnd.int(60, 420),
    coaches: rnd.int(3, 18),
    licenseStatus: expiryDays < 0 ? "expired" : expiryDays < 45 ? "expiring" : "valid",
    licenseExpiry: daysFromNow(expiryDays),
    rating: Math.round((3 + rnd.next() * 2) * 10) / 10,
    founded: rnd.int(1365, 1400),
  };
});

export const clubById = Object.fromEntries(clubs.map((c) => [c.id, c])) as Record<string, Club>;

export const MALE_WEIGHT_CLASSES = ["−۵۴", "−۵۸", "−۶۳", "−۶۸", "−۷۴", "−۸۰", "−۸۷", "+۸۷"] as const;
export const FEMALE_WEIGHT_CLASSES = ["−۴۶", "−۴۹", "−۵۳", "−۵۷", "−۶۲", "−۶۷", "−۷۳", "+۷۳"] as const;
const BELTS_ATHLETE = ["دان ۱", "دان ۲", "دان ۳", "کمربند قرمز", "کمربند آبی", "دان ۴"] as const;
const COACH_GRADES = ["مربی درجه ۳", "مربی درجه ۲", "مربی درجه ۱", "مربی بین‌المللی"] as const;
const REFEREE_GRADES = ["داور درجه ۳", "داور درجه ۲", "داور درجه ۱", "داور ملی", "داور بین‌المللی"] as const;

function ageGroupOf(age: number): AgeGroup {
  if (age < 12) return "نونهالان";
  if (age < 15) return "نوجوانان";
  if (age < 18) return "جوانان";
  return "بزرگسالان";
}

function buildTimeline(role: PersonRole, idx: number, memberSince: Date): TimelineEvent[] {
  const r = createRandom(9000 + idx);
  const events: TimelineEvent[] = [
    { id: "t0", date: memberSince, kind: "membership", title: "ثبت عضویت در فدراسیون", detail: "تأیید هیئت استان" },
  ];
  if (role === "athlete") {
    events.push(
      { id: "t1", date: daysFromNow(-r.int(300, 400)), kind: "competition", title: "لیگ دسته یک کشور", detail: "مرحله رفت" },
      { id: "t2", date: daysFromNow(-r.int(200, 290)), kind: "medal", title: "مدال نقره قهرمانی استان", detail: "رده بزرگسالان" },
      { id: "t3", date: daysFromNow(-r.int(120, 190)), kind: "medical", title: "معاینه سالانه پزشکی ورزشی", detail: "نتیجه: بلامانع" },
      { id: "t4", date: daysFromNow(-r.int(40, 110)), kind: "medal", title: "مدال طلای قهرمانی کشور", detail: "+۱۲۰ امتیاز رنکینگ" },
      { id: "t5", date: daysFromNow(-r.int(3, 30)), kind: "competition", title: "ثبت‌نام در اردوی تیم ملی", detail: "در انتظار تأیید کمیته فنی" },
    );
  } else if (role === "coach") {
    events.push(
      { id: "t1", date: daysFromNow(-r.int(300, 500)), kind: "course", title: "دوره مربیگری درجه ۲", detail: "نمره نهایی ۱۷٫۵" },
      { id: "t2", date: daysFromNow(-r.int(150, 290)), kind: "license", title: "صدور کارت مربیگری", detail: "اعتبار تا یک سال" },
      { id: "t3", date: daysFromNow(-r.int(10, 140)), kind: "course", title: "سمینار دانش‌افزایی قوانین جدید", detail: "۸ ساعت" },
    );
  } else {
    events.push(
      { id: "t1", date: daysFromNow(-r.int(300, 500)), kind: "course", title: "دوره داوری درجه ۱", detail: "قبول" },
      { id: "t2", date: daysFromNow(-r.int(100, 290)), kind: "competition", title: "قضاوت در مسابقات قهرمانی کشور", detail: "۱۴ مبارزه" },
      { id: "t3", date: daysFromNow(-r.int(5, 90)), kind: "license", title: "تمدید کارت داوری", detail: "تأیید کمیته داوران" },
    );
  }
  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const people: Person[] = Array.from({ length: 160 }, (_, i) => {
  const role: PersonRole = i < 110 ? "athlete" : i < 140 ? "coach" : "referee";
  const gender: Gender = rnd.chance(role === "athlete" ? 0.42 : 0.3) ? "female" : "male";
  const firstName = gender === "male" ? rnd.pick(MALE_FIRST) : rnd.pick(FEMALE_FIRST);
  const lastName = rnd.pick(LAST);
  const age = role === "athlete" ? rnd.int(10, 29) : rnd.int(26, 58);
  const birthDate = daysFromNow(-age * 365 - rnd.int(0, 360));
  const club = i < clubs.length ? (clubs[i] as Club) : rnd.pick(clubs);
  const memberSince = daysFromNow(-rnd.int(200, 3200));
  const statusRoll = rnd.next();
  const status: PersonStatus = statusRoll < 0.8 ? "active" : statusRoll < 0.9 ? "pending" : statusRoll < 0.96 ? "expired" : "suspended";
  const medRoll = rnd.next();
  const weightClass =
    role === "athlete" ? (gender === "male" ? rnd.pick(MALE_WEIGHT_CLASSES) : rnd.pick(FEMALE_WEIGHT_CLASSES)) : undefined;
  return {
    id: `p-${i + 1}`,
    code: String(140500000 + 317 + i * 37),
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    gender,
    role,
    birthDate,
    age,
    ageGroup: ageGroupOf(age),
    provinceId: club.provinceId,
    clubId: club.id,
    belt: role === "athlete" ? rnd.pick(BELTS_ATHLETE) : `دان ${rnd.int(4, 8)}`,
    weightClass,
    rankingPoints: role === "athlete" ? rnd.int(40, 980) : 0,
    grade: role === "coach" ? rnd.pick(COACH_GRADES) : role === "referee" ? rnd.pick(REFEREE_GRADES) : undefined,
    status,
    memberSince,
    insuranceExpiry: daysFromNow(rnd.int(-20, 330)),
    medicalStatus: medRoll < 0.84 ? "fit" : medRoll < 0.95 ? "needs-review" : "injured",
    phone: `۰۹${rnd.int(10, 39)}${rnd.int(100, 999)}${rnd.int(1000, 9999)}`.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)] ?? d),
    completeness: rnd.int(62, 100),
    timeline: buildTimeline(role, i, memberSince),
  };
});

export const personById = Object.fromEntries(people.map((p) => [p.id, p])) as Record<string, Person>;

export const roleLabel: Record<PersonRole, string> = { athlete: "ورزشکار", coach: "مربی", referee: "داور" };
export const statusLabel: Record<PersonStatus, string> = {
  active: "فعال",
  pending: "در انتظار تأیید",
  suspended: "تعلیق",
  expired: "منقضی",
};
export const medicalLabel: Record<Person["medicalStatus"], string> = {
  fit: "بلامانع",
  "needs-review": "نیاز به بررسی",
  injured: "مصدوم",
};

/** "−۶۸" -> «تا ۶۸ کیلوگرم», "+۸۷" -> «بالای ۸۷ کیلوگرم». Reads naturally in RTL without sign reordering. */
export function weightLabel(w?: string): string {
  if (!w) return "—";
  const n = w.replace(/[−+-]/g, "");
  return w.startsWith("+") ? `بالای ${n} کیلوگرم` : `تا ${n} کیلوگرم`;
}
