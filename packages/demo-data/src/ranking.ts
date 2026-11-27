import type { FederationProfile } from "./federations";
import type { Person } from "./people";
import { createRandom } from "./random";

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

export type ScoringRule = {
  level: string;
  first: number;
  second: number;
  third: number;
  fifth: number;
  participation: number;
  validity: string;
};

export function buildRanking(p: FederationProfile, people: Person[]) {
  /** Individual disciplines only; team sports are ranked by league tables. */
  const rankingDisciplines = p.disciplines.filter((d) => !d.team);

  function rankingFor(gender: "male" | "female", category?: string, disciplineId: string = p.bracketDisciplineId): RankingEntry[] {
    const inDiscipline = people.filter((x) => x.role === "athlete" && x.gender === gender && x.disciplineId === disciplineId);
    const pool = inDiscipline.filter((x) => x.ageGroup === "بزرگسالان").filter((x) => !category || x.category === category);
    const source = pool.length >= 6 ? pool : inDiscipline.length >= 3 ? inDiscipline : people.filter((x) => x.role === "athlete" && x.gender === gender);
    const r = createRandom((category ?? "all").length * 101 + (gender === "male" ? 1 : 2) + disciplineId.length * 7);
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

  /** Points history for one athlete over the last 8 ranking periods */
  function pointsHistory(person: Person): { period: string; points: number }[] {
    const r = createRandom(Number(person.code) % 1000);
    const periods = ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان"];
    let pts = Math.max(40, person.rankingPoints - r.int(160, 320));
    return periods.map((period, i) => {
      if (i === periods.length - 1) pts = person.rankingPoints;
      else pts = Math.max(20, pts + r.int(-30, 70));
      return { period, points: pts };
    });
  }

  return { rankingDisciplines, rankingFor, pointsHistory, scoringRules: p.scoringRules };
}
