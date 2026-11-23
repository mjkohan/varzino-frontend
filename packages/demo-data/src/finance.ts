import { daysFromNow } from "@varzino/utils";

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

export const wallet = {
  /** Rial */
  balance: 48_216_500_000,
  pendingSettlement: 6_420_000_000,
  incomeThisMonth: 17_380_000_000,
  incomeLastMonth: 14_910_000_000,
  outgoingThisMonth: 9_240_000_000,
  iban: "IR۸۲ ۰۱۷۰ ۰۰۰۰ ۰۰۲۱ ۴۵۸۷ ۳۰۰۱ ۰۲",
};

export const transactions: Transaction[] = [
  { id: "tx-1", ref: "۸۴۲۱۹۰۳", date: daysFromNow(0, 9), kind: "registration", title: "ورودیه قهرمانی کشور بزرگسالان", party: "باشگاه پیشگامان", amount: 18_000_000, status: "paid", method: "درگاه پرداخت" },
  { id: "tx-2", ref: "۸۴۲۱۸۷۷", date: daysFromNow(0, 8), kind: "membership", title: "حق عضویت سالانه ۲۴ ورزشکار", party: "هیئت تکواندو البرز", amount: 72_000_000, status: "paid", method: "کیف پول" },
  { id: "tx-3", ref: "۸۴۲۱۶۵۲", date: daysFromNow(-1, 17), kind: "settlement", title: "تسویه سهم هیئت از ورودیه‌ها، آبان", party: "هیئت تکواندو اصفهان", amount: -1_240_000_000, status: "paid", method: "انتقال بانکی" },
  { id: "tx-4", ref: "۸۴۲۱۶۱۰", date: daysFromNow(-1, 15), kind: "course", title: "شهریه دوره مربیگری درجه ۳", party: "علی کریمی", amount: 45_000_000, status: "pending", method: "درگاه پرداخت" },
  { id: "tx-5", ref: "۸۴۲۱۵۹۸", date: daysFromNow(-1, 11), kind: "sponsor", title: "قسط دوم قرارداد حمایت لیگ برتر", party: "شرکت حامی لیگ", amount: 3_500_000_000, status: "paid", method: "انتقال بانکی" },
  { id: "tx-6", ref: "۸۴۲۱۴۴۰", date: daysFromNow(-2, 16), kind: "license", title: "صدور پروانه فعالیت باشگاه", party: "آکادمی سپهر", amount: 25_000_000, status: "paid", method: "درگاه پرداخت" },
  { id: "tx-7", ref: "۸۴۲۱۴۰۲", date: daysFromNow(-2, 10), kind: "refund", title: "بازگشت ورودیه، انصراف پیش از مهلت", party: "فاطمه رحیمی", amount: -3_000_000, status: "refunded", method: "کیف پول" },
  { id: "tx-8", ref: "۸۴۲۱۳۵۵", date: daysFromNow(-3, 13), kind: "registration", title: "ورودیه انتخابی تیم ملی جوانان", party: "خانه تکواندو شیراز", amount: 27_000_000, status: "failed", method: "درگاه پرداخت" },
  { id: "tx-9", ref: "۸۴۲۱۲۹۸", date: daysFromNow(-3, 9), kind: "settlement", title: "تسویه سهم هیئت از حق عضویت", party: "هیئت تکواندو مازندران", amount: -860_000_000, status: "pending", method: "انتقال بانکی" },
  { id: "tx-10", ref: "۸۴۲۱۲۰۱", date: daysFromNow(-4, 12), kind: "membership", title: "حق عضویت سالانه ۱۱۲ ورزشکار", party: "هیئت تکواندو تهران", amount: 336_000_000, status: "paid", method: "کیف پول" },
  { id: "tx-11", ref: "۸۴۲۱۱۸۸", date: daysFromNow(-4, 10), kind: "course", title: "شهریه کارگاه کمک‌های اولیه", party: "مریم صادقی", amount: 12_000_000, status: "paid", method: "درگاه پرداخت" },
  { id: "tx-12", ref: "۸۴۲۱۰۴۶", date: daysFromNow(-5, 14), kind: "license", title: "صدور کارت داوری ملی", party: "حسین طاهری", amount: 8_000_000, status: "paid", method: "کیف پول" },
];

/** Monthly income and outgoing, Rial, last 12 months */
export const cashflow = [
  { month: "آذر", income: 11.2e9, outgoing: 7.1e9 },
  { month: "دی", income: 10.4e9, outgoing: 6.8e9 },
  { month: "بهمن", income: 12.9e9, outgoing: 8.2e9 },
  { month: "اسفند", income: 9.6e9, outgoing: 9.9e9 },
  { month: "فروردین", income: 7.8e9, outgoing: 5.4e9 },
  { month: "اردیبهشت", income: 13.1e9, outgoing: 7.7e9 },
  { month: "خرداد", income: 14.6e9, outgoing: 8.9e9 },
  { month: "تیر", income: 15.9e9, outgoing: 9.4e9 },
  { month: "مرداد", income: 14.2e9, outgoing: 8.8e9 },
  { month: "شهریور", income: 13.3e9, outgoing: 8.1e9 },
  { month: "مهر", income: 14.9e9, outgoing: 8.6e9 },
  { month: "آبان", income: 17.4e9, outgoing: 9.2e9 },
];

/** Income by source this year, Rial */
export const incomeBySource: { kind: TxKind; amount: number }[] = [
  { kind: "membership", amount: 58.2e9 },
  { kind: "registration", amount: 41.6e9 },
  { kind: "sponsor", amount: 28.0e9 },
  { kind: "course", amount: 17.9e9 },
  { kind: "license", amount: 9.3e9 },
];

export type Settlement = {
  id: string;
  board: string;
  period: string;
  share: number;
  amount: number;
  status: "paid" | "scheduled" | "awaiting-docs";
  dueDate: Date;
};

export const settlements: Settlement[] = [
  { id: "s-1", board: "هیئت تکواندو تهران", period: "آبان ۱۴۰۵", share: 30, amount: 2_180_000_000, status: "scheduled", dueDate: daysFromNow(3) },
  { id: "s-2", board: "هیئت تکواندو اصفهان", period: "آبان ۱۴۰۵", share: 30, amount: 1_240_000_000, status: "paid", dueDate: daysFromNow(-1) },
  { id: "s-3", board: "هیئت تکواندو مازندران", period: "آبان ۱۴۰۵", share: 30, amount: 860_000_000, status: "scheduled", dueDate: daysFromNow(3) },
  { id: "s-4", board: "هیئت تکواندو خراسان رضوی", period: "آبان ۱۴۰۵", share: 30, amount: 1_020_000_000, status: "awaiting-docs", dueDate: daysFromNow(5) },
  { id: "s-5", board: "هیئت تکواندو فارس", period: "آبان ۱۴۰۵", share: 30, amount: 740_000_000, status: "scheduled", dueDate: daysFromNow(3) },
];

export const settlementStatusLabel: Record<Settlement["status"], string> = {
  paid: "پرداخت شد",
  scheduled: "زمان‌بندی‌شده",
  "awaiting-docs": "در انتظار مدارک",
};
