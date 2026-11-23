import { provinces } from "./provinces";
import { clubs } from "./people";

export type OrgKind = "federation" | "committee" | "board" | "city" | "club";

export type OrgNode = {
  id: string;
  name: string;
  kind: OrgKind;
  head?: string;
  members?: number;
  children?: OrgNode[];
};

export const orgKindLabel: Record<OrgKind, string> = {
  federation: "فدراسیون",
  committee: "کمیته",
  board: "هیئت استانی",
  city: "هیئت شهرستان",
  club: "باشگاه",
};

export const FEDERATION_NAME = "فدراسیون تکواندو";

const boardHeads = ["مهدی رحیمی", "سارا کریمی", "حسین قاسمی", "رضا نجفی", "امید طاهری", "مریم سلطانی", "داوود اکبری", "فرزاد شریفی"];

export const orgTree: OrgNode = {
  id: "fed",
  name: FEDERATION_NAME,
  kind: "federation",
  head: "علیرضا نیک‌نام",
  members: provinces.reduce((s, p) => s + p.athletes, 0),
  children: [
    {
      id: "committees",
      name: "کمیته‌های تخصصی",
      kind: "committee",
      children: [
        { id: "cm-tech", name: "کمیته فنی و تیم‌های ملی", kind: "committee", head: "امیر حسینی", members: 14 },
        { id: "cm-comp", name: "کمیته مسابقات", kind: "committee", head: "بهنام عباسی", members: 9 },
        { id: "cm-ref", name: "کمیته داوران", kind: "committee", head: "شیما بهرامی", members: 11 },
        { id: "cm-edu", name: "کمیته آموزش", kind: "committee", head: "حمید صادقی", members: 8 },
        { id: "cm-med", name: "کمیته پزشکی", kind: "committee", head: "نرگس کریمی", members: 6 },
        { id: "cm-disc", name: "کمیته انضباطی", kind: "committee", head: "کامران موسوی", members: 5 },
      ],
    },
    ...provinces.slice(0, 8).map((p, i) => ({
      id: `board-${p.id}`,
      name: `هیئت تکواندو ${p.name}`,
      kind: "board" as const,
      head: boardHeads[i],
      members: p.athletes,
      children: clubs
        .filter((c) => c.provinceId === p.id)
        .slice(0, 4)
        .map((c) => ({ id: c.id, name: c.name, kind: "club" as const, head: c.manager, members: c.athletes })),
    })),
  ],
};

export type Position = {
  id: string;
  title: string;
  holder: string;
  unit: string;
  since: string;
  termEnds: string;
  status: "filled" | "vacant" | "acting";
};

export const positions: Position[] = [
  { id: "pos-1", title: "رئیس فدراسیون", holder: "علیرضا نیک‌نام", unit: "هیئت‌رئیسه", since: "۱۴۰۳", termEnds: "۱۴۰۷", status: "filled" },
  { id: "pos-2", title: "نایب‌رئیس اول", holder: "پویا عباسی", unit: "هیئت‌رئیسه", since: "۱۴۰۳", termEnds: "۱۴۰۷", status: "filled" },
  { id: "pos-3", title: "نایب‌رئیس بانوان", holder: "الهام سبحانی", unit: "هیئت‌رئیسه", since: "۱۴۰۳", termEnds: "۱۴۰۷", status: "filled" },
  { id: "pos-4", title: "دبیر کل", holder: "محمدرضا کاظمی", unit: "دبیرخانه", since: "۱۴۰۴", termEnds: "۱۴۰۷", status: "filled" },
  { id: "pos-5", title: "خزانه‌دار", holder: "سامان مرادی", unit: "امور مالی", since: "۱۴۰۳", termEnds: "۱۴۰۷", status: "filled" },
  { id: "pos-6", title: "سرمربی تیم ملی بزرگسالان", holder: "نیما رستمی", unit: "کمیته فنی", since: "۱۴۰۴", termEnds: "۱۴۰۶", status: "filled" },
  { id: "pos-7", title: "رئیس هیئت استان ایلام", holder: "مهران آقایی", unit: "هیئت‌های استانی", since: "۱۴۰۵", termEnds: "۱۴۰۵", status: "acting" },
  { id: "pos-8", title: "مسئول کمیته استعدادیابی", holder: "—", unit: "کمیته فنی", since: "—", termEnds: "—", status: "vacant" },
];

export const positionStatusLabel: Record<Position["status"], string> = {
  filled: "منصوب",
  vacant: "بلاتصدی",
  acting: "سرپرست",
};
