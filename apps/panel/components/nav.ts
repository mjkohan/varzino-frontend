import { modules, pillars, type ModuleDef, type PillarId } from "@varzino/demo-data";

export type NavGroup = { id: PillarId; title: string; items: ModuleDef[] };

// Sidebar order: work that happens daily first.
const order: PillarId[] = ["competition", "people", "finance", "governance", "operations"];

export const navGroups: NavGroup[] = order.map((id) => ({
  id,
  title: pillars.find((p) => p.id === id)!.title,
  items: modules.filter((m) => m.pillar === id),
}));

export function findModule(pathname: string): ModuleDef | undefined {
  return modules.find((m) => pathname === m.href || pathname.startsWith(`${m.href}/`));
}
