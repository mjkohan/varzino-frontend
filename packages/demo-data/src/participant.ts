/**
 * Participant portal: what one athlete sees about themself.
 * The participant is the top athlete of the bracket discipline, the same one the landing page card shows.
 */
import { daysFromNow } from "@varzino/utils";
import type { Competition } from "./competitions";
import type { Course } from "./education";
import type { FederationProfile } from "./federations";
import type { Person } from "./people";

export type MyRegistrationStatus = "pending-payment" | "registered" | "weighed" | "finished";

export type MyRegistration = {
  id: string;
  competition: Competition;
  weight: string;
  status: MyRegistrationStatus;
  result?: string;
  points?: number;
};

export type MyPayment = { id: string; title: string; date: Date; amount: number; status: "paid" | "pending" | "refunded"; ref: string };

export type MyNotification = { id: string; title: string; body: string; at: Date; tone: "info" | "warning" | "positive" };

export function buildParticipant(p: FederationProfile, people: Person[], competitions: Competition[], courses: Course[]) {
  const me: Person =
    people.find((x) => x.role === "athlete" && x.gender === "male" && x.ageGroup === "بزرگسالان" && x.disciplineId === p.bracketDisciplineId) ??
    people[0]!;

  const myRegistrationStatusLabel: Record<MyRegistrationStatus, string> = {
    "pending-payment": "در انتظار پرداخت",
    registered: "ثبت‌نام قطعی",
    weighed: `${p.checkIn} انجام شد`,
    finished: "پایان‌یافته",
  };

  const byId = (id: string) => competitions.find((c) => c.id === id)!;
  const myRegistrations: MyRegistration[] = p.myRegistrations.map((r, i) => ({
    id: `mr${i + 1}`,
    competition: byId(r.competitionId),
    weight: me.category ?? "—",
    status: r.status,
    result: r.result,
    points: r.points,
  }));

  /** Competitions the participant can still register for. */
  const openForMe: Competition[] = competitions.filter(
    (c) =>
      (c.status === "registration" || c.status === "scheduled") &&
      (c.gender === "mixed" || c.gender === me.gender) &&
      c.ageGroup === me.ageGroup &&
      c.disciplineId === me.disciplineId &&
      !myRegistrations.some((r) => r.competition.id === c.id),
  );

  const openCoursesForMe: Course[] = courses.filter((c) => c.status === "enrolling" || c.status === "planned");

  const myCourses = [
    { id: "mc1", title: p.myCourseTitles[0], status: "passed" as const, date: daysFromNow(-38), score: 92, serial: `${p.code}-EDU-۱۴۰۵-۰۸۲۱` },
    { id: "mc2", title: p.myCourseTitles[1], status: "running" as const, date: daysFromNow(-2), progress: 40 },
  ];

  const fee = (id: string) => byId(id)?.fee ?? 3_000_000;
  const myPayments: MyPayment[] = [
    { id: "mp1", title: `ورودیه ${byId(p.myRegistrations[0]!.competitionId).title}`, date: daysFromNow(-12), amount: fee(p.myRegistrations[0]!.competitionId), status: "paid", ref: "۸۴۱۹۹۰۲" },
    { id: "mp2", title: `ورودیه ${byId(p.myRegistrations[1]!.competitionId).title}`, date: daysFromNow(-4), amount: fee(p.myRegistrations[1]!.competitionId), status: "paid", ref: "۸۴۲۰۸۷۱" },
    { id: "mp3", title: `شهریه ${p.myCourseTitles[1]}`, date: daysFromNow(-9), amount: 12_000_000, status: "paid", ref: "۸۴۲۰۳۱۴" },
    { id: "mp4", title: "حق عضویت سالانه ۱۴۰۵", date: daysFromNow(-160), amount: 2_000_000, status: "paid", ref: "۸۳۹۸۸۱۰" },
    { id: "mp5", title: "بازگشت ورودیه جام فجر ۱۴۰۴", date: daysFromNow(-210), amount: -3_500_000, status: "refunded", ref: "۸۳۷۷۰۲۱" },
  ];

  const myWallet = { balance: 8_400_000 };

  const myNotifications: MyNotification[] = p.myNotifications.map(({ day, hour, ...n }, i) => ({ id: `n${i + 1}`, ...n, at: daysFromNow(day, hour) }));

  /** Documents the federation needs on file for the participant. */
  const myDocuments = [
    { id: "doc1", title: "تصویر کارت ملی", status: "approved" as const, updated: daysFromNow(-300) },
    { id: "doc2", title: "عکس پرسنلی", status: "approved" as const, updated: daysFromNow(-300) },
    { id: "doc3", title: "بیمه ورزشی ۱۴۰۵", status: "expiring" as const, updated: daysFromNow(-320) },
    { id: "doc4", title: p.impairments ? "گواهی کلاس‌بندی پزشکی" : "گواهی معاینه پزشکی", status: "approved" as const, updated: daysFromNow(-60) },
  ];

  return {
    me,
    myRegistrationStatusLabel,
    myRegistrations,
    openForMe,
    openCoursesForMe,
    myCourses,
    myPayments,
    myWallet,
    myNotifications,
    myDocuments,
  };
}
