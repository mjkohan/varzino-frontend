/**
 * Data for "light" modules. Each renders with the shared overview template:
 * a few stats, one main chart, one table.
 */
import type { FederationProfile } from "./federations";

export type Tone = "neutral" | "positive" | "warning" | "negative" | "info" | "accent";
export type Cell = string | { text: string; tone: Tone };

export type OverviewStat = { label: string; value: string; change?: { value: number; against: string } };

export type ModuleOverview = {
  stats: OverviewStat[];
  chart: { title: string; caption: string; unit: string; kind: "bar" | "line"; data: { label: string; value: number }[] };
  table: { title: string; columns: string[]; rows: Cell[][] };
  /** short list beside the chart: what needs attention */
  attention: { title: string; items: { text: string; meta: string; tone: Tone }[] };
};

const ok = (text: string): Cell => ({ text, tone: "positive" });
const warn = (text: string): Cell => ({ text, tone: "warning" });
const bad = (text: string): Cell => ({ text, tone: "negative" });
const info = (text: string): Cell => ({ text, tone: "info" });
const neutral = (text: string): Cell => ({ text, tone: "neutral" });

export function buildOverviews(p: FederationProfile): Record<string, ModuleOverview> {
  const c = p.copy;
  const B = p.boardName;
  const T = c.leagueTeams;
  const short = (name: string) => name.split(" ").slice(-1)[0] ?? name;
  return {
  users: {
    stats: [
      { label: "کاربران فعال", value: "۲٬۸۴۶", change: { value: 4.1, against: "ماه قبل" } },
      { label: "نقش‌های تعریف‌شده", value: "۲۴" },
      { label: "درخواست دسترسی باز", value: "۱۷" },
      { label: "ورود ناموفق، ۲۴ ساعت", value: "۹" },
    ],
    chart: {
      title: "کاربران فعال به تفکیک نقش", caption: "کاربرانی که در ۳۰ روز گذشته وارد شده‌اند", unit: "نفر", kind: "bar",
      data: [
        { label: "مدیر باشگاه", value: 1320 }, { label: "کارشناس هیئت", value: 612 }, { label: "مربی", value: 498 },
        { label: "داور", value: 236 }, { label: "کارشناس فدراسیون", value: 124 }, { label: "بازرس", value: 56 },
      ],
    },
    table: {
      title: "آخرین درخواست‌های دسترسی",
      columns: ["کاربر", "واحد", "نقش درخواستی", "دامنه", "وضعیت"],
      rows: [
        ["سمانه رضایی", B("گیلان"), "کارشناس مسابقات", "استان گیلان", warn("در انتظار")],
        ["کیان احمدی", "کمیته داوران", "ناظر داوری", "سراسر کشور", ok("تأیید شد")],
        ["مرتضی بابایی", "باشگاه آرش", "مدیر باشگاه", "باشگاه آرش", warn("در انتظار")],
        ["آیدا ملکی", "دبیرخانه", "مسئول دبیرخانه", "فدراسیون", ok("تأیید شد")],
        ["یاسین کرمانی", B("یزد"), "کارشناس مالی", "استان یزد", bad("رد شد")],
      ],
    },
    attention: {
      title: "نیاز به بررسی",
      items: [
        { text: "۳ حساب بیش از ۹۰ روز بدون ورود", meta: "پیشنهاد: غیرفعال‌سازی", tone: "warning" },
        { text: "۹ تلاش ناموفق ورود از یک نشانی", meta: "حساب کارشناس هیئت قم", tone: "negative" },
        { text: "نقش «ناظر مسابقه» بدون کاربر", meta: "ایجاد شده ۱۲ روز پیش", tone: "neutral" },
      ],
    },
  },
  documents: {
    stats: [
      { label: "نامه‌های وارده، این ماه", value: "۴۱۲", change: { value: 9.2, against: "ماه قبل" } },
      { label: "در انتظار پاسخ", value: "۳۸" },
      { label: "قرارداد امضاشده", value: "۲۶" },
      { label: "میانگین زمان پاسخ", value: "۱٫۸ روز" },
    ],
    chart: {
      title: "مکاتبات روزانه", caption: "نامه‌های ثبت‌شده در دبیرخانه، ۱۴ روز گذشته", unit: "نامه", kind: "line",
      data: [18, 22, 19, 25, 31, 12, 9, 24, 27, 33, 29, 35, 14, 11].map((value, i) => ({ label: `${i + 1}`, value })),
    },
    table: {
      title: "آخرین مکاتبات",
      columns: ["شماره", "موضوع", "از / به", "تاریخ", "وضعیت"],
      rows: [
        ["۱۴۰۵/ت/۸۸۲۱", "ابلاغ آیین‌نامه جدید امتیازدهی", "به همه هیئت‌ها", "۲ آذر", ok("ابلاغ شد")],
        ["۱۴۰۵/و/۳۱۰۴", "درخواست میزبانی قهرمانی کشور نوجوانان", "از هیئت یزد", "۱ آذر", warn("در دست بررسی")],
        ["۱۴۰۵/ق/۰۹۲", `قرارداد حمایت مالی ${c.leagueName}`, c.sponsorDeal, "۲۸ آبان", ok("امضا شد")],
        ["۱۴۰۵/و/۳۰۹۸", "گزارش حادثه مسابقه استانی", "از هیئت لرستان", "۲۷ آبان", bad("پاسخ‌داده‌نشده")],
        ["۱۴۰۵/ت/۸۸۰۴", "دعوت به اردوی تیم ملی", "به ۱۸ ورزشکار", "۲۶ آبان", ok("ارسال شد")],
      ],
    },
    attention: {
      title: "سررسید نزدیک",
      items: [
        { text: "۱۲ نامه بیش از ۵ روز بی‌پاسخ", meta: "بیشترین: کمیته مسابقات", tone: "warning" },
        { text: "تمدید قرارداد اجاره سالن", meta: "سررسید ۱۰ آذر", tone: "warning" },
        { text: "۲ قرارداد منتظر امضای رئیس", meta: "ارسال‌شده دیروز", tone: "info" },
      ],
    },
  },
  messaging: {
    stats: [
      { label: "اطلاعیه ارسالی، این ماه", value: "۶۴" },
      { label: "نرخ خوانده‌شدن", value: "۸۷٪", change: { value: 6, against: "ماه قبل" } },
      { label: "پیامک ارسال‌شده", value: "۴۸٬۲۰۰" },
      { label: "گفت‌وگوهای فعال", value: "۳۱۲" },
    ],
    chart: {
      title: "نرخ خوانده‌شدن بخشنامه‌ها", caption: "درصد هیئت‌هایی که تا ۲۴ ساعت بخشنامه را خوانده‌اند", unit: "٪", kind: "line",
      data: [{ label: "خرداد", value: 61 }, { label: "تیر", value: 68 }, { label: "مرداد", value: 72 }, { label: "شهریور", value: 74 }, { label: "مهر", value: 81 }, { label: "آبان", value: 87 }],
    },
    table: {
      title: "آخرین اطلاعیه‌ها",
      columns: ["عنوان", "مخاطب", "کانال", "ارسال", "خوانده‌شده"],
      rows: [
        ["مهلت ثبت‌نام انتخابی تیم ملی بانوان", "مربیان و باشگاه‌های بانوان", "اعلان + پیامک", "۲ آذر", ok("۷۹٪")],
        [`تغییر زمان ${p.checkIn} قهرمانی کشور`, "تیم‌های اعزامی", "پیامک", "۱ آذر", ok("۹۶٪")],
        ["فراخوان دوره داوری درجه ۲", "داوران درجه ۳", "اعلان", "۲۹ آبان", warn("۵۴٪")],
        ["بخشنامه بیمه ورزشی ۱۴۰۵", "همه هیئت‌ها", "پیام داخلی", "۲۷ آبان", ok("۱۰۰٪")],
      ],
    },
    attention: {
      title: "هیئت‌هایی که هنوز نخوانده‌اند",
      items: [
        { text: "بخشنامه بیمه ورزشی", meta: "۳ هیئت: ایلام، سمنان، زنجان", tone: "warning" },
        { text: "فراخوان دوره داوری", meta: "۱۴۲ داور هنوز ندیده‌اند", tone: "neutral" },
      ],
    },
  },
  evaluation: {
    stats: [
      { label: "هیئت‌های ارزیابی‌شده", value: "۳۱ از ۳۱" },
      { label: "میانگین امتیاز کشوری", value: "۷۲٫۴", change: { value: 3.8, against: "سال قبل" } },
      { label: "باشگاه‌های اعتبارسنجی‌شده", value: "۱٬۹۲۰" },
      { label: "زیر حد قابل قبول", value: "۴ هیئت" },
    ],
    chart: {
      title: "امتیاز ارزیابی هیئت‌ها، ۱۰ رتبه اول", caption: "از ۱۰۰، بر اساس ۱۲ شاخص وزن‌دار", unit: "امتیاز", kind: "bar",
      data: [
        { label: "اصفهان", value: 91 }, { label: "تهران", value: 89 }, { label: "مازندران", value: 86 }, { label: "فارس", value: 84 },
        { label: "خراسان رضوی", value: 82 }, { label: "البرز", value: 80 }, { label: "یزد", value: 79 }, { label: "گیلان", value: 77 },
        { label: "آذربایجان شرقی", value: 75 }, { label: "کرمان", value: 73 },
      ],
    },
    table: {
      title: "شاخص‌های ارزیابی",
      columns: ["شاخص", "وزن", "میانگین کشوری", "بهترین", "روند"],
      rows: [
        ["رشد ورزشکاران ثبت‌شده", "۱۵٪", "۷۴", "مازندران", ok("رو به بهبود")],
        ["مدال در رقابت‌های کشوری", "۲۰٪", "۶۸", "تهران", neutral("ثابت")],
        ["برگزاری دوره‌های آموزشی", "۱۰٪", "۸۱", "اصفهان", ok("رو به بهبود")],
        ["شفافیت مالی و تسویه به‌موقع", "۱۵٪", "۷۷", "فارس", ok("رو به بهبود")],
        ["توسعه ورزش بانوان", "۱۰٪", "۶۲", "البرز", warn("نیاز به توجه")],
      ],
    },
    attention: {
      title: "زیر حد قابل قبول",
      items: [
        { text: "هیئت ایلام، امتیاز ۴۸", meta: "ضعف: دوره‌های آموزشی", tone: "negative" },
        { text: "هیئت خراسان جنوبی، امتیاز ۵۲", meta: "ضعف: توسعه بانوان", tone: "warning" },
        { text: "هیئت کهگیلویه و بویراحمد، امتیاز ۵۵", meta: "ضعف: تسویه مالی", tone: "warning" },
      ],
    },
  },
  venues: {
    stats: [
      { label: "سالن‌های ثبت‌شده", value: "۶۴۸" },
      { label: "دارای استاندارد مسابقه", value: "۱۸۲" },
      { label: "تجهیزات نیازمند سرویس", value: "۴۷" },
      { label: "رزرو این ماه", value: "۹۶", change: { value: 12, against: "ماه قبل" } },
    ],
    chart: {
      title: "سالن‌های استاندارد مسابقه به تفکیک استان", caption: "سالن‌هایی که چک‌لیست ایمنی و ابعاد زمین را کامل دارند", unit: "سالن", kind: "bar",
      data: [{ label: "تهران", value: 34 }, { label: "اصفهان", value: 19 }, { label: "خراسان رضوی", value: 17 }, { label: "فارس", value: 14 }, { label: "مازندران", value: 13 }, { label: "آذربایجان شرقی", value: 12 }, { label: "خوزستان", value: 11 }],
    },
    table: {
      title: "سالن‌های پرکاربرد",
      columns: ["سالن", "شهر", "ظرفیت تماشاگر", c.unitLabel, "وضعیت"],
      rows: [
        ...c.venues.slice(0, 5).map((v, i): Cell[] => [v.name, v.city, v.capacity, v.units, [info(`رزرو: ${p.competitions[0]!.title}`), ok("آماده"), ok("آماده"), warn("در حال سرویس"), ok("آماده")][i]!]),
      ],
    },
    attention: {
      title: "سرویس و بازرسی",
      items: [
        ...c.venueAttention.map(([text, meta], i) => ({ text, meta, tone: (i === 2 ? "negative" : "warning") as Tone })),
      ],
    },
  },
  camps: {
    stats: [
      { label: "اردوهای فعال", value: "۳" },
      { label: "نفرات در اردو", value: "۵۴" },
      { label: "هزینه اردوها، امسال", value: "۱۸٫۶ میلیارد تومان" },
      { label: "اعزام‌های پیش‌رو", value: "۲" },
    ],
    chart: {
      title: "هزینه اردوها در برابر بودجه", caption: "میلیارد تومان، به تفکیک ماه", unit: "میلیارد تومان", kind: "bar",
      data: [{ label: "تیر", value: 2.4 }, { label: "مرداد", value: 3.1 }, { label: "شهریور", value: 2.2 }, { label: "مهر", value: 4.6 }, { label: "آبان", value: 3.9 }, { label: "آذر", value: 2.4 }],
    },
    table: {
      title: "اردوها و اعزام‌ها",
      columns: ["عنوان", "تیم", "محل", "زمان", "وضعیت"],
      rows: c.camps.slice(0, 4).map((x, i): Cell[] => [x.title, x.team, x.place, x.dates, [info("در جریان"), info("در جریان"), warn("روادید: ۲ نفر مانده"), neutral("برنامه‌ریزی")][i]!]),
    },
    attention: {
      title: "کارهای باز لجستیک",
      items: [
        { text: "روادید ۲ نفر از اعزامی‌ها", meta: "۱۹ روز تا اعزام", tone: "warning" },
        { text: "تأیید پزشکی ۳ ورزشکار اردو", meta: "کمیته پزشکی", tone: "warning" },
        { text: `بلیت برگشت اردوی ${c.majorEvent}`, meta: "صادر شد", tone: "positive" },
      ],
    },
  },
  events: {
    stats: [
      { label: "رویدادهای امسال", value: "۲۲" },
      { label: "ثبت‌نام‌کنندگان", value: "۶٬۴۸۰" },
      { label: "نرخ حضور", value: "۸۲٪", change: { value: 5, against: "سال قبل" } },
      { label: "رویداد پیش‌رو", value: "۴" },
    ],
    chart: {
      title: "ثبت‌نام در رویدادها", caption: "۶ ماه گذشته", unit: "نفر", kind: "line",
      data: [{ label: "خرداد", value: 620 }, { label: "تیر", value: 1180 }, { label: "مرداد", value: 840 }, { label: "شهریور", value: 990 }, { label: "مهر", value: 1460 }, { label: "آبان", value: 1390 }],
    },
    table: {
      title: "رویدادهای پیش‌رو",
      columns: ["رویداد", "نوع", "شهر", "تاریخ", "ثبت‌نام"],
      rows: [
        ...c.events.slice(0, 4).map((x, i): Cell[] => [x.title, x.type, x.city, x.date, [ok(x.reg), info(x.reg), neutral(x.reg), warn(x.reg)][i]!]),
      ],
    },
    attention: {
      title: "قبل از برگزاری",
      items: [
        { text: "کارت ورود همایش مربیان", meta: "صدور برای ۴۸۰ نفر", tone: "info" },
        { text: "سمینار پزشکی ثبت‌نام کم دارد", meta: "پیشنهاد: اطلاع‌رسانی دوباره", tone: "warning" },
      ],
    },
  },
  inspection: {
    stats: [
      { label: "بازدیدهای این ماه", value: "۱۲۸" },
      { label: "انطباق کامل", value: "۷۶٪", change: { value: 4, against: "ماه قبل" } },
      { label: "تخلف باز", value: "۲۳" },
      { label: "میانگین زمان رفع", value: "۹ روز" },
    ],
    chart: {
      title: "نتیجه بازدیدها", caption: "تعداد بازدید به تفکیک نتیجه، آبان", unit: "بازدید", kind: "bar",
      data: [{ label: "انطباق کامل", value: 97 }, { label: "نیاز به اصلاح جزئی", value: 21 }, { label: "تخلف جدی", value: 7 }, { label: "تعطیلی موقت", value: 3 }],
    },
    table: {
      title: "پرونده‌های نظارتی باز",
      columns: ["باشگاه", "استان", "یافته", "مهلت اصلاح", "وضعیت"],
      rows: [
        ["باشگاه ققنوس", "تهران", c.inspectFinding, "۱۰ آذر", warn("در حال اصلاح")],
        ["مجموعه ورزشی پرواز", "البرز", "مربی بدون کارت معتبر", "۵ آذر", bad("سررسید نزدیک")],
        ["آکادمی پارس", "فارس", "نبود جعبه کمک‌های اولیه", "۱۵ آذر", warn("در حال اصلاح")],
        [`${p.clubPrefixes[2]} نوین`, "اصفهان", "پروانه منقضی", "۳ آذر", bad("ارجاع به کمیته")],
      ],
    },
    attention: {
      title: "بازدیدهای این هفته",
      items: [
        { text: "۱۸ بازدید برنامه‌ریزی‌شده", meta: "۶ بازرس در ۵ استان", tone: "info" },
        { text: "۴ پرونده از مهلت گذشته", meta: "ارجاع خودکار به کمیته انضباطی", tone: "negative" },
      ],
    },
  },
  talent: {
    stats: [
      { label: "استعدادهای ثبت‌شده", value: "۳٬۹۴۰" },
      { label: "آزمون‌شده امسال", value: "۱٬۲۱۰" },
      { label: "معرفی به کمیته فنی", value: "۸۶" },
      { label: "پوشش استان‌ها", value: "۲۷ از ۳۱" },
    ],
    chart: {
      title: "توزیع امتیاز آزمون آمادگی", caption: "نوجوانان ۱۰ تا ۱۴ سال، امسال", unit: "نفر", kind: "bar",
      data: [{ label: "۰–۲۰", value: 42 }, { label: "۲۰–۴۰", value: 168 }, { label: "۴۰–۶۰", value: 412 }, { label: "۶۰–۸۰", value: 438 }, { label: "۸۰–۹۰", value: 112 }, { label: "۹۰+", value: 38 }],
    },
    table: {
      title: "برترین استعدادهای امسال",
      columns: ["نام", "سن", "استان", "امتیاز آزمون", "مرحله"],
      rows: [
        ["هستی نوروزی", "۱۳", "مازندران", "۹۶", ok("اردوی ملی")],
        ["بردیا جعفری", "۱۲", "اصفهان", "۹۴", ok("اردوی ملی")],
        ["ملیکا شریفی", "۱۴", "تهران", "۹۳", info("پایش ماهانه")],
        ["آرین قنبری", "۱۳", "فارس", "۹۱", info("پایش ماهانه")],
        ["یاسمن دهقان", "۱۱", "یزد", "۹۰", neutral("آزمون تکمیلی")],
      ],
    },
    attention: {
      title: "استان‌های بدون آزمون",
      items: [{ text: "ایلام، سمنان، خراسان جنوبی، کهگیلویه", meta: "پیشنهاد: آزمون سیار در دی‌ماه", tone: "warning" }],
    },
  },
  leagues: {
    stats: [
      { label: "تیم‌های لیگ برتر", value: "۱۲" },
      { label: "قراردادهای ثبت‌شده", value: "۲۱۴" },
      { label: "نقل‌وانتقال این فصل", value: "۴۸" },
      { label: "هفته جاری", value: "نهم از ۲۲" },
    ],
    chart: {
      title: "امتیاز تیم‌ها تا هفته هشتم", caption: c.leagueName, unit: "امتیاز", kind: "bar",
      data: T.map((t, i) => ({ label: short(t), value: [22, 19, 18, 15, 13, 11][i]! })),
    },
    table: {
      title: "جدول لیگ برتر",
      columns: ["تیم", "بازی", "برد", "باخت", "امتیاز"],
      rows: [
        [T[0], "۸", "۷", "۱", "۲۲"],
        [T[1], "۸", "۶", "۲", "۱۹"],
        [T[2], "۸", "۶", "۲", "۱۸"],
        [T[3], "۸", "۵", "۳", "۱۵"],
        [T[4], "۸", "۴", "۴", "۱۳"],
      ],
    },
    attention: {
      title: "پنجره نقل‌وانتقالات",
      items: [
        { text: "۶ قرارداد در انتظار تأیید", meta: "مهلت تا ۱۰ آذر", tone: "warning" },
        { text: "۲ باشگاه از سقف بودجه گذشته‌اند", meta: "نیاز به بررسی کمیته", tone: "negative" },
      ],
    },
  },
  strategy: {
    stats: [
      { label: "اهداف راهبردی ۱۴۰۵", value: "۸" },
      { label: "پیشرفت برنامه عملیاتی", value: "۶۴٪" },
      { label: "جذب بودجه", value: "۷۱٪" },
      { label: "اقدام عقب از برنامه", value: "۱۱" },
    ],
    chart: {
      title: "پیشرفت اهداف سالانه", caption: "درصد تحقق تا پایان آبان، هدف خطی: ۶۷٪", unit: "٪", kind: "bar",
      data: [{ label: "توسعه همگانی", value: 78 }, { label: "قهرمانی", value: 66 }, { label: "بانوان", value: 52 }, { label: "آموزش", value: 81 }, { label: "درآمد پایدار", value: 58 }, { label: "دیجیتال", value: 70 }],
    },
    table: {
      title: "بودجه کمیته‌ها",
      columns: ["کمیته", "مصوب", "هزینه‌شده", "تعهد", "وضعیت"],
      rows: [
        ["فنی و تیم‌های ملی", "۸۵ میلیارد", "۶۱ میلیارد", "۱۴ میلیارد", warn("۸۸٪ مصرف")],
        ["مسابقات", "۴۲ میلیارد", "۲۷ میلیارد", "۶ میلیارد", ok("مطابق برنامه")],
        ["آموزش", "۱۸ میلیارد", "۱۱ میلیارد", "۲ میلیارد", ok("مطابق برنامه")],
        ["توسعه بانوان", "۲۴ میلیارد", "۹ میلیارد", "۳ میلیارد", bad("عقب از برنامه")],
      ],
    },
    attention: {
      title: "عقب از برنامه",
      items: [
        { text: "لیگ استانی بانوان در ۶ استان", meta: "هدف: ۱۲ استان تا اسفند", tone: "warning" },
        { text: "قرارداد حامی دوم", meta: "در مرحله مذاکره", tone: "neutral" },
      ],
    },
  },
  hr: {
    stats: [
      { label: "کارکنان فدراسیون", value: "۸۶" },
      { label: "کارکنان هیئت‌ها", value: "۴۱۲" },
      { label: "قرارداد رو به اتمام", value: "۱۴" },
      { label: "ارزیابی سالانه انجام‌شده", value: "۷۸٪" },
    ],
    chart: {
      title: "کارکنان به تفکیک واحد", caption: "فدراسیون، آذر ۱۴۰۵", unit: "نفر", kind: "bar",
      data: [{ label: "دبیرخانه", value: 14 }, { label: "فنی", value: 18 }, { label: "مسابقات", value: 11 }, { label: "مالی", value: 9 }, { label: "آموزش", value: 8 }, { label: "روابط عمومی", value: 7 }],
    },
    table: {
      title: "قراردادهای رو به اتمام",
      columns: ["نام", "سمت", "واحد", "پایان قرارداد", "اقدام"],
      rows: [
        ["نازنین بهرامی", "کارشناس مسابقات", "کمیته مسابقات", "۱۵ آذر", warn("تمدید پیشنهاد شده")],
        ["فرزاد اکبری", "حسابدار", "امور مالی", "۳۰ آذر", neutral("در انتظار ارزیابی")],
        ["سجاد نجفی", "مسئول انبار تجهیزات", "پشتیبانی", "۱۰ دی", neutral("در انتظار ارزیابی")],
      ],
    },
    attention: {
      title: "ارزیابی سالانه",
      items: [{ text: "۱۹ نفر هنوز ارزیابی نشده‌اند", meta: "مهلت ۳۰ آذر", tone: "warning" }],
    },
  },
  discipline: {
    stats: [
      { label: "اعتراض ثبت‌شده، امسال", value: "۶۲" },
      { label: "پرونده انضباطی باز", value: "۸" },
      { label: "میانگین زمان صدور رأی", value: "۶ روز" },
      { label: "داوران فعال", value: "۲٬۴۱۰" },
    ],
    chart: {
      title: "اعتراض‌ها به تفکیک نتیجه", caption: "امسال", unit: "پرونده", kind: "bar",
      data: [{ label: "رد اعتراض", value: 38 }, { label: "پذیرش و اصلاح نتیجه", value: 11 }, { label: "بازبینی ویدئو", value: 9 }, { label: "در جریان", value: 4 }],
    },
    table: {
      title: "پرونده‌های جاری",
      columns: ["شماره", "موضوع", "مسابقه", "جلسه بعد", "وضعیت"],
      rows: [
        ["الف-۱۴۰۵-۰۴۱", c.protestScore, "قهرمانی کشور بزرگسالان", "امروز", info("بازبینی ویدئو")],
        ["الف-۱۴۰۵-۰۳۹", "رفتار غیرورزشی مربی", "لیگ برتر، هفته هشتم", "۴ آذر", warn("احضار")],
        ["الف-۱۴۰۵-۰۳۶", "عدم حضور تیم", "قهرمانی استان فارس", "—", ok("رأی صادر شد")],
        ["الف-۱۴۰۵-۰۳۳", c.protestCheckIn, "قهرمانی کشور جوانان", "—", ok("رأی صادر شد")],
      ],
    },
    attention: {
      title: "انتصاب داوران",
      items: [
        { text: "لیگ برتر هفته نهم", meta: "۲ داور مرکزی هنوز تعیین نشده", tone: "warning" },
        { text: "قهرمانی استان فارس", meta: "تیم داوری کامل", tone: "positive" },
      ],
    },
  },
};
}
