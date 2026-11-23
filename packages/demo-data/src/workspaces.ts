/**
 * Working screens for the 13 modules that started as summaries.
 * Each workspace is a list of records with a status, an optional approval workflow,
 * a detail panel and a "create" form. Rendered by apps/panel/components/workspace.tsx.
 */
import type { Tone } from "./overviews";

export type ColumnKind = "title" | "text" | "code" | "person" | "progress" | "muted";

export type WsColumn = { key: string; label: string; kind?: ColumnKind };

export type WsField = {
  key: string;
  label: string;
  type: "text" | "select" | "textarea" | "number" | "date";
  options?: string[];
  required?: boolean;
  hint?: string;
  placeholder?: string;
  ltr?: boolean;
};

export type WsRecord = {
  id: string;
  cells: Record<string, string>;
  status: string;
  /** index into workflow.stages */
  stage?: number;
  /** extra rows shown in the detail panel */
  extra?: [string, string][];
  /** a short note shown in the detail panel, e.g. a finding or a ruling */
  note?: string;
};

export type Workspace = {
  /** singular noun, e.g. «نامه» */
  entity: string;
  title: string;
  description: string;
  columns: WsColumn[];
  statuses: Record<string, { label: string; tone: Tone }>;
  workflow?: {
    stages: string[];
    /** button label for advancing from stage i, falls back to a default */
    actions?: string[];
    /** status a record gets while it is inside the workflow, per stage */
    stageStatus?: string[];
    doneStatus: string;
    rejectStatus?: string;
    rejectLabel?: string;
    /** stage index that requires a digital signature (OTP) to pass */
    signatureStage?: number;
  };
  create: { label: string; title: string; submit: string; success: string; status: string; fields: WsField[] };
  records: WsRecord[];
};

const r = (id: string, cells: Record<string, string>, status: string, stage?: number, extra?: [string, string][], note?: string): WsRecord => ({
  id,
  cells,
  status,
  stage,
  extra,
  note,
});

const PROVINCES = ["تهران", "اصفهان", "خراسان رضوی", "فارس", "خوزستان", "آذربایجان شرقی", "مازندران", "البرز", "کرمان", "گیلان", "یزد", "قم"];
const COMMITTEES = ["کمیته فنی و تیم‌های ملی", "کمیته مسابقات", "کمیته داوران", "کمیته آموزش", "کمیته پزشکی", "کمیته انضباطی", "کمیته توسعه بانوان"];

