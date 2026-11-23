import { createRandom } from "./random";
import { FEMALE_WEIGHT_CLASSES, MALE_WEIGHT_CLASSES, people, type Person } from "./people";

export type RankingEntry = {
  rank: number;
  person: Person;
  points: number;
  /** positions moved since last ranking update, positive = up */
  change: number;
  events: number;
  gold: number;
  silver: number;
  bronze: number;
};

export function rankingFor(gender: "male" | "female", weightClass?: string): RankingEntry[] {
  const pool = people
    .filter((p) => p.role === "athlete" && p.gender === gender && p.ageGroup === "بزرگسالان")
    .filter((p) => !weightClass || p.weightClass === weightClass);
  const source = pool.length >= 6 ? pool : people.filter((p) => p.role === "athlete" && p.gender === gender);
  const r = createRandom((weightClass ?? "all").length * 101 + (gender === "male" ? 1 : 2));
  return [...source]
    .sort((a, b) => b.rankingPoints - a.rankingPoints)
    .slice(0, 20)
    .map((person, i) => ({
      rank: i + 1,
      person,
      points: person.rankingPoints,
      change: i === 0 ? 0 : r.int(-3, 4),
      events: r.int(3, 11),
      gold: Math.max(0, 4 - Math.floor(i / 2) + r.int(-1, 1)),
      silver: r.int(0, 3),
      bronze: r.int(0, 4),
    }));
}

export const weightClasses = { male: MALE_WEIGHT_CLASSES, female: FEMALE_WEIGHT_CLASSES };

/** Points history for one athlete over the last 8 ranking periods */
export function pointsHistory(person: Person): { period: string; points: number }[] {
  const r = createRandom(Number(person.code) % 1000);
  const periods = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان"];
  let pts = Math.max(40, person.rankingPoints - r.int(160, 320));
  return periods.map((period, i) => {
    if (i === periods.length - 1) pts = person.rankingPoints;
    else pts = Math.max(20, pts + r.int(-30, 70));
    return { period, points: pts };
  });
}

export type ScoringRule = {
  level: string;
  first: number;
  second: number;
  third: number;
  fifth: number;
  participation: number;
  validity: string;
};

export const scoringRules: ScoringRule[] = [
  { level: "مسابقات بین‌المللی رده G", first: 200, second: 120, third: 72, fifth: 43, participation: 10, validity: "۲۴ ماه" },
  { level: "قهرمانی کشور / انتخابی تیم ملی", first: 120, second: 72, third: 43, fifth: 26, participation: 6, validity: "۱۲ ماه" },
  { level: "لیگ برتر (هر هفته)", first: 40, second: 24, third: 14, fifth: 0, participation: 4, validity: "۱۲ ماه" },
  { level: "قهرمانی استان", first: 48, second: 29, third: 17, fifth: 10, participation: 3, validity: "۱۲ ماه" },
  { level: "رقابت‌های آزاد", first: 30, second: 18, third: 11, fifth: 6, participation: 2, validity: "۶ ماه" },
];
