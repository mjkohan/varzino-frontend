/**
 * A federation profile holds everything that differs between tenants:
 * names, disciplines and categories, and the hand-written content lists.
 * `createDataset(profile)` in ./dataset.ts turns a profile into the full data set.
 */
import type { CompetitionLevel, CompetitionStatus } from "./competitions";
import type { Approval, Activity } from "./dashboard";
import type { Course, Certificate, CourseTrack } from "./education";
import type { Position } from "./organizations";
import type { ScoringRule } from "./ranking";
import type { MyRegistrationStatus } from "./participant";

export type FederationId = "para" | "assoc";

export type Discipline = {
  id: string;
  name: string;
  /** team sports have no individual ranking or bracket */
  team?: boolean;
  categories: { male: readonly string[]; female: readonly string[] };
  /** relative share of athletes in this discipline */
  weight: number;
};

export type CompetitionSpec = {
  id: string;
  title: string;
  level: CompetitionLevel;
  status: CompetitionStatus;
  startIn: number;
  days: number;
  disciplineId: string;
  venue: string;
  city: string;
  ageGroup: string;
  gender: "male" | "female" | "mixed";
  capacity?: number;
  /** province name when a provincial board organizes it */
  organizerProvince?: string;
};

export type VenueSpec = { name: string; city: string; capacity: string; units: string };

export type FederationProfile = {
  id: FederationId;
  /** «فدراسیون ورزش‌های جانبازان و توان‌یابان» */
  name: string;
  /** short form for tight places, e.g. the membership card */
  shortName: string;
  /** Latin code for certificate serials */
  code: string;
  seed: number;
  /** multiplies the national headcounts */
  scale: number;
  /** multiplies money amounts */
  money: number;
  boardName: (province: string) => string;
  clubPrefixes: readonly string[];
  disciplines: Discipline[];
  /** discipline used for the knockout bracket and the participant */
  bracketDisciplineId: string;
  /** [winner score, loser score] for one bracket match */
  matchScore: (rand: () => number) => [number, number];
  /** athlete level, shown where taekwondo showed the belt */
  levelTitle: string;
  athleteLevels: readonly string[];
  staffLevels: readonly string[];
  coachGrades: readonly string[];
  refereeGrades: readonly string[];
  /** para only: impairment type per athlete */
  impairments?: readonly string[];
  athleteAge: [number, number];
  /** «کلاس‌بندی» / «پذیرش», the step before competing */
  checkIn: string;
  /** label of the category column, e.g. «کلاس / وزن» or «ماده» */
  categoryTitle: string;
  timeline: {
    athlete: [string, string][];
    coach: [string, string][];
    referee: [string, string][];
  };
  competitions: CompetitionSpec[];
  liveSchedule: { time: string; title: string; mat: string; state: "done" | "now" | "next" }[];
  medalTable: { provinceId: string; gold: number; silver: number; bronze: number }[];
  scoringRules: ScoringRule[];
  courses: (Omit<Course, "startDate"> & { startIn: number })[];
  certificates: (Omit<Certificate, "issuedAt" | "expiresAt"> & { issuedIn: number; expiresIn?: number })[];
  trackStats: { track: CourseTrack; learners: number; passRate: number }[];
  committees: { id: string; name: string; head: string; members: number }[];
  /** assoc only: the association node placed under the federation */
  association?: { name: string; head: string };
  president: string;
  positions: Omit<Position, "id">[];
  approvals: (Omit<Approval, "waitingSince"> & { waitingDays: number })[];
  activity: (Omit<Activity, "at"> & { day: number; hour: number })[];
  myRegistrations: { competitionId: string; status: MyRegistrationStatus; result?: string; points?: number }[];
  myCourseTitles: [string, string];
  myNotifications: { title: string; body: string; day: number; hour: number; tone: "info" | "warning" | "positive" }[];
  copy: {
    unitLabel: string;
    sponsorDeal: string;
    venues: VenueSpec[];
    venueAttention: [string, string][];
    venueServiceNote: string;
    scoringSystem: string;
    inspectFinding: string;
    majorEvent: string;
    leagueName: string;
    leagueTeams: [string, string, string, string, string, string];
    teams: string[];
    /** five camps: two running, one dispatch, one planned, one finished */
    camps: { title: string; team: string; place: string; dates: string; members: string }[];
    /** five events: three open, one in design, one finished */
    events: { title: string; type: string; city: string; date: string; fill: string; reg: string }[];
    protestScore: string;
    protestDetail: string;
    protestCheckIn: string;
    drawNote: string;
    /** where the participant plays next, e.g. ["سکو", "۱"] */
    myStation: [string, string];
  };
};
