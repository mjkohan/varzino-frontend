/**
 * Hardcoded sign-in accounts, two federations × four roles.
 * Import this file from server code only, so the passwords never reach the client bundle.
 * This is not real security: the session cookie is unsigned. It stands in for an auth backend.
 */
import { getDataset, type FederationId } from "@varzino/demo-data";

export type RoleId = "federation" | "board" | "club" | "participant";

export type Account = {
  id: string;
  phone: string;
  password: string;
  federationId: FederationId;
  role: RoleId;
  name: string;
  title: string;
  scope: string;
  /** where this account lands after sign-in */
  home: string;
};

const athlete = (fed: FederationId) => getDataset(fed).me.fullName;

export const accounts: Account[] = [
  { id: "para-fed", phone: "09121110001", password: "Para@1405", federationId: "para", role: "federation", name: "محمدرضا کاظمی", title: "دبیر کل فدراسیون", scope: "فدراسیون ورزش‌های جانبازان و توان‌یابان", home: "/" },
  { id: "para-board", phone: "09121110002", password: "Para@1405", federationId: "para", role: "board", name: "سارا کریمی", title: "رئیس هیئت استان", scope: "هیئت ورزش‌های جانبازان و توان‌یابان استان اصفهان", home: "/" },
  { id: "para-club", phone: "09121110003", password: "Para@1405", federationId: "para", role: "club", name: "بهنام عباسی", title: "مدیر باشگاه", scope: "باشگاه پیشگامان، تهران", home: "/" },
  { id: "para-athlete", phone: "09121110004", password: "Para@1405", federationId: "para", role: "participant", name: athlete("para"), title: "ورزشکار", scope: "پرتال ورزشکاران", home: "/me" },
  { id: "assoc-fed", phone: "09122220001", password: "Darts@1405", federationId: "assoc", role: "federation", name: "علی رضوانی", title: "دبیر کل فدراسیون", scope: "فدراسیون انجمن‌های ورزشی، انجمن دارت", home: "/" },
  { id: "assoc-board", phone: "09122220002", password: "Darts@1405", federationId: "assoc", role: "board", name: "نرگس امیری", title: "رئیس هیئت استان", scope: "هیئت انجمن‌های ورزشی استان تهران", home: "/" },
  { id: "assoc-club", phone: "09122220003", password: "Darts@1405", federationId: "assoc", role: "club", name: "کیوان صالحی", title: "مدیر باشگاه دارت", scope: "باشگاه پیشگامان، تهران", home: "/" },
  { id: "assoc-athlete", phone: "09122220004", password: "Darts@1405", federationId: "assoc", role: "participant", name: athlete("assoc"), title: "ورزشکار", scope: "پرتال ورزشکاران", home: "/me" },
];

export const accountById = (id: string | undefined) => accounts.find((a) => a.id === id);

/** Persian and Arabic-Indic digits to Latin, spaces and dashes removed, +98 to 0. */
export function normalizePhone(raw: string): string {
  const latin = raw
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/[\s-]/g, "");
  return latin.startsWith("+98") ? `0${latin.slice(3)}` : latin;
}
