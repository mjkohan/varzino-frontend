/**
 * Persian (fa-IR) formatting helpers.
 * All UI numbers and dates go through these so the screen uses one digit system (Persian) and the Jalali calendar.
 */

const numberFormatter = new Intl.NumberFormat("fa-IR");
const percentFormatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 });
const compactFormatter = new Intl.NumberFormat("fa-IR", { notation: "compact", maximumFractionDigits: 1 });

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** 12345 -> «۱۲٬۳۴۵» */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** 1200000 -> «۱٫۲ میلیون» */
export function formatCompact(value: number): string {
  // Intl inserts a narrow no-break space some fonts do not draw; use a normal space.
  return compactFormatter.format(value).replace(/\s/g, " ");
}

/** 12.5 -> «۱۲٫۵٪» */
export function formatPercent(value: number): string {
  return `${percentFormatter.format(value)}٪`;
}

/** Signed change, e.g. +12 -> «+۱۲٪». Wrap output in <bdi dir="ltr"> in RTL text. */
export function formatSignedPercent(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "−" : "";
  return `${sign}${percentFormatter.format(Math.abs(value))}٪`;
}

/** Converts any Latin digits inside a string to Persian digits. */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)] ?? d);
}

/** Amount in Rial shown as Toman: 125000000 -> «۱۲٬۵۰۰٬۰۰۰ تومان» */
export function formatToman(rial: number, withUnit = true): string {
  const toman = Math.round(rial / 10);
  return withUnit ? `${numberFormatter.format(toman)} تومان` : numberFormatter.format(toman);
}

/** Large Toman amounts in compact form: «۴٫۸ میلیارد تومان» */
export function formatTomanCompact(rial: number): string {
  return `${formatCompact(Math.round(rial / 10))} تومان`;
}

type DateInput = Date | string | number;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

const dateFormatters = {
  short: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "2-digit", day: "2-digit" }),
  medium: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric", month: "long", day: "numeric" }),
  dayMonth: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "long", day: "numeric" }),
  monthYear: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "long", year: "numeric" }),
  month: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { month: "long" }),
  weekday: new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "long", month: "long", day: "numeric" }),
  time: new Intl.DateTimeFormat("fa-IR", { hour: "2-digit", minute: "2-digit", hour12: false }),
} as const;

export type DateStyle = keyof typeof dateFormatters;

/** Jalali date. style: short «۱۴۰۵/۰۹/۰۲», medium «۲ آذر ۱۴۰۵», dayMonth «۲ آذر», monthYear «آذر ۱۴۰۵» */
export function formatDate(value: DateInput, style: DateStyle = "medium"): string {
  return dateFormatters[style].format(toDate(value));
}

export function formatDateTime(value: DateInput): string {
  const d = toDate(value);
  return `${dateFormatters.medium.format(d)}، ساعت ${dateFormatters.time.format(d)}`;
}

const relative = new Intl.RelativeTimeFormat("fa-IR", { numeric: "auto" });

/** «۳ روز پیش», «دیروز», «۲ ساعت پیش» relative to `now`. */
export function formatRelative(value: DateInput, now: DateInput = DEMO_NOW): string {
  const diffMs = toDate(value).getTime() - toDate(now).getTime();
  const minutes = Math.round(diffMs / 60000);
  if (Math.abs(minutes) < 60) return relative.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return relative.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 30) return relative.format(days, "day");
  const months = Math.round(days / 30);
  return relative.format(months, "month");
}

/**
 * Fixed "today" for the demo so server and client render identical output (no hydration mismatch)
 * and demo data always looks fresh relative to it. 2026-11-23 = ۲ آذر ۱۴۰۵.
 */
export const DEMO_NOW = new Date("2026-11-23T09:30:00+03:30");

export function daysFromNow(days: number, hour = 10): Date {
  const d = new Date(DEMO_NOW);
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/** Simple pluralless counter label: (12, "ورزشکار") -> «۱۲ ورزشکار» */
export function count(n: number, noun: string): string {
  return `${formatNumber(n)} ${noun}`;
}
