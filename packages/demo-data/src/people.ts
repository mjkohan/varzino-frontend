import { daysFromNow } from "@varzino/utils";
import type { FederationProfile } from "./federations";
import { FEMALE_FIRST, LAST, MALE_FIRST } from "./names";
import { createRandom } from "./random";
import type { Province } from "./provinces";

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
  disciplineId: string;
  /** athlete level, or staff experience level */
  level: string;
  /** competition category: weight class, sport class or event; athletes only */
  category?: string;
  /** para only: impairment type */
  impairment?: string;
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

const CLUB_NAMES = [
  "پیشگامان", "ستارگان", "سپهر", "آرش", "رستم", "فجر", "المپیک", "پرواز", "نوین", "تختی",
  "شهدا", "آزادی", "ققنوس", "پارس", "البرز", "مهرگان", "کوثر", "اندیشه", "سایه", "آفتاب",
] as const;

const mainProvinceIds = ["thr", "isf", "krz", "frs", "kzs", "eaz", "maz", "alb", "krm", "gil"];

function ageGroupOf(age: number): AgeGroup {
  if (age < 12) return "نونهالان";
  if (age < 15) return "نوجوانان";
  if (age < 18) return "جوانان";
  return "بزرگسالان";
}

const TIMELINE_KINDS: Record<PersonRole, { kind: TimelineEvent["kind"]; days: [number, number] }[]> = {
  athlete: [
    { kind: "competition", days: [300, 400] },
    { kind: "medal", days: [200, 290] },
    { kind: "medical", days: [120, 190] },
    { kind: "medal", days: [40, 110] },
    { kind: "competition", days: [3, 30] },
  ],
  coach: [
    { kind: "course", days: [300, 500] },
    { kind: "license", days: [150, 290] },
    { kind: "course", days: [10, 140] },
  ],
  referee: [
    { kind: "course", days: [300, 500] },
    { kind: "competition", days: [100, 290] },
    { kind: "license", days: [5, 90] },
  ],
};

