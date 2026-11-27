import { daysFromNow } from "@varzino/utils";
import type { FederationProfile } from "./federations";

export type Approval = {
  id: string;
  title: string;
  from: string;
  kind: "license" | "competition" | "transfer" | "finance" | "course";
  href: string;
  waitingSince: Date;
};

export type Activity = { id: string; actor: string; action: string; target: string; at: Date };

export function buildDashboard(p: FederationProfile) {
  const approvals: Approval[] = p.approvals.map(({ waitingDays, ...a }) => ({ ...a, waitingSince: daysFromNow(-waitingDays) }));
  const activity: Activity[] = p.activity.map(({ day, hour, ...a }) => ({ ...a, at: daysFromNow(day, hour) }));
  return { approvals, activity };
}
