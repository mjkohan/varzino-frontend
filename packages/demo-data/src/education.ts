import { daysFromNow } from "@varzino/utils";
import type { FederationProfile } from "./federations";

export type CourseStatus = "enrolling" | "running" | "finished" | "planned";
export type CourseTrack = "coaching" | "refereeing" | "medical" | "management";

export type Course = {
  id: string;
  title: string;
  track: CourseTrack;
  level: string;
  status: CourseStatus;
  instructor: string;
  city: string;
  mode: "حضوری" | "مجازی" | "ترکیبی";
  startDate: Date;
  hours: number;
  enrolled: number;
  capacity: number;
  passed?: number;
  /** fee in Rial */
  fee: number;
  prerequisite: string;
};

export const trackLabel: Record<CourseTrack, string> = {
  coaching: "مربیگری",
  refereeing: "داوری",
  medical: "پزشکی و سلامت",
  management: "مدیریت ورزشی",
};

export const courseStatusLabel: Record<CourseStatus, string> = {
  enrolling: "در حال ثبت‌نام",
  running: "در حال برگزاری",
  finished: "پایان‌یافته",
  planned: "برنامه‌ریزی‌شده",
};

export type Certificate = {
  id: string;
  serial: string;
  holder: string;
  course: string;
  issuedAt: Date;
  expiresAt?: Date;
  score: number;
};

export function buildEducation(p: FederationProfile) {
  const courses: Course[] = p.courses.map(({ startIn, ...c }) => ({ ...c, startDate: daysFromNow(startIn) }));
  const courseById = Object.fromEntries(courses.map((c) => [c.id, c])) as Record<string, Course>;
  const certificates: Certificate[] = p.certificates.map(({ issuedIn, expiresIn, ...c }) => ({
    ...c,
    issuedAt: daysFromNow(issuedIn),
    expiresAt: expiresIn === undefined ? undefined : daysFromNow(expiresIn),
  }));
  /** Learners and pass rate per track, current year */
  const trackStats = p.trackStats;
  return { courses, courseById, certificates, trackStats };
}
