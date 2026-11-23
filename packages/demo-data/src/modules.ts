/**
 * The 19 modules from the product owner's phase-one list (summary of doc 46), grouped into five pillars.
 * `depth: "deep"` modules have full screens; "light" modules use the shared overview template.
 */

export type PillarId = "people" | "competition" | "governance" | "operations" | "finance";

export type Pillar = { id: PillarId; title: string; summary: string };

export const pillars: Pillar[] = [
  { id: "people", title: "افراد و ورزشکاران", summary: "یک پرونده برای هر ورزشکار، مربی و داور، از اولین عضویت تا آخرین مدال" },
  { id: "competition", title: "مسابقات و رقابت", summary: "از اعلام مسابقه و ثبت‌نام تا جدول، نتیجه و امتیاز رنکینگ" },
  { id: "governance", title: "سازمان و حاکمیت", summary: "ساختار فدراسیون و هیئت‌ها، نقش‌ها، مکاتبات و برنامه سالانه" },
  { id: "operations", title: "عملیات و زیرساخت", summary: "سالن‌ها، اردوها و نظارت میدانی در سراسر کشور" },
  { id: "finance", title: "مالی و ارزیابی", summary: "دریافت، کیف پول، تسویه با هیئت‌ها و سنجش عملکرد" },
];

export type ModuleIcon =
  | "trophy" | "chart" | "graduation" | "id" | "network" | "shield" | "file" | "message" | "wallet"
  | "gauge" | "building" | "tent" | "calendar" | "badge" | "search" | "sparkle" | "league" | "target"
  | "users" | "gavel";

export type ModuleDef = {
  id: string;
  title: string;
  /** full title from the requirements list */
  fullTitle: string;
  pillar: PillarId;
  href: string;
  icon: ModuleIcon;
  depth: "deep" | "light";
  /** one line, what a federation does with it */
  summary: string;
  /** 3-4 concrete capabilities, used on landing and overview pages */
  capabilities: string[];
};

