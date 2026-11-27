import { getDataset } from "@varzino/demo-data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accountById, type Account } from "./accounts";

export const SESSION_COOKIE = "varzino-session";

/** The signed-in account. Pages behind the proxy always have one; redirects to /login otherwise. */
export async function getSession(): Promise<Account> {
  const id = (await cookies()).get(SESSION_COOKIE)?.value;
  const account = accountById(id);
  if (!account) redirect("/login");
  return account;
}

/** Data set of the signed-in account's federation. */
export async function getData() {
  return getDataset((await getSession()).federationId);
}

/** What client components may know about the account: no password. */
export type SessionUser = Pick<Account, "name" | "title" | "scope" | "role" | "federationId">;

export function toSessionUser(a: Account): SessionUser {
  return { name: a.name, title: a.title, scope: a.scope, role: a.role, federationId: a.federationId };
}
