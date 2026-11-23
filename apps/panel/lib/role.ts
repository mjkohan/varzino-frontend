import { demoRoles, type DemoRole } from "@varzino/demo-data";
import { cookies } from "next/headers";

export async function getDemoRole(): Promise<DemoRole> {
  const id = (await cookies()).get("varzino-role")?.value;
  return demoRoles.find((r) => r.id === id) ?? demoRoles[0]!;
}
