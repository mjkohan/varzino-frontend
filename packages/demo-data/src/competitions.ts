import { daysFromNow } from "@varzino/utils";
import { createRandom } from "./random";
import { FEMALE_WEIGHT_CLASSES, MALE_WEIGHT_CLASSES, people, weightLabel, type Person } from "./people";

export type CompetitionStatus = "draft" | "registration" | "scheduled" | "live" | "finished";
export type CompetitionLevel = "national" | "provincial" | "league" | "selection" | "open";

export type Competition = {
  id: string;
  title: string;
  level: CompetitionLevel;
  status: CompetitionStatus;
  ageGroup: string;
  gender: "male" | "female" | "mixed";
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  venue: string;
  city: string;
  registered: number;
  capacity: number;
  categories: number;
  referees: number;
  /** entry fee in Rial */
  fee: number;
  /** ranking points multiplier, from the scoring rules */
  rankingFactor: number;
  organizer: string;
};

export const levelLabel: Record<CompetitionLevel, string> = {
  national: "قهرمانی کشور",
  provincial: "استانی",
  league: "لیگ",
  selection: "انتخابی تیم ملی",
  open: "آزاد",
};

export const competitionStatusLabel: Record<CompetitionStatus, string> = {
  draft: "پیش‌نویس",
  registration: "ثبت‌نام باز",
  scheduled: "زمان‌بندی‌شده",
  live: "در حال برگزاری",
  finished: "پایان‌یافته",
};

function comp(
  id: string,
  title: string,
  level: CompetitionLevel,
  status: CompetitionStatus,
  startIn: number,
  days: number,
  extra: Partial<Competition> & Pick<Competition, "venue" | "city" | "ageGroup" | "gender">,
): Competition {
  const r = createRandom(id.length * 97 + startIn);
  const capacity = extra.capacity ?? r.int(18, 48) * 10;
  const ratio = status === "registration" ? r.int(35, 85) / 100 : status === "draft" ? 0 : r.int(88, 100) / 100;
  return {
    id,
    title,
    level,
    status,
    startDate: daysFromNow(startIn, 9),
    endDate: daysFromNow(startIn + days - 1, 18),
    registrationDeadline: daysFromNow(startIn - 10, 23),
    registered: Math.round(capacity * ratio),
    capacity,
    categories: 16,
    referees: r.int(18, 42),
    fee: r.pick([2_500_000, 3_000_000, 4_500_000, 6_000_000]),
    rankingFactor: level === "national" || level === "selection" ? 1 : level === "league" ? 0.8 : level === "provincial" ? 0.4 : 0.25,
    organizer: "کمیته مسابقات فدراسیون",
    ...extra,
  };
}

