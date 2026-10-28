import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "happy_session_user";

function isValidSessionCookie(cookieValue?: string): boolean {
  if (!cookieValue) return false;
  const parts = cookieValue.split(":");
  if (parts.length !== 3) return false;
  const [userId, expiresAtStr, signature] = parts;
  const expiresAt = Number(expiresAtStr);
  if (!userId || isNaN(expiresAt) || !signature || signature.length < 32) return false;
  return Date.now() <= expiresAt;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasValidSession = isValidSessionCookie(sessionCookie);

  // Protect /dashboard and /admin routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    if (!hasValidSession) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      // Clean up invalid or expired cookie if present
      if (sessionCookie) {
        res.cookies.delete(SESSION_COOKIE_NAME);
      }
      return res;
    }
  }

  // If already authenticated and visiting login or register, redirect to dashboard
  if ((pathname === "/login" || pathname === "/register") && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