export const workspaces: Record<string, Workspace> = {
  /* ------------------------------------------------------------------ */
  users: {
    entity: "کاربر",
    title: "کاربران و درخواست‌های دسترسی",
    description: "هر کاربر یک نقش و یک دامنه دارد. درخواست دسترسی پس از تأیید مدیر واحد و فدراسیون فعال می‌شود.",
    columns: [
      { key: "name", label: "کاربر", kind: "person" },
      { key: "unit", label: "واحد" },
      { key: "role", label: "نقش" },
      { key: "scope", label: "دامنه دسترسی", kind: "muted" },
      { key: "last", label: "آخرین ورود", kind: "muted" },
    ],
    statuses: {
      requested: { label: "درخواست جدید", tone: "warning" },
      review: { label: "در حال بررسی", tone: "info" },
      active: { label: "فعال", tone: "positive" },
      disabled: { label: "غیرفعال", tone: "neutral" },
      rejected: { label: "رد شده", tone: "negative" },
    },
    workflow: {
      stages: ["ثبت درخواست", "تأیید مدیر واحد", "تأیید فدراسیون", "فعال"],
      actions: ["ارسال برای مدیر واحد", "تأیید و ارسال به فدراسیون", "فعال‌سازی حساب"],
      stageStatus: ["requested", "review", "review", "active"],
      doneStatus: "active",
      rejectStatus: "rejected",
      rejectLabel: "رد درخواست",
    },
    create: {
      label: "افزودن کاربر",
      title: "افزودن کاربر جدید",
      submit: "ثبت و ارسال برای تأیید",
      success: "کاربر ثبت شد و برای تأیید مدیر واحد ارسال شد",
      status: "requested",
      fields: [
        { key: "name", label: "نام و نام خانوادگی", type: "text", required: true },
        { key: "mobile", label: "شماره همراه", type: "text", required: true, ltr: true, placeholder: "۰۹۱۲۱۲۳۴۵۶۷" },
        { key: "unit", label: "واحد", type: "select", options: ["دبیرخانه فدراسیون", "کمیته مسابقات", "کمیته داوران", "هیئت تکواندو تهران", "هیئت تکواندو اصفهان", "باشگاه پیشگامان"] },
        { key: "role", label: "نقش", type: "select", options: ["کارشناس فدراسیون", "کارشناس هیئت", "کارشناس مسابقات", "کارشناس مالی", "مدیر باشگاه", "بازرس"] },
        { key: "scope", label: "دامنه دسترسی", type: "select", options: ["سراسر کشور", "استان تهران", "استان اصفهان", "فقط باشگاه خود"] },
      ],
    },
    records: [
      r("u1", { name: "سمانه رضایی", unit: "هیئت تکواندو گیلان", role: "کارشناس مسابقات", scope: "استان گیلان", last: "—" }, "requested", 0, [["شماره همراه", "۰۹۱۱۲۳۴۸۸۷۱"], ["درخواست‌کننده", "رئیس هیئت گیلان"]]),
      r("u2", { name: "مرتضی بابایی", unit: "باشگاه آرش", role: "مدیر باشگاه", scope: "باشگاه آرش", last: "—" }, "review", 1, [["شماره همراه", "۰۹۱۳۶۶۲۱۰۴۵"], ["مدارک", "حکم مدیریت باشگاه، بارگذاری شده"]]),
      r("u3", { name: "یاسین کرمانی", unit: "هیئت تکواندو یزد", role: "کارشناس مالی", scope: "استان یزد", last: "—" }, "review", 2, [["شماره همراه", "۰۹۱۳۴۱۸۷۷۲۰"]]),
      r("u4", { name: "کیان احمدی", unit: "کمیته داوران", role: "ناظر داوری", scope: "سراسر کشور", last: "امروز، ۰۸:۴۱" }, "active", 3, [["ورود دومرحله‌ای", "فعال"], ["تعداد ورود در ۳۰ روز", "۴۲"]]),
      r("u5", { name: "آیدا ملکی", unit: "دبیرخانه فدراسیون", role: "مسئول دبیرخانه", scope: "سراسر کشور", last: "دیروز، ۱۶:۱۰" }, "active", 3, [["ورود دومرحله‌ای", "فعال"]]),
      r("u6", { name: "سارا کریمی", unit: "هیئت تکواندو اصفهان", role: "رئیس هیئت", scope: "استان اصفهان", last: "امروز، ۰۹:۰۲" }, "active", 3),
      r("u7", { name: "بهنام عباسی", unit: "باشگاه پیشگامان", role: "مدیر باشگاه", scope: "باشگاه پیشگامان", last: "۳ روز پیش" }, "active", 3),
      r("u8", { name: "داوود قنبری", unit: "هیئت تکواندو قم", role: "کارشناس هیئت", scope: "استان قم", last: "۹۴ روز پیش" }, "disabled", 3, [["دلیل", "بیش از ۹۰ روز بدون ورود"]]),
    ],
  },

  /* ------------------------------------------------------------------ */
  documents: {
    entity: "نامه",
    title: "دبیرخانه، مکاتبات و قراردادها",
    description: "هر نامه شماره دبیرخانه می‌گیرد، بین واحدها ارجاع می‌شود و پس از امضای دیجیتال ارسال و بایگانی می‌شود.",
    columns: [
      { key: "number", label: "شماره", kind: "code" },
      { key: "subject", label: "موضوع", kind: "title" },
      { key: "kind", label: "نوع" },
      { key: "party", label: "از / به", kind: "muted" },
      { key: "date", label: "تاریخ", kind: "muted" },
    ],
    statuses: {
      draft: { label: "پیش‌نویس", tone: "neutral" },
      routing: { label: "در گردش", tone: "info" },
      sign: { label: "در انتظار امضا", tone: "warning" },
      sent: { label: "ارسال و بایگانی شد", tone: "positive" },
    },
    workflow: {
      stages: ["پیش‌نویس", "بررسی کارشناس", "امضای دیجیتال", "ارسال و بایگانی"],
      actions: ["ارجاع برای بررسی", "تأیید متن و ارسال برای امضا", "امضای دیجیتال"],
      stageStatus: ["draft", "routing", "sign", "sent"],
      doneStatus: "sent",
      signatureStage: 2,
    },
    create: {
      label: "نامه جدید",
      title: "ثبت نامه جدید",
      submit: "ثبت در دبیرخانه",
      success: "نامه با شماره دبیرخانه ثبت شد",
      status: "draft",
      fields: [
        { key: "kind", label: "نوع", type: "select", options: ["نامه صادره", "نامه وارده", "بخشنامه", "قرارداد"] },
        { key: "subject", label: "موضوع", type: "text", required: true },
        { key: "party", label: "گیرنده", type: "select", options: ["همه هیئت‌های استانی", "هیئت تکواندو تهران", "کمیته فنی و تیم‌های ملی", "وزارت ورزش و جوانان", "کمیته ملی المپیک"] },
        { key: "body", label: "متن نامه", type: "textarea", required: true },
      ],
    },
    records: [
      r("d1", { number: "۱۴۰۵/ص/۸۸۲۴", subject: "دعوت به اردوی آماده‌سازی قهرمانی آسیا", kind: "نامه صادره", party: "به ۱۸ ورزشکار و باشگاه‌ها", date: "۲ آذر" }, "sign", 2, [["پیوست", "فهرست دعوت‌شدگان، ۱ فایل"], ["امضاکننده", "دبیر کل فدراسیون"]]),
      r("d2", { number: "۱۴۰۵/و/۳۱۰۴", subject: "درخواست میزبانی قهرمانی کشور نوجوانان", kind: "نامه وارده", party: "از هیئت تکواندو یزد", date: "۱ آذر" }, "routing", 1, [["ارجاع به", "کمیته مسابقات"], ["مهلت پاسخ", "۸ آذر"]]),
      r("d3", { number: "۱۴۰۵/ق/۰۹۳", subject: "قرارداد اجاره سالن ۱۲ هزار نفری آزادی", kind: "قرارداد", party: "مجموعه ورزشی آزادی", date: "۳۰ آبان" }, "sign", 2, [["مبلغ", "۸۵۰ میلیون تومان"], ["مدت", "۳ روز"]]),
      r("d4", { number: "۱۴۰۵/ب/۰۴۱", subject: "ابلاغ آیین‌نامه جدید امتیازدهی رنکینگ", kind: "بخشنامه", party: "به همه هیئت‌های استانی", date: "۲۸ آبان" }, "sent", 3, [["خوانده‌شده", "۳۱ از ۳۱ هیئت"]]),
      r("d5", { number: "۱۴۰۵/و/۳۰۹۸", subject: "گزارش حادثه در مسابقه استانی", kind: "نامه وارده", party: "از هیئت تکواندو لرستان", date: "۲۷ آبان" }, "routing", 1, [["ارجاع به", "کمیته پزشکی"]]),
      r("d6", { number: "۱۴۰۵/ص/پیش‌نویس", subject: "پاسخ به استعلام بیمه ورزشی", kind: "نامه صادره", party: "به صندوق بیمه ورزشی", date: "امروز" }, "draft", 0),
      r("d7", { number: "۱۴۰۵/ق/۰۹۱", subject: "قرارداد حمایت مالی لیگ برتر", kind: "قرارداد", party: "شرکت حامی لیگ", date: "۲۰ آبان" }, "sent", 3, [["مبلغ", "۱۲ میلیارد تومان"], ["امضا", "دیجیتال، دو طرف"]]),
    ],
  },

  /* ------------------------------------------------------------------ */
  messaging: {
    entity: "اطلاعیه",
    title: "اطلاعیه‌ها و بخشنامه‌ها",
    description: "اطلاعیه برای نقش یا استان مشخص ارسال می‌شود و گزارش تحویل و خوانده‌شدن دارد.",
    columns: [
      { key: "title", label: "عنوان", kind: "title" },
      { key: "audience", label: "مخاطب" },
      { key: "channel", label: "کانال", kind: "muted" },
      { key: "date", label: "ارسال", kind: "muted" },
      { key: "read", label: "خوانده‌شده", kind: "progress" },
    ],
    statuses: {
      draft: { label: "پیش‌نویس", tone: "neutral" },
      scheduled: { label: "زمان‌بندی‌شده", tone: "info" },
      sent: { label: "ارسال شد", tone: "positive" },
    },
    workflow: {
      stages: ["پیش‌نویس", "تأیید روابط عمومی", "ارسال"],
      actions: ["ارسال برای تأیید", "تأیید و ارسال"],
      stageStatus: ["draft", "scheduled", "sent"],
      doneStatus: "sent",
    },
    create: {
      label: "اطلاعیه جدید",
      title: "نوشتن اطلاعیه",
      submit: "ذخیره و ارسال برای تأیید",
      success: "اطلاعیه ذخیره شد و برای تأیید روابط عمومی رفت",
      status: "draft",
      fields: [
        { key: "title", label: "عنوان", type: "text", required: true },
        { key: "audience", label: "مخاطب", type: "select", options: ["همه هیئت‌ها", "مربیان دارای کارت", "داوران", "مدیران باشگاه‌ها", "ورزشکاران تیم ملی"] },
        { key: "channel", label: "کانال", type: "select", options: ["اعلان + پیامک", "پیام داخلی", "پیامک", "اعلان"] },
        { key: "body", label: "متن", type: "textarea", required: true },
      ],
    },
    records: [
      r("m1", { title: "مهلت ثبت‌نام انتخابی جوانان بانوان", audience: "مربیان و باشگاه‌های بانوان", channel: "اعلان + پیامک", date: "۲ آذر", read: "۷۹" }, "sent", 2, [["تحویل‌شده", "۱٬۲۴۰ از ۱٬۲۶۲"]]),
      r("m2", { title: "تغییر زمان وزن‌کشی قهرمانی کشور", audience: "تیم‌های اعزامی", channel: "پیامک", date: "۱ آذر", read: "۹۶" }, "sent", 2),
      r("m3", { title: "فراخوان دوره داوری درجه ۲", audience: "داوران درجه ۳", channel: "اعلان", date: "۲۹ آبان", read: "۵۴" }, "sent", 2, [["هنوز ندیده‌اند", "۱۴۲ داور"]]),
      r("m4", { title: "یادآوری تمدید بیمه ورزشی", audience: "ورزشکاران با بیمه رو به انقضا", channel: "پیامک", date: "۵ آذر، ۰۹:۰۰", read: "0" }, "scheduled", 1),
      r("m5", { title: "برنامه همایش ملی مربیان", audience: "مربیان دارای کارت", channel: "پیام داخلی", date: "—", read: "0" }, "draft", 0),
    ],
  },

  /* ------------------------------------------------------------------ */
  evaluation: {
    entity: "ارزیابی",
    title: "ارزیابی سالانه هیئت‌ها",
    description: "هیئت خوداظهاری می‌کند، کارشناس مدارک را بررسی می‌کند و کمیته ارزیابی امتیاز نهایی را اعلام می‌کند.",
    columns: [
      { key: "board", label: "هیئت", kind: "title" },
      { key: "period", label: "دوره", kind: "muted" },
      { key: "score", label: "امتیاز" },
      { key: "evaluator", label: "ارزیاب", kind: "muted" },
    ],
    statuses: {
      self: { label: "خوداظهاری", tone: "warning" },
      review: { label: "در حال بررسی", tone: "info" },
      done: { label: "نتیجه اعلام شد", tone: "positive" },
    },
    workflow: {
      stages: ["خوداظهاری هیئت", "بررسی مدارک", "کمیته ارزیابی", "اعلام نتیجه"],
      actions: ["ثبت خوداظهاری", "تأیید مدارک", "تصویب و اعلام نتیجه"],
      stageStatus: ["self", "review", "review", "done"],
      doneStatus: "done",
      rejectStatus: "self",
      rejectLabel: "بازگشت برای اصلاح",
    },
    create: {
      label: "شروع دوره ارزیابی",
      title: "شروع ارزیابی برای یک هیئت",
      submit: "ارسال فرم خوداظهاری",
      success: "فرم خوداظهاری برای هیئت ارسال شد",
      status: "self",
      fields: [
        { key: "board", label: "هیئت", type: "select", options: PROVINCES.map((p) => `هیئت ${p}`) },
        { key: "period", label: "دوره", type: "select", options: ["۱۴۰۵", "نیمه اول ۱۴۰۵", "نیمه دوم ۱۴۰۵"] },
        { key: "evaluator", label: "ارزیاب", type: "select", options: ["فرزاد نوروزی", "الهام سبحانی", "نیما یزدانی"] },
      ],
    },
    records: [
      r("e1", { board: "هیئت اصفهان", period: "۱۴۰۵", score: "۹۱ از ۱۰۰", evaluator: "فرزاد نوروزی" }, "done", 3, [["رتبه کشوری", "۱"], ["رشد ورزشکاران", "۹۴"], ["مدال کشوری", "۸۸"], ["آموزش", "۹۶"], ["شفافیت مالی", "۸۹"]]),
      r("e2", { board: "هیئت تهران", period: "۱۴۰۵", score: "۸۹ از ۱۰۰", evaluator: "الهام سبحانی" }, "done", 3, [["رتبه کشوری", "۲"]]),
      r("e3", { board: "هیئت مازندران", period: "۱۴۰۵", score: "۸۶ از ۱۰۰", evaluator: "نیما یزدانی" }, "review", 2, [["بررسی کارشناس", "مدارک کامل"]]),
      r("e4", { board: "هیئت فارس", period: "۱۴۰۵", score: "در حال محاسبه", evaluator: "فرزاد نوروزی" }, "review", 1),
      r("e5", { board: "هیئت ایلام", period: "۱۴۰۵", score: "۴۸ از ۱۰۰", evaluator: "الهام سبحانی" }, "review", 2, [["ضعف اصلی", "دوره‌های آموزشی"]], "امتیاز زیر حد قابل قبول. برنامه بهبود سه‌ماهه پیشنهاد شده است."),
      r("e6", { board: "هیئت قم", period: "۱۴۰۵", score: "—", evaluator: "نیما یزدانی" }, "self", 0, [["مهلت خوداظهاری", "۱۰ آذر"]]),
    ],
  },

  /* ------------------------------------------------------------------ */
  venues: {
    entity: "سالن",
    title: "سالن‌ها و رزرو",
    description: "شناسنامه هر سالن با ظرفیت، تجهیزات و گواهی ایمنی. رزرو برای مسابقه و اردو از همین‌جا ثبت و تأیید می‌شود.",
    columns: [
      { key: "name", label: "سالن", kind: "title" },
      { key: "city", label: "شهر" },
      { key: "capacity", label: "ظرفیت تماشاگر", kind: "muted" },
      { key: "mats", label: "زمین", kind: "muted" },
      { key: "booking", label: "رزرو بعدی", kind: "muted" },
    ],
    statuses: {
      request: { label: "درخواست رزرو", tone: "warning" },
      booked: { label: "رزرو شده", tone: "info" },
      ready: { label: "آماده", tone: "positive" },
      service: { label: "در حال سرویس", tone: "neutral" },
    },
    workflow: {
      stages: ["درخواست رزرو", "تأیید مدیر سالن", "رزرو قطعی"],
      actions: ["ارسال برای مدیر سالن", "تأیید رزرو"],
      stageStatus: ["request", "request", "booked"],
      doneStatus: "booked",
      rejectStatus: "ready",
      rejectLabel: "رد رزرو",
    },
    create: {
      label: "درخواست رزرو",
      title: "درخواست رزرو سالن",
      submit: "ثبت درخواست",
      success: "درخواست رزرو برای مدیر سالن ارسال شد",
      status: "request",
      fields: [
        { key: "name", label: "سالن", type: "select", options: ["خانه تکواندو", "سالن پیروزی", "سالن امام رضا", "سالن غدیر", "سالن حافظیه"] },
        { key: "city", label: "شهر", type: "select", options: ["تهران", "اصفهان", "مشهد", "تبریز", "شیراز"] },
        { key: "booking", label: "برای", type: "text", required: true, placeholder: "مثلاً اردوی تیم ملی نوجوانان" },
        { key: "date", label: "تاریخ", type: "text", ltr: true, placeholder: "۱۴۰۵/۱۰/۰۱" },
      ],
    },
    records: [
      r("v1", { name: "سالن ۱۲ هزار نفری آزادی", city: "تهران", capacity: "۱۲٬۰۰۰", mats: "۴", booking: "قهرمانی کشور، تا ۳ آذر" }, "booked", 2, [["گواهی ایمنی", "معتبر تا اسفند ۱۴۰۵"], ["سیستم امتیازدهی الکترونیک", "دارد"], ["پارکینگ", "۸۰۰ خودرو"]]),
      r("v2", { name: "خانه تکواندو", city: "تهران", capacity: "۸۰۰", mats: "۳", booking: "اردوی تیم ملی، از ۲۰ آبان" }, "booked", 2, [["گواهی ایمنی", "معتبر"]]),
      r("v3", { name: "سالن پیروزی", city: "اصفهان", capacity: "۲٬۵۰۰", mats: "۲", booking: "لیگ برتر هفته نهم" }, "request", 1, [["درخواست‌کننده", "کمیته مسابقات"]]),
      r("v4", { name: "سالن امام رضا", city: "مشهد", capacity: "۳٬۰۰۰", mats: "۴", booking: "—" }, "service", undefined, [["سرویس", "تعویض ۲۴ دست تشک"], ["پایان سرویس", "۱۲ آذر"]]),
      r("v5", { name: "سالن غدیر", city: "تبریز", capacity: "۲٬۲۰۰", mats: "۲", booking: "پومسه قهرمانی کشور" }, "request", 0),
      r("v6", { name: "سالن حافظیه", city: "شیراز", capacity: "۱٬۸۰۰", mats: "۲", booking: "—" }, "ready", undefined, [["گواهی ایمنی", "معتبر تا تیر ۱۴۰۶"]]),
    ],
  },

  /* ------------------------------------------------------------------ */
  camps: {
    entity: "اردو",
    title: "اردوها و اعزام‌ها",
    description: "از برنامه‌ریزی و دعوت‌نامه تا تأیید پزشکی، اسکان، بلیت و گزارش فنی پایان اردو.",
    columns: [
      { key: "title", label: "اردو / اعزام", kind: "title" },
      { key: "team", label: "تیم" },
      { key: "place", label: "محل", kind: "muted" },
      { key: "dates", label: "زمان", kind: "muted" },
      { key: "members", label: "نفرات", kind: "muted" },
    ],
    statuses: {
      planned: { label: "برنامه‌ریزی", tone: "neutral" },
      invited: { label: "دعوت ارسال شد", tone: "info" },
      running: { label: "در جریان", tone: "accent" },
      done: { label: "پایان‌یافته", tone: "positive" },
    },
    workflow: {
      stages: ["برنامه‌ریزی", "دعوت‌نامه", "تأیید حضور و پزشکی", "برگزاری", "گزارش پایانی"],
      actions: ["ارسال دعوت‌نامه‌ها", "تأیید فهرست نهایی", "شروع اردو", "ثبت گزارش پایانی"],
      stageStatus: ["planned", "invited", "invited", "running", "done"],
      doneStatus: "done",
    },
    create: {
      label: "اردوی جدید",
      title: "تعریف اردو یا اعزام",
      submit: "ذخیره برنامه",
      success: "اردو ثبت شد؛ مرحله بعد ارسال دعوت‌نامه است",
      status: "planned",
      fields: [
        { key: "title", label: "عنوان", type: "text", required: true },
        { key: "team", label: "تیم", type: "select", options: ["ملی بزرگسالان مردان", "ملی بزرگسالان بانوان", "ملی جوانان", "ملی نوجوانان", "پومسه"] },
        { key: "place", label: "محل", type: "text", required: true },
        { key: "dates", label: "زمان", type: "text", placeholder: "۱ تا ۱۰ دی" },
        { key: "members", label: "تعداد نفرات", type: "number" },
      ],
    },
    records: [
      r("c1", { title: "آماده‌سازی قهرمانی آسیا", team: "ملی بزرگسالان مردان", place: "مرکز ملی المپیک", dates: "۲۰ آبان تا ۱۵ آذر", members: "۲۴" }, "running", 3, [["بودجه", "۴٫۶ میلیارد تومان"], ["هزینه‌شده", "۳٫۱ میلیارد تومان"], ["سرمربی", "نیما رستمی"]]),
      r("c2", { title: "انتخابی جوانان بانوان", team: "ملی جوانان", place: "خانه تکواندو بانوان", dates: "۵ تا ۱۹ آذر", members: "۱۸" }, "running", 3),
      r("c3", { title: "اعزام به گرندپری", team: "ملی بزرگسالان", place: "خارج از کشور", dates: "۲۲ آذر", members: "۱۰" }, "invited", 2, [["روادید", "۸ از ۱۰ صادر شد"], ["بلیت", "رزرو شده"]], "روادید دو نفر هنوز صادر نشده است. ۱۹ روز تا اعزام."),
      r("c4", { title: "اردوی استعدادهای برتر", team: "ملی نوجوانان", place: "مشهد", dates: "۱ تا ۱۰ دی", members: "۳۰" }, "planned", 0),
      r("c5", { title: "اردوی پومسه پیش از جهانی", team: "پومسه", place: "تهران", dates: "۱ تا ۲۰ مهر", members: "۱۴" }, "done", 4, [["گزارش فنی", "ثبت شده"], ["هزینه نهایی", "۱٫۹ میلیارد تومان"]]),
    ],
  },

  /* ------------------------------------------------------------------ */
  events: {
    entity: "رویداد",
    title: "رویدادها، همایش‌ها و جشنواره‌ها",
    description: "صفحه ثبت‌نام، کارت ورود و گزارش حضور برای هر رویداد.",
    columns: [
      { key: "title", label: "رویداد", kind: "title" },
      { key: "type", label: "نوع" },
      { key: "city", label: "شهر", kind: "muted" },
      { key: "date", label: "تاریخ", kind: "muted" },
      { key: "fill", label: "ثبت‌نام", kind: "progress" },
    ],
    statuses: {
      design: { label: "طراحی", tone: "neutral" },
      open: { label: "ثبت‌نام باز", tone: "info" },
      live: { label: "در حال برگزاری", tone: "accent" },
      done: { label: "پایان‌یافته", tone: "positive" },
    },
    workflow: {
      stages: ["طراحی", "ثبت‌نام", "صدور کارت ورود", "برگزاری", "گزارش حضور"],
      actions: ["باز کردن ثبت‌نام", "بستن ثبت‌نام و صدور کارت‌ها", "شروع رویداد", "ثبت گزارش حضور"],
      stageStatus: ["design", "open", "open", "live", "done"],
      doneStatus: "done",
    },
    create: {
      label: "رویداد جدید",
      title: "تعریف رویداد",
      submit: "ذخیره رویداد",
      success: "رویداد ثبت شد؛ برای باز کردن ثبت‌نام آن را از فهرست باز کنید",
      status: "design",
      fields: [
        { key: "title", label: "عنوان", type: "text", required: true },
        { key: "type", label: "نوع", type: "select", options: ["همایش", "جشنواره", "سمینار", "نمایشگاه"] },
        { key: "city", label: "شهر", type: "text", required: true },
        { key: "date", label: "تاریخ", type: "text", placeholder: "۲۰ دی" },
      ],
    },
    records: [
      r("ev1", { title: "همایش ملی مربیان تکواندو", type: "همایش", city: "تهران", date: "۱۲ آذر", fill: "96" }, "open", 2, [["ظرفیت", "۵۰۰"], ["ثبت‌نام", "۴۸۰"], ["کارت ورود", "۴۸۰ صادر شد"]]),
      r("ev2", { title: "جشنواره تکواندو کودکان", type: "جشنواره", city: "اصفهان", date: "۲۶ آذر", fill: "75" }, "open", 1, [["ظرفیت", "۱٬۵۰۰"]]),
      r("ev3", { title: "نمایشگاه تجهیزات ورزش‌های رزمی", type: "نمایشگاه", city: "تهران", date: "۱۵ دی", fill: "40" }, "open", 1, [["غرفه‌ها", "۲۴ از ۶۰"]]),
      r("ev4", { title: "سمینار پزشکی ورزشی", type: "سمینار", city: "مشهد", date: "۲۰ دی", fill: "30" }, "design", 0, [["ظرفیت", "۲۰۰"]], "ثبت‌نام کم است. پیشنهاد: اطلاع‌رسانی دوباره به مربیان و پزشکان هیئت‌ها."),
      r("ev5", { title: "جشن قهرمانان ۱۴۰۴", type: "همایش", city: "تهران", date: "۱۸ مهر", fill: "100" }, "done", 4, [["حضور", "۹۱٪"]]),
    ],
  },

  /* ------------------------------------------------------------------ */
  inspection: {
    entity: "پرونده بازرسی",
    title: "بازدیدها و پرونده‌های نظارتی",
    description: "بازرس با چک‌لیست بازدید می‌کند، یافته‌ها مهلت اصلاح دارند و پرونده تا رفع کامل پیگیری می‌شود.",
    columns: [
      { key: "number", label: "شماره", kind: "code" },
      { key: "club", label: "باشگاه", kind: "title" },
      { key: "province", label: "استان" },
      { key: "finding", label: "یافته", kind: "muted" },
      { key: "deadline", label: "مهلت", kind: "muted" },
    ],
    statuses: {
      scheduled: { label: "برنامه بازدید", tone: "neutral" },
      open: { label: "یافته ثبت شد", tone: "warning" },
      fixing: { label: "در حال اصلاح", tone: "info" },
      closed: { label: "بسته شد", tone: "positive" },
      referred: { label: "ارجاع به انضباطی", tone: "negative" },
    },
    workflow: {
      stages: ["برنامه بازدید", "بازدید و ثبت یافته", "مهلت اصلاح", "بازبینی", "بستن پرونده"],
      actions: ["ثبت نتیجه بازدید", "ابلاغ مهلت اصلاح", "ثبت بازبینی", "بستن پرونده"],
      stageStatus: ["scheduled", "open", "fixing", "fixing", "closed"],
      doneStatus: "closed",
      rejectStatus: "referred",
      rejectLabel: "ارجاع به کمیته انضباطی",
    },
    create: {
      label: "برنامه بازدید",
      title: "برنامه‌ریزی بازدید",
      submit: "ثبت برنامه",
      success: "بازدید برنامه‌ریزی شد و به بازرس اطلاع داده شد",
      status: "scheduled",
      fields: [
        { key: "club", label: "باشگاه", type: "text", required: true },
        { key: "province", label: "استان", type: "select", options: PROVINCES },
        { key: "inspector", label: "بازرس", type: "select", options: ["رضا نجفی", "امید طاهری", "مریم سلطانی"] },
        { key: "finding", label: "چک‌لیست", type: "select", options: ["چک‌لیست ایمنی سالن", "چک‌لیست مجوز مربیان", "چک‌لیست بهداشت و کمک‌های اولیه"] },
        { key: "deadline", label: "تاریخ بازدید", type: "text", placeholder: "۱۰ آذر" },
      ],
    },
    records: [
      r("i1", { number: "ن-۱۴۰۵-۲۱۸", club: "باشگاه ققنوس", province: "تهران", finding: "کف‌پوش غیراستاندارد", deadline: "۱۰ آذر" }, "fixing", 2, [["بازرس", "رضا نجفی"], ["امتیاز چک‌لیست", "۷۱ از ۱۰۰"]]),
      r("i2", { number: "ن-۱۴۰۵-۲۱۴", club: "مجموعه ورزشی پرواز", province: "البرز", finding: "مربی بدون کارت معتبر", deadline: "۵ آذر" }, "open", 1, [["بازرس", "امید طاهری"]], "مربی بدون کارت در کلاس نوجوانان تدریس می‌کرد. مهلت ۳ روزه برای معرفی مربی دارای کارت."),
      r("i3", { number: "ن-۱۴۰۵-۲۰۹", club: "آکادمی پارس", province: "فارس", finding: "نبود جعبه کمک‌های اولیه", deadline: "۱۵ آذر" }, "fixing", 3),
      r("i4", { number: "ن-۱۴۰۵-۲۰۱", club: "خانه تکواندو نوین", province: "اصفهان", finding: "پروانه منقضی", deadline: "۳ آذر" }, "referred", 2, [["ارجاع", "کمیته انضباطی، ۲ آذر"]]),
      r("i5", { number: "ن-۱۴۰۵-۲۲۵", club: "باشگاه سپهر", province: "مازندران", finding: "—", deadline: "۶ آذر" }, "scheduled", 0, [["بازرس", "مریم سلطانی"]]),
      r("i6", { number: "ن-۱۴۰۵-۱۹۰", club: "باشگاه المپیک", province: "یزد", finding: "تهویه ناکافی", deadline: "۲۰ آبان" }, "closed", 4),
    ],
  },

  /* ------------------------------------------------------------------ */
  talent: {
    entity: "استعداد",
    title: "بانک استعدادها",
    description: "نتیجه آزمون‌های میدانی، پایش ماهانه و مسیر رشد هر نوجوان تا معرفی به کمیته فنی.",
    columns: [
      { key: "name", label: "نام", kind: "person" },
      { key: "age", label: "سن", kind: "muted" },
      { key: "province", label: "استان" },
      { key: "score", label: "امتیاز آزمون", kind: "progress" },
      { key: "coach", label: "مربی", kind: "muted" },
    ],
    statuses: {
      identified: { label: "شناسایی‌شده", tone: "neutral" },
      monitoring: { label: "پایش ماهانه", tone: "info" },
      referred: { label: "معرفی به کمیته فنی", tone: "warning" },
      camp: { label: "اردوی ملی", tone: "positive" },
    },
    workflow: {
      stages: ["شناسایی", "آزمون میدانی", "پایش ماهانه", "معرفی به کمیته فنی", "اردوی ملی"],
      actions: ["ثبت نتیجه آزمون", "شروع پایش ماهانه", "معرفی به کمیته فنی", "دعوت به اردوی ملی"],
      stageStatus: ["identified", "identified", "monitoring", "referred", "camp"],
      doneStatus: "camp",
    },
    create: {
      label: "ثبت استعداد",
      title: "ثبت نتیجه آزمون استعدادیابی",
      submit: "ثبت در بانک استعدادها",
      success: "استعداد در بانک ثبت شد",
      status: "identified",
      fields: [
        { key: "name", label: "نام و نام خانوادگی", type: "text", required: true },
        { key: "age", label: "سن", type: "number", required: true },
        { key: "province", label: "استان", type: "select", options: PROVINCES },
        { key: "score", label: "امتیاز آزمون (از ۱۰۰)", type: "number", required: true },
        { key: "coach", label: "مربی", type: "text" },
      ],
    },
    records: [
      r("t1", { name: "هستی نوروزی", age: "۱۳", province: "مازندران", score: "96", coach: "سارا کاظمی" }, "camp", 4, [["سرعت", "۹۸"], ["انعطاف", "۹۵"], ["انفجاری", "۹۴"], ["هماهنگی", "۹۷"]]),
      r("t2", { name: "بردیا جعفری", age: "۱۲", province: "اصفهان", score: "94", coach: "حسین طاهری" }, "camp", 4),
      r("t3", { name: "ملیکا شریفی", age: "۱۴", province: "تهران", score: "93", coach: "نرگس امینی" }, "referred", 3, [["سرعت", "۹۱"], ["انعطاف", "۹۶"]]),
      r("t4", { name: "آرین قنبری", age: "۱۳", province: "فارس", score: "91", coach: "علی رستمی" }, "monitoring", 2),
      r("t5", { name: "یاسمن دهقان", age: "۱۱", province: "یزد", score: "90", coach: "مهسا صادقی" }, "monitoring", 2),
      r("t6", { name: "پارسا کرمانی", age: "۱۲", province: "کرمان", score: "84", coach: "امید باقری" }, "identified", 1),
    ],
  },

  /* ------------------------------------------------------------------ */
  leagues: {
    entity: "قرارداد",
    title: "نقل‌وانتقالات و قراردادها",
    description: "باشگاه قرارداد را ثبت می‌کند، بازیکن تأیید می‌کند و کمیته لیگ با بررسی سقف بودجه ثبت نهایی می‌کند.",
    columns: [
      { key: "player", label: "بازیکن", kind: "person" },
      { key: "from", label: "از باشگاه", kind: "muted" },
      { key: "to", label: "به باشگاه" },
      { key: "type", label: "نوع", kind: "muted" },
      { key: "amount", label: "مبلغ فصل", kind: "muted" },
    ],
    statuses: {
      club: { label: "ثبت باشگاه", tone: "neutral" },
      player: { label: "در انتظار تأیید بازیکن", tone: "warning" },
      committee: { label: "بررسی کمیته لیگ", tone: "info" },
      registered: { label: "ثبت نهایی", tone: "positive" },
      rejected: { label: "رد شده", tone: "negative" },
    },
    workflow: {
      stages: ["ثبت باشگاه", "تأیید بازیکن", "بررسی کمیته لیگ", "ثبت نهایی"],
      actions: ["ارسال برای بازیکن", "ثبت تأیید بازیکن", "ثبت نهایی قرارداد"],
      stageStatus: ["club", "player", "committee", "registered"],
      doneStatus: "registered",
      rejectStatus: "rejected",
      rejectLabel: "رد قرارداد",
    },
    create: {
      label: "ثبت قرارداد",
      title: "ثبت قرارداد یا انتقال",
      submit: "ثبت قرارداد",
      success: "قرارداد ثبت شد و برای تأیید بازیکن ارسال شد",
      status: "club",
      fields: [
        { key: "player", label: "بازیکن", type: "text", required: true },
        { key: "from", label: "باشگاه مبدأ", type: "select", options: ["آزاد", "باشگاه پیشگامان", "باشگاه ستارگان", "مجموعه ورزشی سپهر", "آکادمی آرش", "باشگاه رستم"] },
        { key: "to", label: "باشگاه مقصد", type: "select", options: ["باشگاه پیشگامان", "باشگاه ستارگان", "مجموعه ورزشی سپهر", "آکادمی آرش", "باشگاه رستم", "باشگاه فجر"] },
        { key: "type", label: "نوع", type: "select", options: ["انتقال", "قرارداد جدید", "تمدید", "قرضی"] },
        { key: "amount", label: "مبلغ فصل (تومان)", type: "text", ltr: true },
      ],
    },
    records: [
      r("l1", { player: "سجاد شریفی", from: "باشگاه رستم", to: "باشگاه پیشگامان", type: "انتقال", amount: "۱٫۲ میلیارد" }, "committee", 2, [["مدت", "دو فصل"], ["سقف بودجه باشگاه مقصد", "۸۲٪ مصرف شده"]]),
      r("l2", { player: "آرین اصفهانی", from: "آزاد", to: "باشگاه ستارگان", type: "قرارداد جدید", amount: "۸۵۰ میلیون" }, "player", 1),
      r("l3", { player: "مرتضی تهرانی", from: "باشگاه پیشگامان", to: "باشگاه پیشگامان", type: "تمدید", amount: "۱٫۵ میلیارد" }, "registered", 3),
      r("l4", { player: "امیر رستمی", from: "مجموعه ورزشی سپهر", to: "باشگاه فجر", type: "قرضی", amount: "۴۰۰ میلیون" }, "committee", 2, [["سقف بودجه باشگاه مقصد", "۱۰۶٪ مصرف شده"]], "باشگاه فجر از سقف بودجه فصل گذشته است. ثبت نهایی نیاز به تصمیم کمیته دارد."),
      r("l5", { player: "مهران محمدی", from: "باشگاه ستارگان", to: "آکادمی آرش", type: "انتقال", amount: "۹۰۰ میلیون" }, "club", 0),
      r("l6", { player: "هادی کرمانی", from: "آکادمی آرش", to: "باشگاه رستم", type: "انتقال", amount: "۶۰۰ میلیون" }, "rejected", 2, [["دلیل", "مدارک رضایت‌نامه باشگاه مبدأ ناقص"]]),
    ],
  },

  /* ------------------------------------------------------------------ */
  strategy: {
    entity: "برنامه عملیاتی",
    title: "برنامه‌های عملیاتی و بودجه",
    description: "هر کمیته برنامه سالانه پیشنهاد می‌دهد، هیئت‌رئیسه تصویب می‌کند و پیشرفت و هزینه واقعی پیگیری می‌شود.",
    columns: [
      { key: "title", label: "برنامه", kind: "title" },
      { key: "committee", label: "کمیته", kind: "muted" },
      { key: "goal", label: "هدف راهبردی" },
      { key: "budget", label: "بودجه", kind: "muted" },
      { key: "progress", label: "پیشرفت", kind: "progress" },
    ],
    statuses: {
      proposed: { label: "پیشنهاد", tone: "neutral" },
      approved: { label: "مصوب", tone: "info" },
      ontrack: { label: "مطابق برنامه", tone: "positive" },
      behind: { label: "عقب از برنامه", tone: "warning" },
      done: { label: "تکمیل شد", tone: "positive" },
    },
    workflow: {
      stages: ["پیشنهاد کمیته", "تصویب هیئت‌رئیسه", "اجرا", "گزارش پایانی"],
      actions: ["ارسال برای هیئت‌رئیسه", "تصویب و تخصیص بودجه", "ثبت گزارش پایانی"],
      stageStatus: ["proposed", "approved", "ontrack", "done"],
      doneStatus: "done",
    },
    create: {
      label: "برنامه جدید",
      title: "پیشنهاد برنامه عملیاتی",
      submit: "ثبت پیشنهاد",
      success: "برنامه برای تصویب هیئت‌رئیسه ثبت شد",
      status: "proposed",
      fields: [
        { key: "title", label: "عنوان برنامه", type: "text", required: true },
        { key: "committee", label: "کمیته", type: "select", options: COMMITTEES },
        { key: "goal", label: "هدف راهبردی", type: "select", options: ["توسعه همگانی", "قهرمانی", "توسعه بانوان", "آموزش", "درآمد پایدار", "تحول دیجیتال"] },
        { key: "budget", label: "بودجه پیشنهادی", type: "text", placeholder: "۵ میلیارد تومان" },
      ],
    },
    records: [
      r("s1", { title: "لیگ استانی بانوان در ۱۲ استان", committee: "کمیته توسعه بانوان", goal: "توسعه بانوان", budget: "۲۴ میلیارد", progress: "38" }, "behind", 2, [["مصرف بودجه", "۹ میلیارد"], ["استان‌های فعال", "۶ از ۱۲"]], "عقب از برنامه. دو استان منتظر تخصیص سالن هستند."),
      r("s2", { title: "آماده‌سازی تیم ملی برای قهرمانی آسیا", committee: "کمیته فنی و تیم‌های ملی", goal: "قهرمانی", budget: "۸۵ میلیارد", progress: "72" }, "ontrack", 2, [["مصرف بودجه", "۶۱ میلیارد"]]),
      r("s3", { title: "ثبت‌نام آنلاین همه مسابقات", committee: "کمیته مسابقات", goal: "تحول دیجیتال", budget: "۶ میلیارد", progress: "70" }, "ontrack", 2),
      r("s4", { title: "دوره مربیگری در ۱۰ استان کم‌برخوردار", committee: "کمیته آموزش", goal: "آموزش", budget: "۵ میلیارد", progress: "81" }, "ontrack", 2),
      r("s5", { title: "جذب حامی دوم لیگ برتر", committee: "کمیته مسابقات", goal: "درآمد پایدار", budget: "—", progress: "20" }, "approved", 1),
      r("s6", { title: "پایش سلامت ورزشکاران نوجوان", committee: "کمیته پزشکی", goal: "توسعه همگانی", budget: "۳ میلیارد", progress: "0" }, "proposed", 0),
    ],
  },

  /* ------------------------------------------------------------------ */
  hr: {
    entity: "کارمند",
    title: "کارکنان و قراردادها",
    description: "پرونده پرسنلی، قرارداد و ارزیابی سالانه کارکنان فدراسیون و هیئت‌ها. تمدید قرارداد پس از ارزیابی صادر می‌شود.",
    columns: [
      { key: "name", label: "نام", kind: "person" },
      { key: "title", label: "سمت" },
      { key: "unit", label: "واحد", kind: "muted" },
      { key: "contract", label: "پایان قرارداد", kind: "muted" },
      { key: "score", label: "ارزیابی", kind: "progress" },
    ],
    statuses: {
      active: { label: "فعال", tone: "positive" },
      evaluating: { label: "ارزیابی تمدید", tone: "warning" },
      renewal: { label: "در حال صدور حکم", tone: "info" },
      leave: { label: "مرخصی", tone: "neutral" },
    },
    workflow: {
      stages: ["ارزیابی سالانه", "پیشنهاد مدیر واحد", "تأیید منابع انسانی", "صدور حکم"],
      actions: ["ثبت ارزیابی", "پیشنهاد تمدید", "تأیید و صدور حکم"],
      stageStatus: ["evaluating", "evaluating", "renewal", "active"],
      doneStatus: "active",
    },
    create: {
      label: "ثبت کارمند",
      title: "ثبت کارمند جدید",
      submit: "ثبت پرونده",
      success: "پرونده پرسنلی ثبت شد",
      status: "evaluating",
      fields: [
        { key: "name", label: "نام و نام خانوادگی", type: "text", required: true },
        { key: "title", label: "سمت", type: "text", required: true },
        { key: "unit", label: "واحد", type: "select", options: ["دبیرخانه", "کمیته فنی", "کمیته مسابقات", "امور مالی", "کمیته آموزش", "روابط عمومی"] },
        { key: "contract", label: "پایان قرارداد", type: "text", placeholder: "۲۹ اسفند ۱۴۰۵" },
      ],
    },
    records: [
      r("h1", { name: "نازنین بهرامی", title: "کارشناس مسابقات", unit: "کمیته مسابقات", contract: "۱۵ آذر", score: "88" }, "evaluating", 1, [["سابقه", "۴ سال"], ["نوع قرارداد", "یک‌ساله"]]),
      r("h2", { name: "فرزاد اکبری", title: "حسابدار", unit: "امور مالی", contract: "۳۰ آذر", score: "0" }, "evaluating", 0, [["سابقه", "۲ سال"]]),
      r("h3", { name: "سجاد نجفی", title: "مسئول انبار تجهیزات", unit: "پشتیبانی", contract: "۱۰ دی", score: "76" }, "renewal", 2),
      r("h4", { name: "آیدا ملکی", title: "مسئول دبیرخانه", unit: "دبیرخانه", contract: "۲۹ اسفند", score: "93" }, "active", 3),
      r("h5", { name: "محمدرضا کاظمی", title: "دبیر کل", unit: "هیئت‌رئیسه", contract: "۱۴۰۷", score: "91" }, "active", 3),
      r("h6", { name: "پریسا امینی", title: "کارشناس روابط عمومی", unit: "روابط عمومی", contract: "۲۹ اسفند", score: "85" }, "leave", 3, [["مرخصی", "تا ۸ آذر"]]),
    ],
  },

  /* ------------------------------------------------------------------ */
  discipline: {
    entity: "پرونده",
    title: "اعتراضات و پرونده‌های انضباطی",
    description: "اعتراض به نتیجه یا گزارش تخلف ثبت می‌شود، ویدئو بازبینی می‌شود و کمیته رأی صادر و ابلاغ می‌کند.",
    columns: [
      { key: "number", label: "شماره", kind: "code" },
      { key: "subject", label: "موضوع", kind: "title" },
      { key: "competition", label: "مسابقه", kind: "muted" },
      { key: "party", label: "طرف پرونده" },
      { key: "session", label: "جلسه بعد", kind: "muted" },
    ],
    statuses: {
      filed: { label: "ثبت شده", tone: "neutral" },
      video: { label: "بازبینی ویدئو", tone: "info" },
      hearing: { label: "جلسه کمیته", tone: "warning" },
      ruled: { label: "رأی صادر شد", tone: "positive" },
      dismissed: { label: "رد اعتراض", tone: "negative" },
    },
    workflow: {
      stages: ["ثبت اعتراض یا گزارش", "بازبینی ویدئو", "جلسه کمیته", "صدور رأی", "ابلاغ"],
      actions: ["شروع بازبینی ویدئو", "ارجاع به جلسه کمیته", "صدور رأی", "ابلاغ رأی به طرفین"],
      stageStatus: ["filed", "video", "hearing", "ruled", "ruled"],
      doneStatus: "ruled",
      rejectStatus: "dismissed",
      rejectLabel: "رد اعتراض",
    },
    create: {
      label: "ثبت اعتراض",
      title: "ثبت اعتراض یا گزارش تخلف",
      submit: "ثبت پرونده",
      success: "پرونده ثبت شد و به کمیته داوران ارجاع شد",
      status: "filed",
      fields: [
        { key: "subject", label: "موضوع", type: "select", options: ["اعتراض به امتیاز", "اعتراض به وزن‌کشی", "رفتار غیرورزشی", "عدم حضور تیم", "تخلف مربی"] },
        { key: "competition", label: "مسابقه", type: "select", options: ["قهرمانی کشور بزرگسالان", "لیگ برتر، هفته هشتم", "قهرمانی استان فارس نوجوانان"] },
        { key: "party", label: "طرف پرونده", type: "text", required: true },
        { key: "body", label: "شرح", type: "textarea", required: true },
      ],
    },
    records: [
      r("x1", { number: "الف-۱۴۰۵-۰۴۱", subject: "اعتراض به امتیاز راند سوم", competition: "قهرمانی کشور بزرگسالان", party: "مربی تیم مازندران", session: "امروز، ۱۴:۰۰" }, "video", 1, [["مبارزه", "یک‌چهارم نهایی تا ۶۸ کیلوگرم، زمین ۳"], ["هزینه اعتراض", "پرداخت شد"]]),
      r("x2", { number: "الف-۱۴۰۵-۰۳۹", subject: "رفتار غیرورزشی مربی", competition: "لیگ برتر، هفته هشتم", party: "سرمربی باشگاه رستم", session: "۴ آذر" }, "hearing", 2, [["گزارش‌دهنده", "ناظر مسابقه"]]),
      r("x3", { number: "الف-۱۴۰۵-۰۳۶", subject: "عدم حضور تیم", competition: "قهرمانی استان فارس", party: "باشگاه حافظ", session: "—" }, "ruled", 4, [["رأی", "محرومیت یک مسابقه و جریمه"]], "رأی کمیته: محرومیت تیم از یک مسابقه و جریمه ۵۰ میلیون تومان. قابل تجدیدنظر تا ۷ روز."),
      r("x4", { number: "الف-۱۴۰۵-۰۴۲", subject: "اعتراض به وزن‌کشی", competition: "قهرمانی کشور بزرگسالان", party: "تیم البرز", session: "—" }, "filed", 0),
      r("x5", { number: "الف-۱۴۰۵-۰۳۳", subject: "اعتراض به نتیجه نیمه‌نهایی", competition: "قهرمانی کشور جوانان", party: "مربی تیم کرمان", session: "—" }, "dismissed", 1, [["نتیجه بازبینی", "امتیاز داور درست بوده است"]]),
    ],
  },
};