export const competitions: Competition[] = [
  comp("c-1", "مسابقات قهرمانی کشور بزرگسالان", "national", "live", -1, 3, {
    venue: "سالن ۱۲ هزار نفری آزادی", city: "تهران", ageGroup: "بزرگسالان", gender: "male", capacity: 420,
  }),
  comp("c-2", "انتخابی تیم ملی جوانان بانوان", "selection", "registration", 18, 2, {
    venue: "خانه تکواندو بانوان", city: "تهران", ageGroup: "جوانان", gender: "female", capacity: 180,
  }),
  comp("c-3", "لیگ برتر باشگاه‌های کشور، هفته نهم", "league", "scheduled", 6, 1, {
    venue: "سالن پیروزی", city: "اصفهان", ageGroup: "بزرگسالان", gender: "male", capacity: 96,
  }),
  comp("c-4", "قهرمانی استان خراسان رضوی نوجوانان", "provincial", "registration", 25, 2, {
    venue: "مجموعه ورزشی سامن", city: "مشهد", ageGroup: "نوجوانان", gender: "mixed", capacity: 260,
    organizer: "هیئت تکواندو خراسان رضوی",
  }),
  comp("c-5", "جام فجر، رقابت‌های آزاد بین‌المللی", "open", "scheduled", 44, 3, {
    venue: "سالن شهید پورشریفی", city: "شیراز", ageGroup: "بزرگسالان", gender: "mixed", capacity: 520,
  }),
  comp("c-6", "مسابقات قهرمانی کشور نونهالان", "national", "draft", 70, 2, {
    venue: "سالن انقلاب", city: "کرج", ageGroup: "نونهالان", gender: "mixed", capacity: 300,
  }),
  comp("c-7", "لیگ برتر بانوان، هفته ششم", "league", "finished", -9, 1, {
    venue: "سالن بانوان حجاب", city: "تهران", ageGroup: "بزرگسالان", gender: "female", capacity: 80,
  }),
  comp("c-8", "قهرمانی کشور جوانان پسران", "national", "finished", -32, 3, {
    venue: "سالن امام رضا", city: "مشهد", ageGroup: "جوانان", gender: "male", capacity: 380,
  }),
  comp("c-9", "قهرمانی استان مازندران بزرگسالان", "provincial", "finished", -47, 1, {
    venue: "سالن شهید سلیمانی", city: "ساری", ageGroup: "بزرگسالان", gender: "male", capacity: 150,
    organizer: "هیئت تکواندو مازندران",
  }),
  comp("c-10", "انتخابی تیم ملی بزرگسالان مردان", "selection", "finished", -64, 2, {
    venue: "خانه تکواندو", city: "تهران", ageGroup: "بزرگسالان", gender: "male", capacity: 128,
  }),
  comp("c-11", "قهرمانی استان فارس نوجوانان", "provincial", "scheduled", 12, 1, {
    venue: "سالن حافظیه", city: "شیراز", ageGroup: "نوجوانان", gender: "mixed", capacity: 210,
    organizer: "هیئت تکواندو فارس",
  }),
  comp("c-12", "مسابقات پومسه قهرمانی کشور", "national", "registration", 33, 2, {
    venue: "سالن غدیر", city: "تبریز", ageGroup: "بزرگسالان", gender: "mixed", capacity: 240,
  }),
];

export const competitionById = Object.fromEntries(competitions.map((c) => [c.id, c])) as Record<string, Competition>;

/* ---------- Detail data for one competition: weight categories, bracket, schedule ---------- */

export type WeightCategory = {
  id: string;
  label: string;
  registered: number;
  status: "done" | "in-progress" | "upcoming";
  mat: number;
};

export function categoriesFor(c: Competition): WeightCategory[] {
  const labels =
    c.gender === "female"
      ? FEMALE_WEIGHT_CLASSES.map(weightLabel)
      : MALE_WEIGHT_CLASSES.map(weightLabel);
  const r = createRandom(c.id.length * 13);
  return labels.map((label, i) => ({
    id: `${c.id}-w${i}`,
    label,
    registered: r.int(16, 58),
    status: c.status === "finished" ? "done" : c.status === "live" ? (i < 3 ? "done" : i < 5 ? "in-progress" : "upcoming") : "upcoming",
    mat: (i % 4) + 1,
  }));
}

export type BracketMatch = {
  id: string;
  round: number;
  a?: { person: Person; score?: number; seed?: number };
  b?: { person: Person; score?: number; seed?: number };
  winner?: "a" | "b";
  mat: number;
  time: string;
};

