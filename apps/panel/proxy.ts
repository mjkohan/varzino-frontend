import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "varzino-session";
const ACCOUNT_IDS = new Set([
  "para-fed", "para-board", "para-club", "para-athlete",
  "assoc-fed", "assoc-board", "assoc-club", "assoc-athlete",
]);

/** Optimistic check: pages without a known session cookie go to /login. */
export function proxy(request: NextRequest) {
  const id = request.cookies.get(SESSION_COOKIE)?.value;
  const signedIn = !!id && ACCOUNT_IDS.has(id);
  const { pathname } = request.nextUrl;

  if (pathname === "/login") {
    if (signedIn) return NextResponse.redirect(new URL(id.endsWith("-athlete") ? "/me" : "/", request.url));
    return NextResponse.next();
  }
  if (!signedIn) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  // Skip Next internals, static files and the icon routes.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|fonts|.*\.(?:png|svg|jpg|jpeg|webp|ico|woff2?)$).*)"],
};