/** Roles and what each one may do, for the users module's permission matrix. */
export const permissionMatrix = {
  permissions: [
    "مشاهده پیشخوان کشوری",
    "تعریف مسابقه کشوری",
    "تعریف مسابقه استانی",
    "ثبت ورزشکار",
    "تأیید کارت و پروانه",
    "مشاهده امور مالی",
    "تسویه با هیئت‌ها",
    "ارسال بخشنامه",
    "مدیریت کاربران",
  ],
  roles: [
    { role: "دبیر کل فدراسیون", grants: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
    { role: "کارشناس فدراسیون", grants: [1, 1, 0, 1, 1, 0, 0, 1, 0] },
    { role: "رئیس هیئت استان", grants: [0, 0, 1, 1, 1, 1, 0, 1, 1] },
    { role: "کارشناس هیئت", grants: [0, 0, 1, 1, 0, 0, 0, 0, 0] },
    { role: "مدیر باشگاه", grants: [0, 0, 0, 1, 0, 0, 0, 0, 0] },
    { role: "بازرس", grants: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
  ],
};

/** Internal messenger demo conversations. */
export const conversations = [
  {
    id: "cv1",
    with: "کمیته مسابقات",
    members: "۹ عضو",
    messages: [
      { from: "بهنام عباسی", text: "جدول قرعه انتخابی جوانان بانوان آماده است، لطفاً بررسی کنید.", time: "۰۸:۱۲", mine: false },
      { from: "من", text: "دیدم. وزن تا ۴۹ کیلوگرم یک سرگروه کم دارد، اصلاح کنید.", time: "۰۸:۳۰", mine: true },
      { from: "بهنام عباسی", text: "اصلاح شد و برای تأیید فرستادم.", time: "۰۹:۰۵", mine: false },
    ],
  },
  {
    id: "cv2",
    with: "هیئت تکواندو اصفهان",
    members: "سارا کریمی",
    messages: [
      { from: "سارا کریمی", text: "سالن پیروزی برای هفته نهم لیگ آماده است. درخواست رزرو را ثبت کردیم.", time: "دیروز", mine: false },
      { from: "من", text: "ممنون. تأیید مدیر سالن که آمد، برنامه را منتشر می‌کنیم.", time: "دیروز", mine: true },
    ],
  },
  {
    id: "cv3",
    with: "کمیته پزشکی",
    members: "۶ عضو",
    messages: [{ from: "نرگس کریمی", text: "تأیید پزشکی سه ورزشکار اردوی آسیا تا فردا ارسال می‌شود.", time: "۲ روز پیش", mine: false }],
  },
];
