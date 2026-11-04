import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE_NAME = "happy_session_user";
const DEFAULT_AUTH_SECRET = "happy-events-secure-vault-key-ci-2026-very-secret-phrase";

function getEdgeAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if ((process.env.NODE_ENV as string) === "production") {
      return "";
    }
    return DEFAULT_AUTH_SECRET;
  }
  return secret;
}

function hexToBytes(hex: string): Uint8Array | null {
  if (!hex || hex.length % 2 !== 0 || !/^[0-9a-fA-F]+$/.test(hex)) {
    return null;
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Cryptographically verifies the HMAC-SHA256 session cookie in the Edge Runtime
 * using Web Crypto (`crypto.subtle.verify`) to prevent forged cookie bypass.
 */
async function verifyEdgeSessionCookie(cookieValue?: string): Promise<boolean> {
  if (!cookieValue) return false;
  const parts = cookieValue.split(":");
  if (parts.length !== 3) return false;

  const [userId, expiresAtStr, signatureHex] = parts;
  const expiresAt = Number(expiresAtStr);
  if (!userId || isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  const secret = getEdgeAuthSecret();
  if (!secret) return false;

  const sigBytes = hexToBytes(signatureHex);
  if (!sigBytes || sigBytes.length !== 32) return false;

  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const payloadBytes = encoder.encode(`${userId}:${expiresAtStr}`);
    return await crypto.subtle.verify("HMAC", key, sigBytes as unknown as BufferSource, payloadBytes);
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const hasValidSession = await verifyEdgeSessionCookie(sessionCookie);

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
