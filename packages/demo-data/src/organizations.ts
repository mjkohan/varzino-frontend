import type { FederationProfile } from "./federations";
import type { Club } from "./people";
import type { Province } from "./provinces";

export type OrgKind = "federation" | "association" | "committee" | "board" | "city" | "club";

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
  association: "انجمن ورزشی",
  committee: "کمیته",
  board: "هیئت استانی",
  city: "هیئت شهرستان",
  club: "باشگاه",
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

const boardHeads = ["مهدی رحیمی", "سارا کریمی", "حسین قاسمی", "رضا نجفی", "امید طاهری", "مریم سلطانی", "داوود اکبری", "فرزاد شریفی"];

export function buildOrganizations(p: FederationProfile, provinces: Province[], clubs: Club[]) {
  const committees: OrgNode = {
    id: "committees",
    name: "کمیته‌های تخصصی",
    kind: "committee",
    children: p.committees.map((c) => ({ ...c, kind: "committee" as const })),
  };
  const boards: OrgNode[] = provinces.slice(0, 8).map((prov, i) => ({
    id: `board-${prov.id}`,
    name: p.boardName(prov.name),
    kind: "board" as const,
    head: boardHeads[i],
    members: prov.athletes,
    children: clubs
      .filter((c) => c.provinceId === prov.id)
      .slice(0, 4)
      .map((c) => ({ id: c.id, name: c.name, kind: "club" as const, head: c.manager, members: c.athletes })),
  }));
  const members = provinces.reduce((s, x) => s + x.athletes, 0);

  const orgTree: OrgNode = {
    id: "fed",
    name: p.name,
    kind: "federation",
    head: p.president,
    members,
    children: p.association
      ? [{ id: "assoc", name: p.association.name, kind: "association", head: p.association.head, members, children: [committees, ...boards] }]
      : [committees, ...boards],
  };

  const positions: Position[] = p.positions.map((x, i) => ({ ...x, id: `pos-${i + 1}` }));

  return { federationName: p.name, orgTree, positions };
}

export const positionStatusLabel: Record<Position["status"], string> = {
  filled: "منصوب",
  vacant: "بلاتصدی",
  acting: "سرپرست",
};