/** Eight-athlete single elimination bracket with deterministic results. */
export function bracketFor(competitionId: string): BracketMatch[][] {
  const r = createRandom(competitionId.length * 31 + 7);
  const athletes = people.filter((p) => p.role === "athlete" && p.gender === "male").slice(0, 8);
  const rounds: BracketMatch[][] = [];
  const seeded = athletes.map((p, i) => ({ person: p, seed: i + 1 }));
  // Standard seeding order so 1 and 2 can only meet in the final.
  let current = [0, 7, 3, 4, 2, 5, 1, 6].map((i) => seeded[i]).filter((x): x is (typeof seeded)[number] => !!x);
  const times = ["۱۰:۰۰", "۱۰:۲۰", "۱۰:۴۰", "۱۱:۰۰"];
  let round = 0;
  while (current.length > 1) {
    const matches: BracketMatch[] = [];
    const next: typeof current = [];
    for (let i = 0; i < current.length; i += 2) {
      const a = current[i];
      const b = current[i + 1];
      if (!a || !b) continue;
      const finished = round < 2;
      const aScore = r.int(4, 18);
      const bScore = r.int(2, 16);
      const winner: "a" | "b" = aScore >= bScore ? "a" : "b";
      matches.push({
        id: `m-${round}-${i}`,
        round,
        a: { ...a, score: finished ? aScore : undefined },
        b: { ...b, score: finished ? bScore : undefined },
        winner: finished ? winner : undefined,
        mat: (i % 2) + 1,
        time: round === 2 ? "۱۶:۳۰" : (times[i / 2] ?? "۱۲:۰۰"),
      });
      next.push(winner === "a" ? a : b);
    }
    rounds.push(matches);
    current = next;
    round++;
  }
  return rounds;
}

export const roundLabel = ["یک‌چهارم نهایی", "نیمه‌نهایی", "فینال"];

export type ScheduleItem = { time: string; title: string; mat: string; state: "done" | "now" | "next" };

export const liveSchedule: ScheduleItem[] = [
  { time: "۰۸:۳۰", title: "وزن‌کشی رسمی اوزان سنگین", mat: "سالن کنفرانس", state: "done" },
  { time: "۰۹:۳۰", title: "مبارزات مقدماتی تا ۵۴ و تا ۵۸ کیلوگرم", mat: "زمین ۱ و ۲", state: "done" },
  { time: "۱۱:۰۰", title: "یک‌چهارم نهایی تا ۶۸ کیلوگرم", mat: "زمین ۳", state: "now" },
  { time: "۱۲:۳۰", title: "مبارزات مقدماتی تا ۷۴ و تا ۸۰ کیلوگرم", mat: "زمین ۱ و ۴", state: "next" },
  { time: "۱۶:۳۰", title: "فینال‌های روز دوم و اهدای مدال", mat: "زمین مرکزی", state: "next" },
];

export type MedalRow = { provinceId: string; gold: number; silver: number; bronze: number };

export const medalTable: MedalRow[] = [
  { provinceId: "thr", gold: 4, silver: 2, bronze: 3 },
  { provinceId: "maz", gold: 2, silver: 3, bronze: 2 },
  { provinceId: "isf", gold: 1, silver: 2, bronze: 4 },
  { provinceId: "krz", gold: 1, silver: 1, bronze: 2 },
  { provinceId: "alb", gold: 0, silver: 1, bronze: 3 },
  { provinceId: "frs", gold: 0, silver: 1, bronze: 2 },
];

/* ---------- Registrations across the year (for dashboard chart) ---------- */

export const registrationTrend: { month: string; thisYear: number; lastYear: number }[] = [
  { month: "آذر", thisYear: 3120, lastYear: 2760 },
  { month: "دی", thisYear: 2840, lastYear: 2610 },
  { month: "بهمن", thisYear: 3460, lastYear: 2980 },
  { month: "اسفند", thisYear: 2210, lastYear: 2050 },
  { month: "فروردین", thisYear: 1980, lastYear: 1870 },
  { month: "اردیبهشت", thisYear: 3890, lastYear: 3240 },
  { month: "خرداد", thisYear: 4320, lastYear: 3510 },
  { month: "تیر", thisYear: 4780, lastYear: 3920 },
  { month: "مرداد", thisYear: 4410, lastYear: 3780 },
  { month: "شهریور", thisYear: 3960, lastYear: 3390 },
  { month: "مهر", thisYear: 4690, lastYear: 3720 },
  { month: "آبان", thisYear: 5240, lastYear: 4010 },
];
