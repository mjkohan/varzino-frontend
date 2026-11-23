import { daysFromNow } from "@varzino/utils";

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

export const courses: Course[] = [
  { id: "e-1", title: "دوره مربیگری درجه ۳", track: "coaching", level: "مقدماتی", status: "enrolling", instructor: "استاد حمید صادقی", city: "تهران", mode: "حضوری", startDate: daysFromNow(14), hours: 64, enrolled: 38, capacity: 50, fee: 45_000_000, prerequisite: "دان ۱ و ۱۸ سال سن" },
  { id: "e-2", title: "دوره داوری درجه ۲ کیوروگی", track: "refereeing", level: "میانی", status: "running", instructor: "استاد مریم طاهری", city: "اصفهان", mode: "ترکیبی", startDate: daysFromNow(-6), hours: 48, enrolled: 32, capacity: 35, fee: 38_000_000, prerequisite: "کارت داوری درجه ۳ معتبر" },
  { id: "e-3", title: "کارگاه قوانین جدید سیستم امتیازدهی الکترونیک", track: "refereeing", level: "دانش‌افزایی", status: "enrolling", instructor: "کمیته داوران", city: "مجازی", mode: "مجازی", startDate: daysFromNow(5), hours: 8, enrolled: 214, capacity: 400, fee: 0, prerequisite: "داوران دارای کارت فعال" },
  { id: "e-4", title: "کمک‌های اولیه و مدیریت آسیب در مبارزه", track: "medical", level: "عمومی", status: "running", instructor: "دکتر نرگس کریمی", city: "مشهد", mode: "حضوری", startDate: daysFromNow(-2), hours: 16, enrolled: 41, capacity: 45, fee: 12_000_000, prerequisite: "ندارد" },
  { id: "e-5", title: "دوره مربیگری درجه ۲", track: "coaching", level: "میانی", status: "planned", instructor: "استاد علی رضایی", city: "شیراز", mode: "حضوری", startDate: daysFromNow(46), hours: 80, enrolled: 0, capacity: 40, fee: 62_000_000, prerequisite: "کارت مربیگری درجه ۳ و دو سال سابقه" },
  { id: "e-6", title: "آشنایی با مقررات ضد دوپینگ", track: "medical", level: "عمومی", status: "finished", instructor: "دکتر سینا امینی", city: "مجازی", mode: "مجازی", startDate: daysFromNow(-40), hours: 6, enrolled: 386, capacity: 500, passed: 351, fee: 0, prerequisite: "ندارد" },
  { id: "e-7", title: "مدیریت باشگاه و هیئت", track: "management", level: "پیشرفته", status: "finished", instructor: "دکتر فرزاد نوروزی", city: "تهران", mode: "ترکیبی", startDate: daysFromNow(-72), hours: 32, enrolled: 46, capacity: 50, passed: 43, fee: 28_000_000, prerequisite: "مدیران باشگاه و دبیران هیئت" },
  { id: "e-8", title: "دوره داوری درجه ۳ پومسه", track: "refereeing", level: "مقدماتی", status: "finished", instructor: "استاد شیما بهرامی", city: "تبریز", mode: "حضوری", startDate: daysFromNow(-55), hours: 40, enrolled: 29, capacity: 30, passed: 24, fee: 30_000_000, prerequisite: "دان ۲" },
];

export const courseById = Object.fromEntries(courses.map((c) => [c.id, c])) as Record<string, Course>;

export type Certificate = {
  id: string;
  serial: string;
  holder: string;
  course: string;
  issuedAt: Date;
  expiresAt?: Date;
  score: number;
};

export const certificates: Certificate[] = [
  { id: "cert-1", serial: "TKD-EDU-۱۴۰۵-۰۸۱۲", holder: "مهسا یزدانی", course: "آشنایی با مقررات ضد دوپینگ", issuedAt: daysFromNow(-38), score: 92 },
  { id: "cert-2", serial: "TKD-EDU-۱۴۰۵-۰۸۱۳", holder: "پارسا موسوی", course: "آشنایی با مقررات ضد دوپینگ", issuedAt: daysFromNow(-38), score: 86 },
  { id: "cert-3", serial: "TKD-EDU-۱۴۰۵-۰۷۹۰", holder: "رضا حیدری", course: "مدیریت باشگاه و هیئت", issuedAt: daysFromNow(-66), expiresAt: daysFromNow(664), score: 88 },
  { id: "cert-4", serial: "TKD-EDU-۱۴۰۵-۰۷۵۴", holder: "شیما قاسمی", course: "دوره داوری درجه ۳ پومسه", issuedAt: daysFromNow(-50), expiresAt: daysFromNow(680), score: 79 },
  { id: "cert-5", serial: "TKD-EDU-۱۴۰۵-۰۷۵۵", holder: "عرفان باقری", course: "دوره داوری درجه ۳ پومسه", issuedAt: daysFromNow(-50), expiresAt: daysFromNow(680), score: 91 },
];

/** Learners and pass rate per track, current year */
export const trackStats: { track: CourseTrack; learners: number; passRate: number }[] = [
  { track: "coaching", learners: 1240, passRate: 84 },
  { track: "refereeing", learners: 980, passRate: 78 },
  { track: "medical", learners: 1630, passRate: 91 },
  { track: "management", learners: 210, passRate: 88 },
];
