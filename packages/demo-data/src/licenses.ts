import { daysFromNow } from "@varzino/utils";
import { people } from "./people";
import { clubs } from "./people";

export type LicenseType = "club" | "coach" | "referee" | "athlete";
export type LicenseStage = "submitted" | "board" | "federation" | "issued" | "rejected";

export type LicenseRequest = {
  id: string;
  number: string;
  type: LicenseType;
  applicant: string;
  /** person or club id, for linking */
  subjectId: string;
  provinceId: string;
  submittedAt: Date;
  stage: LicenseStage;
  validUntil?: Date;
  missing?: string;
  reviewer?: string;
};

export const licenseTypeLabel: Record<LicenseType, string> = {
  club: "پروانه فعالیت باشگاه",
  coach: "کارت مربیگری",
  referee: "کارت داوری",
  athlete: "کارت عضویت ورزشکار",
};

export const licenseStageLabel: Record<LicenseStage, string> = {
  submitted: "ثبت درخواست",
  board: "بررسی هیئت استان",
  federation: "تأیید فدراسیون",
  issued: "صادر شده",
  rejected: "رد شده",
};

export const licenseStages: LicenseStage[] = ["submitted", "board", "federation", "issued"];

const coaches = people.filter((p) => p.role === "coach");
const referees = people.filter((p) => p.role === "referee");
const athletes = people.filter((p) => p.role === "athlete");

export const licenseRequests: LicenseRequest[] = [
  { id: "l-1", number: "۴۰۵-۱۲۸۴", type: "club", applicant: clubs[3]!.name, subjectId: clubs[3]!.id, provinceId: clubs[3]!.provinceId, submittedAt: daysFromNow(-2), stage: "board", reviewer: "دبیر هیئت استان" },
  { id: "l-2", number: "۴۰۵-۱۲۸۳", type: "coach", applicant: coaches[0]!.fullName, subjectId: coaches[0]!.id, provinceId: coaches[0]!.provinceId, submittedAt: daysFromNow(-3), stage: "federation", reviewer: "کمیته آموزش" },
  { id: "l-3", number: "۴۰۵-۱۲۸۱", type: "referee", applicant: referees[1]!.fullName, subjectId: referees[1]!.id, provinceId: referees[1]!.provinceId, submittedAt: daysFromNow(-4), stage: "submitted", missing: "گواهی دوره دانش‌افزایی" },
  { id: "l-4", number: "۴۰۵-۱۲۷۹", type: "athlete", applicant: athletes[4]!.fullName, subjectId: athletes[4]!.id, provinceId: athletes[4]!.provinceId, submittedAt: daysFromNow(-5), stage: "issued", validUntil: daysFromNow(360) },
  { id: "l-5", number: "۴۰۵-۱۲۷۶", type: "club", applicant: clubs[8]!.name, subjectId: clubs[8]!.id, provinceId: clubs[8]!.provinceId, submittedAt: daysFromNow(-6), stage: "rejected", missing: "استاندارد ایمنی سالن تأیید نشده" },
  { id: "l-6", number: "۴۰۵-۱۲۷۲", type: "coach", applicant: coaches[3]!.fullName, subjectId: coaches[3]!.id, provinceId: coaches[3]!.provinceId, submittedAt: daysFromNow(-7), stage: "issued", validUntil: daysFromNow(358) },
  { id: "l-7", number: "۴۰۵-۱۲۷۰", type: "athlete", applicant: athletes[11]!.fullName, subjectId: athletes[11]!.id, provinceId: athletes[11]!.provinceId, submittedAt: daysFromNow(-7), stage: "board", reviewer: "کارشناس عضویت هیئت" },
  { id: "l-8", number: "۴۰۵-۱۲۶۸", type: "referee", applicant: referees[4]!.fullName, subjectId: referees[4]!.id, provinceId: referees[4]!.provinceId, submittedAt: daysFromNow(-8), stage: "federation", reviewer: "کمیته داوران" },
  { id: "l-9", number: "۴۰۵-۱۲۶۵", type: "athlete", applicant: athletes[19]!.fullName, subjectId: athletes[19]!.id, provinceId: athletes[19]!.provinceId, submittedAt: daysFromNow(-9), stage: "issued", validUntil: daysFromNow(356) },
  { id: "l-10", number: "۴۰۵-۱۲۶۱", type: "coach", applicant: coaches[7]!.fullName, subjectId: coaches[7]!.id, provinceId: coaches[7]!.provinceId, submittedAt: daysFromNow(-11), stage: "submitted", missing: "تصویر کارت ملی خوانا نیست" },
  { id: "l-11", number: "۴۰۵-۱۲۵۸", type: "club", applicant: clubs[14]!.name, subjectId: clubs[14]!.id, provinceId: clubs[14]!.provinceId, submittedAt: daysFromNow(-12), stage: "issued", validUntil: daysFromNow(353) },
  { id: "l-12", number: "۴۰۵-۱۲۵۲", type: "athlete", applicant: athletes[23]!.fullName, subjectId: athletes[23]!.id, provinceId: athletes[23]!.provinceId, submittedAt: daysFromNow(-14), stage: "federation", reviewer: "کارشناس عضویت فدراسیون" },
];

/** Monthly issued licenses by type, last 6 months */
export const licensesIssuedTrend = [
  { month: "خرداد", club: 22, coach: 141, referee: 48, athlete: 2410 },
  { month: "تیر", club: 19, coach: 168, referee: 52, athlete: 2780 },
  { month: "مرداد", club: 25, coach: 152, referee: 39, athlete: 2530 },
  { month: "شهریور", club: 17, coach: 134, referee: 44, athlete: 2290 },
  { month: "مهر", club: 28, coach: 176, referee: 61, athlete: 2960 },
  { month: "آبان", club: 31, coach: 189, referee: 57, athlete: 3340 },
];

/** Average days from submit to issue, per stage */
export const stageDurations = [
  { stage: "بررسی هیئت استان", days: 2.4 },
  { stage: "تأیید فدراسیون", days: 1.6 },
  { stage: "چاپ و صدور", days: 0.5 },
];