function buildTimeline(p: FederationProfile, role: PersonRole, idx: number, memberSince: Date): TimelineEvent[] {
  const r = createRandom(9000 + idx + p.seed);
  const events: TimelineEvent[] = [
    { id: "t0", date: memberSince, kind: "membership", title: "ثبت عضویت در فدراسیون", detail: "تأیید هیئت استان" },
  ];
  TIMELINE_KINDS[role].forEach((k, i) => {
    const [title, detail] = p.timeline[role][i] ?? ["", ""];
    events.push({ id: `t${i + 1}`, date: daysFromNow(-r.int(k.days[0], k.days[1])), kind: k.kind, title, detail });
  });
  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function buildPeople(p: FederationProfile, provinces: Province[]) {
  const rnd = createRandom(p.seed);

  const clubs: Club[] = Array.from({ length: 42 }, (_, i) => {
    const provinceId = i < 30 ? (mainProvinceIds[i % mainProvinceIds.length] as string) : rnd.pick(provinces).id;
    const cities = CITY_BY_PROVINCE[provinceId] ?? [provinces.find((x) => x.id === provinceId)?.name ?? ""];
    const expiryDays = rnd.int(-40, 420);
    return {
      id: `club-${i + 1}`,
      name: `${rnd.pick(p.clubPrefixes)} ${CLUB_NAMES[i % CLUB_NAMES.length]}${i >= CLUB_NAMES.length ? ` ${rnd.pick(cities)}` : ""}`,
      provinceId,
      city: rnd.pick(cities),
      manager: `${rnd.pick(MALE_FIRST)} ${rnd.pick(LAST)}`,
      athletes: Math.max(18, Math.round(rnd.int(60, 420) * p.scale * 2)),
      coaches: rnd.int(2, 12),
      licenseStatus: expiryDays < 0 ? "expired" : expiryDays < 45 ? "expiring" : "valid",
      licenseExpiry: daysFromNow(expiryDays),
      rating: Math.round((3 + rnd.next() * 2) * 10) / 10,
      founded: rnd.int(1365, 1400),
    };
  });

  const clubById = Object.fromEntries(clubs.map((c) => [c.id, c])) as Record<string, Club>;

  const totalWeight = p.disciplines.reduce((s, d) => s + d.weight, 0);
  const pickDiscipline = () => {
    let roll = rnd.next() * totalWeight;
    for (const d of p.disciplines) {
      roll -= d.weight;
      if (roll <= 0) return d;
    }
    return p.disciplines[0]!;
  };
  const bracketDiscipline = p.disciplines.find((d) => d.id === p.bracketDisciplineId)!;

  const people: Person[] = Array.from({ length: 160 }, (_, i) => {
    const role: PersonRole = i < 110 ? "athlete" : i < 140 ? "coach" : "referee";
    const gender: Gender = rnd.chance(role === "athlete" ? 0.38 : 0.3) ? "female" : "male";
    const firstName = gender === "male" ? rnd.pick(MALE_FIRST) : rnd.pick(FEMALE_FIRST);
    const lastName = rnd.pick(LAST);
    const age = role === "athlete" ? rnd.int(p.athleteAge[0], p.athleteAge[1]) : rnd.int(26, 58);
    const birthDate = daysFromNow(-age * 365 - rnd.int(0, 360));
    const club = i < clubs.length ? (clubs[i] as Club) : rnd.pick(clubs);
    const memberSince = daysFromNow(-rnd.int(200, 3200));
    const statusRoll = rnd.next();
    const status: PersonStatus = statusRoll < 0.8 ? "active" : statusRoll < 0.9 ? "pending" : statusRoll < 0.96 ? "expired" : "suspended";
    const medRoll = rnd.next();
    // The first 16 athletes compete in the bracket discipline, so brackets and rankings always have a full field.
    const discipline = role === "athlete" && i < 16 ? bracketDiscipline : pickDiscipline();
    const category = role === "athlete" ? rnd.pick(discipline.categories[gender]) : undefined;
    return {
      id: `p-${i + 1}`,
      code: String(140500000 + 317 + i * 37 + (p.id === "assoc" ? 500000 : 0)),
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
      disciplineId: discipline.id,
      level: role === "athlete" ? rnd.pick(p.athleteLevels) : rnd.pick(p.staffLevels),
      category,
      impairment: p.impairments && role === "athlete" ? rnd.pick(p.impairments) : undefined,
      rankingPoints: role === "athlete" ? rnd.int(40, 980) : 0,
      grade: role === "coach" ? rnd.pick(p.coachGrades) : role === "referee" ? rnd.pick(p.refereeGrades) : undefined,
      status,
      memberSince,
      insuranceExpiry: daysFromNow(rnd.int(-20, 330)),
      medicalStatus: medRoll < 0.84 ? "fit" : medRoll < 0.95 ? "needs-review" : "injured",
      phone: `۰۹${rnd.int(10, 39)}${rnd.int(100, 999)}${rnd.int(1000, 9999)}`.replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)] ?? d),
      completeness: rnd.int(62, 100),
      timeline: buildTimeline(p, role, i, memberSince),
    };
  });

  const personById = Object.fromEntries(people.map((x) => [x.id, x])) as Record<string, Person>;
  const disciplineById = Object.fromEntries(p.disciplines.map((d) => [d.id, d]));
  const disciplineName = (id: string) => disciplineById[id]?.name ?? "—";

  return { clubs, clubById, people, personById, disciplineName };
}

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

/**
 * Display text for a competition category.
 * Weight classes ("−۵۹", "+۱۰۷") read as «تا ۵۹ کیلوگرم» / «بالای ۱۰۷ کیلوگرم»; other categories show as they are.
 */
export function categoryLabel(c?: string): string {
  if (!c) return "—";
  if (!/^[−+-][۰-۹0-9]/.test(c)) return c;
  const n = c.replace(/[−+-]/g, "");
  return c.startsWith("+") ? `بالای ${n} کیلوگرم` : `تا ${n} کیلوگرم`;
}
