"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accounts, normalizePhone } from "@/lib/accounts";
import { SESSION_COOKIE } from "@/lib/session";
import { PANEL_URL } from "@varzino/shared/urls";

export type LoginState = { error?: string; phone?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const password = String(formData.get("password") ?? "");
  if (!phone || !password) return { error: "شماره همراه و رمز عبور را وارد کنید", phone };

  const account = accounts.find((a) => a.phone === phone && a.password === password);
  if (!account) return { error: "شماره همراه یا رمز عبور نادرست است", phone };

  (await cookies()).set(SESSION_COOKIE, account.id, {
    httpOnly: true,
    sameSite: "lax",
    // Secure only when the panel is served over HTTPS, so a plain-HTTP deployment can still sign in.
    secure: PANEL_URL.startsWith("https://"),
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(account.home);
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
