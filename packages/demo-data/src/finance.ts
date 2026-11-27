import { daysFromNow } from "@varzino/utils";
import type { Competition } from "./competitions";
import type { Course } from "./education";
import type { FederationProfile } from "./federations";
import type { Club } from "./people";

export type TxKind = "registration" | "membership" | "course" | "license" | "settlement" | "sponsor" | "refund";
export type TxStatus = "paid" | "pending" | "failed" | "refunded";

export type Transaction = {
  id: string;
  ref: string;
  date: Date;
  kind: TxKind;
  title: string;
  party: string;
  /** Rial, positive = income, negative = outgoing */
  amount: number;
  status: TxStatus;
  method: "درگاه پرداخت" | "کیف پول" | "انتقال بانکی";
};

export const txKindLabel: Record<TxKind, string> = {
  registration: "ورودیه مسابقه",
  membership: "حق عضویت",
  course: "شهریه دوره",
  license: "صدور کارت و پروانه",
  settlement: "تسویه با هیئت",
  sponsor: "حمایت مالی",
  refund: "بازگشت وجه",
};

export const txStatusLabel: Record<TxStatus, string> = {
  paid: "موفق",
  pending: "در انتظار",
  failed: "ناموفق",
  refunded: "بازگشت داده شد",
};

export type Settlement = {
  id: string;
  board: string;
  period: string;
  share: number;
  amount: number;
  status: "paid" | "scheduled" | "awaiting-docs";
  dueDate: Date;
};

const round = (n: number, step = 1_000_000) => Math.max(step, Math.round(n / step) * step);