export const modules: ModuleDef[] = [
  {
    id: "competitions", title: "مسابقات", fullTitle: "مدیریت، سازماندهی و برگزاری مسابقات", pillar: "competition",
    href: "/competitions", icon: "trophy", depth: "deep",
    summary: "تعریف مسابقه، ثبت‌نام آنلاین، وزن‌کشی، جدول و ثبت نتایج",
    capabilities: ["ثبت‌نام آنلاین با پرداخت ورودیه", "قرعه‌کشی و جدول حذفی خودکار", "زمان‌بندی زمین‌ها و داوران", "جدول مدال استان‌ها"],
  },
  {
    id: "ranking", title: "رنکینگ", fullTitle: "تأثیر مسابقه بر رنکینگ و نظام امتیازدهی", pillar: "competition",
    href: "/ranking", icon: "chart", depth: "deep",
    summary: "امتیاز هر نتیجه طبق آیین‌نامه، خودکار به رنکینگ کشوری می‌رسد",
    capabilities: ["رنکینگ به تفکیک وزن و رده سنی", "آیین‌نامه امتیازدهی قابل تنظیم", "تاریخچه امتیاز هر ورزشکار", "مبنای شفاف برای انتخاب تیم ملی"],
  },
  {
    id: "education", title: "آموزش", fullTitle: "سامانه جامع مدیریت آموزش و ارتقای صلاحیت‌های ورزشی", pillar: "people",
    href: "/education", icon: "graduation", depth: "deep",
    summary: "دوره‌های مربیگری و داوری، حضور و غیاب، آزمون و صدور گواهی",
    capabilities: ["تقویم دوره‌ها و ثبت‌نام", "آزمون و نمره نهایی", "گواهی با شماره سریال و استعلام", "ارتقای درجه بر اساس پیش‌نیاز"],
  },
  {
    id: "people", title: "پرونده اشخاص", fullTitle: "پروفایل جامع، هویت یکپارچه و پرونده الکترونیکی افراد", pillar: "people",
    href: "/people", icon: "id", depth: "deep",
    summary: "یک هویت برای هر فرد با سوابق ورزشی، آموزشی، پزشکی و عضویت",
    capabilities: ["کد عضویت یکتا در سراسر کشور", "سوابق مسابقه، مدال و دوره‌ها", "وضعیت بیمه و پزشکی", "انتقال بین باشگاه‌ها با حفظ سابقه"],
  },
  {
    id: "organizations", title: "سازمان‌ها", fullTitle: "مدیریت سازمان‌ها، ساختار تشکیلاتی، سمت‌ها و حاکمیت سازمانی", pillar: "governance",
    href: "/organizations", icon: "network", depth: "deep",
    summary: "فدراسیون، کمیته‌ها، هیئت‌های استانی و باشگاه‌ها در یک ساختار",
    capabilities: ["نمودار سازمانی زنده", "سمت‌ها، احکام و دوره تصدی", "زیرمجموعه‌های هر هیئت", "شاخص‌های هر واحد"],
  },
  {
    id: "users", title: "کاربران و دسترسی", fullTitle: "مدیریت کاربران سازمانی، نقش‌ها، سطوح دسترسی و گردش کار مجوزها", pillar: "governance",
    href: "/users", icon: "shield", depth: "light",
    summary: "هر کاربر فقط داده واحد خودش را می‌بیند و فقط کار نقش خودش را انجام می‌دهد",
    capabilities: ["نقش‌های آماده برای فدراسیون، هیئت و باشگاه", "دسترسی در سطح استان و واحد", "گردش کار تأیید چندمرحله‌ای", "ثبت همه عملیات کاربران"],
  },
  {
    id: "documents", title: "اسناد و مکاتبات", fullTitle: "مدیریت اسناد، مکاتبات، قراردادها و امضای دیجیتال", pillar: "governance",
    href: "/documents", icon: "file", depth: "light",
    summary: "نامه، ابلاغیه و قرارداد با شماره دبیرخانه و امضای دیجیتال",
    capabilities: ["دبیرخانه الکترونیک و شماره‌گذاری", "ارجاع و پیگیری نامه‌ها", "قرارداد با امضای دیجیتال", "بایگانی قابل جست‌وجو"],
  },
  {
    id: "messaging", title: "اطلاع‌رسانی", fullTitle: "اعلان‌ها، پیام‌رسان داخلی و ارتباطات سازمانی", pillar: "governance",
    href: "/messaging", icon: "message", depth: "light",
    summary: "بخشنامه به همه هیئت‌ها در یک لحظه، با گزارش خوانده‌شدن",
    capabilities: ["ارسال هدفمند به نقش و استان", "پیامک، اعلان و پیام داخلی", "گزارش تحویل و خوانده‌شدن", "قالب‌های آماده اطلاعیه"],
  },
  {
    id: "finance", title: "مالی و کیف پول", fullTitle: "مرکز مالی، پرداخت‌ها، کیف پول و تسویه‌حساب‌ها", pillar: "finance",
    href: "/finance", icon: "wallet", depth: "deep",
    summary: "همه دریافت‌ها و پرداخت‌ها با سهم هر هیئت، شفاف و قابل حسابرسی",
    capabilities: ["درگاه پرداخت و کیف پول", "تسهیم خودکار سهم هیئت‌ها", "صورتحساب و رسید رسمی", "گزارش درآمد به تفکیک منبع"],
  },
  {
    id: "evaluation", title: "ارزیابی عملکرد", fullTitle: "نظام ارزیابی عملکرد، رتبه‌بندی و اعتبارسنجی اشخاص و سازمان‌های ورزشی", pillar: "finance",
    href: "/evaluation", icon: "gauge", depth: "light",
    summary: "رتبه‌بندی هیئت‌ها و باشگاه‌ها با شاخص‌های روشن و قابل مقایسه",
    capabilities: ["شاخص‌های وزن‌دار", "رتبه‌بندی سالانه هیئت‌ها", "اعتبارسنجی باشگاه‌ها", "کارنامه هر واحد"],
  },
  {
    id: "venues", title: "اماکن و تجهیزات", fullTitle: "سامانه مدیریت اماکن، زیرساخت‌ها و تجهیزات ورزشی", pillar: "operations",
    href: "/venues", icon: "building", depth: "light",
    summary: "فهرست سالن‌ها، ظرفیت، تجهیزات و برنامه استفاده",
    capabilities: ["شناسنامه هر سالن", "رزرو برای مسابقه و اردو", "تجهیزات و سرویس دوره‌ای", "وضعیت استاندارد ایمنی"],
  },
  {
    id: "camps", title: "اردوها و اعزام‌ها", fullTitle: "سامانه مدیریت اردوها، کمپ‌های تمرینی، اعزام‌ها و امور لجستیکی تیم‌های ورزشی", pillar: "operations",
    href: "/camps", icon: "tent", depth: "light",
    summary: "دعوت‌نامه، اسکان، بلیت و هزینه اردوهای تیم ملی",
    capabilities: ["فهرست دعوت‌شدگان و تأیید حضور", "اسکان، تغذیه و حمل‌ونقل", "بودجه و هزینه هر اردو", "گزارش فنی پایان اردو"],
  },
  {
    id: "events", title: "رویدادها", fullTitle: "سامانه مدیریت رویدادها، همایش‌ها، جشنواره‌ها و نمایشگاه‌های ورزشی", pillar: "operations",
    href: "/events", icon: "calendar", depth: "light",
    summary: "همایش، جشنواره و سمینار با ثبت‌نام و کارت ورود",
    capabilities: ["صفحه ثبت‌نام رویداد", "کارت ورود با کد", "برنامه و سخنرانان", "گزارش حضور"],
  },
  {
    id: "licenses", title: "مجوزها و کارت‌ها", fullTitle: "سامانه مدیریت مجوزها، پروانه‌ها، اعتبارنامه‌ها و گواهی‌های ورزشی", pillar: "people",
    href: "/licenses", icon: "badge", depth: "deep",
    summary: "درخواست، بررسی هیئت، تأیید فدراسیون و صدور کارت در یک مسیر",
    capabilities: ["پروانه باشگاه و کارت مربی و داور", "مسیر تأیید هیئت و فدراسیون", "یادآوری پیش از انقضا", "استعلام اصالت با کد"],
  },
  {
    id: "inspection", title: "بازرسی و نظارت", fullTitle: "سامانه مدیریت بازرسی، نظارت میدانی، ارزیابی انطباق و رسیدگی به گزارش‌های نظارتی", pillar: "operations",
    href: "/inspection", icon: "search", depth: "light",
    summary: "بازدید میدانی با چک‌لیست، عکس و پیگیری اقدام اصلاحی",
    capabilities: ["برنامه بازدید بازرسان", "چک‌لیست انطباق", "ثبت تخلف و مهلت اصلاح", "پیگیری تا بستن پرونده"],
  },
  {
    id: "talent", title: "استعدادیابی", fullTitle: "سامانه مدیریت استعدادیابی، مسیر رشد ورزشکاران و بانک جامع استعدادهای ورزشی", pillar: "people",
    href: "/talent", icon: "sparkle", depth: "light",
    summary: "بانک استعدادها با آزمون‌های میدانی و مسیر رشد هر نوجوان",
    capabilities: ["آزمون‌های استاندارد آمادگی", "نمره و رتبه هر استعداد", "مسیر رشد تا تیم ملی", "پیشنهاد به کمیته فنی"],
  },
  {
    id: "leagues", title: "لیگ و باشگاه‌ها", fullTitle: "سامانه مدیریت لیگ‌ها، باشگاه‌های حرفه‌ای، نقل‌وانتقالات و قراردادهای بازیکنان", pillar: "competition",
    href: "/leagues", icon: "league", depth: "light",
    summary: "جدول لیگ، قرارداد بازیکنان و پنجره نقل‌وانتقالات",
    capabilities: ["جدول و برنامه هفتگی لیگ", "ثبت قرارداد بازیکن و مربی", "پنجره نقل‌وانتقالات", "سقف بودجه و مجوز حرفه‌ای"],
  },
  {
    id: "strategy", title: "برنامه و بودجه", fullTitle: "سامانه مدیریت برنامه‌ریزی راهبردی، برنامه‌های عملیاتی و بودجه‌ریزی مبتنی بر عملکرد", pillar: "governance",
    href: "/strategy", icon: "target", depth: "light",
    summary: "اهداف سالانه، برنامه عملیاتی و بودجه هر کمیته با پیشرفت واقعی",
    capabilities: ["اهداف راهبردی و شاخص‌ها", "برنامه عملیاتی هر واحد", "بودجه مصوب و هزینه واقعی", "گزارش پیشرفت فصلی"],
  },
  {
    id: "hr", title: "منابع انسانی", fullTitle: "سامانه مدیریت منابع انسانی، کارکنان، ساختار مشاغل و ارزیابی سرمایه انسانی ورزش", pillar: "governance",
    href: "/hr", icon: "users", depth: "light",
    summary: "کارکنان، قراردادها و ارزیابی سالانه در فدراسیون و هیئت‌ها",
    capabilities: ["پرونده پرسنلی", "ساختار مشاغل", "قرارداد و حکم کارگزینی", "ارزیابی سالانه"],
  },
  {
    id: "discipline", title: "داوری و انضباطی", fullTitle: "سامانه مدیریت داوری، رسیدگی به اعتراضات، کمیته‌های انضباطی و آرای ورزشی", pillar: "competition",
    href: "/discipline", icon: "gavel", depth: "light",
    summary: "انتصاب داور، ثبت اعتراض و پرونده انضباطی تا صدور رأی",
    capabilities: ["انتصاب داوران به مسابقه", "ثبت و رسیدگی اعتراض", "پرونده انضباطی و جلسات", "آرای قابل استعلام"],
  },
];

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m])) as Record<string, ModuleDef>;
export const modulesByPillar = (pillar: PillarId) => modules.filter((m) => m.pillar === pillar);
