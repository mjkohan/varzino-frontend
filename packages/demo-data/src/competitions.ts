import { daysFromNow } from "@varzino/utils";
import { createRandom } from "./random";
import type { CompetitionSpec, FederationProfile } from "./federations";
import { categoryLabel, type Person } from "./people";

export type CompetitionStatus = "draft" | "registration" | "scheduled" | "live" | "finished";
export type CompetitionLevel = "national" | "provincial" | "league" | "selection" | "open";

export type Competition = {
  id: string;
  title: string;
  level: CompetitionLevel;
  status: CompetitionStatus;
  ageGroup: string;
  disciplineId: string;
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

export const roundLabel = ["یک‌چهارم نهایی", "نیمه‌نهایی", "فینال"];

export type WeightCategory = {
  id: string;
  label: string;
  registered: number;
  status: "done" | "in-progress" | "upcoming";
  mat: number;
};

export type BracketMatch = {
  id: string;
  round: number;
  a?: { person: Person; score?: number; seed?: number };
  b?: { person: Person; score?: number; seed?: number };
  winner?: "a" | "b";
  mat: number;
  time: string;
};

export type ScheduleItem = { time: string; title: string; mat: string; state: "done" | "now" | "next" };

export type MedalRow = { provinceId: string; gold: number; silver: number; bronze: number };

const BASE_TREND: [string, number, number][] = [
  ["آذر", 3120, 2760], ["دی", 2840, 2610], ["بهمن", 3460, 2980], ["اسفند", 2210, 2050],
  ["فروردین", 1980, 1870], ["اردیبهشت", 3890, 3240], ["خرداد", 4320, 3510], ["تیر", 4780, 3920],
  ["مرداد", 4410, 3780], ["شهریور", 3960, 3390], ["مهر", 4690, 3720], ["آبان", 5240, 4010],
];

export function buildCompetitions(p: FederationProfile, people: Person[]) {
  const disciplineById = Object.fromEntries(p.disciplines.map((d) => [d.id, d]));

  function comp(spec: CompetitionSpec): Competition {
    const { id, level, status, startIn, days } = spec;
    const r = createRandom(id.length * 97 + startIn + p.seed);
    const capacity = spec.capacity ?? r.int(10, 32) * 10;
    const ratio = status === "registration" ? r.int(35, 85) / 100 : status === "draft" ? 0 : r.int(88, 100) / 100;
    const d = disciplineById[spec.disciplineId];
    return {
      id,
      title: spec.title,
      level,
      status,
      ageGroup: spec.ageGroup,
      gender: spec.gender,
      disciplineId: spec.disciplineId,
      venue: spec.venue,
      city: spec.city,
      startDate: daysFromNow(startIn, 9),
      endDate: daysFromNow(startIn + days - 1, 18),
      registrationDeadline: daysFromNow(startIn - 10, 23),
      registered: Math.round(capacity * ratio),
      capacity,
      categories: d ? (spec.gender === "female" ? d.categories.female.length : d.categories.male.length) : 8,
      referees: r.int(12, 32),
      fee: Math.round(r.pick([2_500_000, 3_000_000, 4_500_000, 6_000_000]) * (p.money < 0.3 ? 0.6 : 0.8)),
      rankingFactor: level === "national" || level === "selection" ? 1 : level === "league" ? 0.8 : level === "provincial" ? 0.4 : 0.25,
      organizer: spec.organizerProvince ? p.boardName(spec.organizerProvince) : "کمیته مسابقات فدراسیون",
    };
  }

  const competitions: Competition[] = p.competitions.map(comp);
  const competitionById = Object.fromEntries(competitions.map((c) => [c.id, c])) as Record<string, Competition>;

  /** Categories of one competition: weight classes, sport classes or events. */
  function categoriesFor(c: Competition): WeightCategory[] {
    const d = disciplineById[c.disciplineId] ?? p.disciplines[0]!;
    const labels = (c.gender === "female" ? d.categories.female : d.categories.male).map(categoryLabel);
    const r = createRandom(c.id.length * 13 + p.seed);
    return labels.map((label, i) => ({
      id: `${c.id}-w${i}`,
      label,
      registered: r.int(8, 36),
      status: c.status === "finished" ? "done" : c.status === "live" ? (i < 3 ? "done" : i < 5 ? "in-progress" : "upcoming") : "upcoming",
      mat: (i % 4) + 1,
    }));
  }

  /** Eight-athlete single elimination bracket with deterministic results. */
  function bracketFor(competitionId: string): BracketMatch[][] {
    const r = createRandom(competitionId.length * 31 + 7 + p.seed);
    const athletes = people
      .filter((x) => x.role === "athlete" && x.gender === "male" && x.disciplineId === p.bracketDisciplineId)
      .slice(0, 8);
    const rounds: BracketMatch[][] = [];
    const seeded = athletes.map((x, i) => ({ person: x, seed: i + 1 }));
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
        const [win, lose] = p.matchScore(r.next);
        const winner: "a" | "b" = r.chance(0.62) ? "a" : "b";
        const aScore = winner === "a" ? win : lose;
        const bScore = winner === "a" ? lose : win;
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

  const liveSchedule: ScheduleItem[] = p.liveSchedule;
  const medalTable: MedalRow[] = p.medalTable;
  const registrationTrend = BASE_TREND.map(([month, thisYear, lastYear]) => ({
    month,
    thisYear: Math.round(thisYear * p.scale),
    lastYear: Math.round(lastYear * p.scale),
  }));

  return { competitions, competitionById, categoriesFor, bracketFor, liveSchedule, medalTable, registrationTrend };
}