export function buildFinance(p: FederationProfile, competitions: Competition[], clubs: Club[], courses: Course[]) {
  const m = p.money;
  const wallet = {
    /** Rial */
    balance: round(48_216_500_000 * m, 100_000),
    pendingSettlement: round(6_420_000_000 * m),
    incomeThisMonth: round(17_380_000_000 * m),
    incomeLastMonth: round(14_910_000_000 * m),
    outgoingThisMonth: round(9_240_000_000 * m),
    iban: p.id === "para" ? "IR۸۲ ۰۱۷۰ ۰۰۰۰ ۰۰۲۱ ۴۵۸۷ ۳۰۰۱ ۰۲" : "IR۴۱ ۰۱۷۰ ۰۰۰۰ ۰۰۳۴ ۹۱۲۶ ۵۰۰۴ ۰۷",
  };
  const c = (id: string) => competitions.find((x) => x.id === id)?.title ?? "";
  const course = (i: number) => courses[i]?.title ?? "";

  const transactions: Transaction[] = [
    { id: "tx-1", ref: "۸۴۲۱۹۰۳", date: daysFromNow(0, 9), kind: "registration", title: `ورودیه ${c("c-1")}`, party: clubs[0]!.name, amount: round(18_000_000 * m * 2), status: "paid", method: "درگاه پرداخت" },
    { id: "tx-2", ref: "۸۴۲۱۸۷۷", date: daysFromNow(0, 8), kind: "membership", title: "حق عضویت سالانه ۲۴ ورزشکار", party: p.boardName("البرز"), amount: round(72_000_000 * m * 2), status: "paid", method: "کیف پول" },
    { id: "tx-3", ref: "۸۴۲۱۶۵۲", date: daysFromNow(-1, 17), kind: "settlement", title: "تسویه سهم هیئت از ورودیه‌ها، آبان", party: p.boardName("اصفهان"), amount: -round(1_240_000_000 * m), status: "paid", method: "انتقال بانکی" },
    { id: "tx-4", ref: "۸۴۲۱۶۱۰", date: daysFromNow(-1, 15), kind: "course", title: `شهریه ${course(0)}`, party: "علی کریمی", amount: courses[0]?.fee || 25_000_000, status: "pending", method: "درگاه پرداخت" },
    { id: "tx-5", ref: "۸۴۲۱۵۹۸", date: daysFromNow(-1, 11), kind: "sponsor", title: `قسط دوم قرارداد حمایت ${p.copy.leagueName}`, party: p.copy.sponsorDeal, amount: round(3_500_000_000 * m), status: "paid", method: "انتقال بانکی" },
    { id: "tx-6", ref: "۸۴۲۱۴۴۰", date: daysFromNow(-2, 16), kind: "license", title: "صدور پروانه فعالیت باشگاه", party: clubs[2]!.name, amount: 25_000_000, status: "paid", method: "درگاه پرداخت" },
    { id: "tx-7", ref: "۸۴۲۱۴۰۲", date: daysFromNow(-2, 10), kind: "refund", title: "بازگشت ورودیه، انصراف پیش از مهلت", party: "فاطمه رحیمی", amount: -3_000_000, status: "refunded", method: "کیف پول" },
    { id: "tx-8", ref: "۸۴۲۱۳۵۵", date: daysFromNow(-3, 13), kind: "registration", title: `ورودیه ${c("c-2")}`, party: clubs[3]!.name, amount: round(27_000_000 * m * 2), status: "failed", method: "درگاه پرداخت" },
    { id: "tx-9", ref: "۸۴۲۱۲۹۸", date: daysFromNow(-3, 9), kind: "settlement", title: "تسویه سهم هیئت از حق عضویت", party: p.boardName("مازندران"), amount: -round(860_000_000 * m), status: "pending", method: "انتقال بانکی" },
    { id: "tx-10", ref: "۸۴۲۱۲۰۱", date: daysFromNow(-4, 12), kind: "membership", title: "حق عضویت سالانه ۱۱۲ ورزشکار", party: p.boardName("تهران"), amount: round(336_000_000 * m * 2), status: "paid", method: "کیف پول" },
    { id: "tx-11", ref: "۸۴۲۱۱۸۸", date: daysFromNow(-4, 10), kind: "course", title: `شهریه ${course(3)}`, party: "مریم صادقی", amount: courses[3]?.fee || 12_000_000, status: "paid", method: "درگاه پرداخت" },
    { id: "tx-12", ref: "۸۴۲۱۰۴۶", date: daysFromNow(-5, 14), kind: "license", title: "صدور کارت داوری ملی", party: "حسین طاهری", amount: 8_000_000, status: "paid", method: "کیف پول" },
  ];

  /** Monthly income and outgoing, Rial, last 12 months */
  const cashflow = (
    [
      ["آذر", 11.2e9, 7.1e9], ["دی", 10.4e9, 6.8e9], ["بهمن", 12.9e9, 8.2e9], ["اسفند", 9.6e9, 9.9e9],
      ["فروردین", 7.8e9, 5.4e9], ["اردیبهشت", 13.1e9, 7.7e9], ["خرداد", 14.6e9, 8.9e9], ["تیر", 15.9e9, 9.4e9],
      ["مرداد", 14.2e9, 8.8e9], ["شهریور", 13.3e9, 8.1e9], ["مهر", 14.9e9, 8.6e9], ["آبان", 17.4e9, 9.2e9],
    ] as const
  ).map(([month, income, outgoing]) => ({ month, income: round(income * m, 1e8), outgoing: round(outgoing * m, 1e8) }));

  /** Income by source this year, Rial */
  const incomeBySource: { kind: TxKind; amount: number }[] = [
    { kind: "membership", amount: round(58.2e9 * m, 1e8) },
    { kind: "registration", amount: round(41.6e9 * m, 1e8) },
    { kind: "sponsor", amount: round(28.0e9 * m, 1e8) },
    { kind: "course", amount: round(17.9e9 * m, 1e8) },
    { kind: "license", amount: round(9.3e9 * m, 1e8) },
  ];

  const settlements: Settlement[] = (
    [
      ["s-1", "تهران", 2_180_000_000, "scheduled", 3],
      ["s-2", "اصفهان", 1_240_000_000, "paid", -1],
      ["s-3", "مازندران", 860_000_000, "scheduled", 3],
      ["s-4", "خراسان رضوی", 1_020_000_000, "awaiting-docs", 5],
      ["s-5", "فارس", 740_000_000, "scheduled", 3],
    ] as const
  ).map(([id, province, amount, status, due]) => ({
    id,
    board: p.boardName(province),
    period: "آبان ۱۴۰۵",
    share: 30,
    amount: round(amount * m),
    status,
    dueDate: daysFromNow(due),
  }));

  return { wallet, transactions, cashflow, incomeBySource, settlements };
}

export const settlementStatusLabel: Record<Settlement["status"], string> = {
  paid: "پرداخت شد",
  scheduled: "زمان‌بندی‌شده",
  "awaiting-docs": "در انتظار مدارک",
};
