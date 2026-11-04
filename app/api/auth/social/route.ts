import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/db/store";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { signSessionToken, sanitizeUser } from "@/lib/auth/security";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limit";

interface VerifiedSocialIdentity {
  email: string;
  name?: string;
  avatar?: string;
}

/**
 * Verifies a cryptographic OAuth ID/Access token against the provider's verification endpoint.
 */
async function verifySocialOAuthToken(
  provider: string,
  idToken?: string
): Promise<VerifiedSocialIdentity | null> {
  if (!idToken || typeof idToken !== "string") {
    return null;
  }

  try {
    if (provider === "google") {
      const res = await fetch(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
        { method: "GET", cache: "no-store" }
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (data.email_verified !== "true" && data.email_verified !== true) {
        return null;
      }
      if (process.env.GOOGLE_CLIENT_ID && data.aud !== process.env.GOOGLE_CLIENT_ID) {
        return null;
      }
      return {
        email: String(data.email || "").trim().toLowerCase(),
        name: data.name ? String(data.name).trim() : undefined,
        avatar: data.picture ? String(data.picture).trim() : undefined,
      };
    }

    if (provider === "facebook") {
      const res = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${encodeURIComponent(idToken)}`,
        { method: "GET", cache: "no-store" }
      );
      if (!res.ok) return null;
      const data = await res.json();
      if (!data.email) return null;
      return {
        email: String(data.email).trim().toLowerCase(),
        name: data.name ? String(data.name).trim() : undefined,
        avatar: data.picture?.data?.url ? String(data.picture.data.url).trim() : undefined,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting to prevent automated enumeration or brute-force
    const rateLimit = checkRateLimit(req, { limit: 10, windowSec: 60, prefix: "auth:social" });
    if (!rateLimit.success) {
      return createRateLimitResponse(
        rateLimit,
        "Trop de tentatives de connexion sociale. Veuillez patienter une minute."
      );
    }

    const body = await req.json();
    const provider = (body.provider || "google").toLowerCase();
    const idToken = body.idToken || body.accessToken || "";
    const isProduction = (process.env.NODE_ENV as string) === "production";

    let email = "";
    let name = "";
    let avatar = "";

    // 2. Cryptographic OAuth Token Verification (Mandatory in production, supported in all envs)
    if (idToken) {
      const verified = await verifySocialOAuthToken(provider, idToken);
      if (!verified || !verified.email) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_OAUTH_TOKEN",
              message: "Jeton d'authentification OAuth invalide ou expiré.",
            },
          },
          { status: 401 }
        );
      }
      email = verified.email;
      name = verified.name || "";
      avatar = verified.avatar || "";
    } else if (isProduction) {
      // Strictly reject unverified social login requests in production
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "OAUTH_TOKEN_REQUIRED",
            message:
              "Un jeton OAuth cryptographique signé est requis en production pour la connexion sociale.",
          },
        },
        { status: 403 }
      );
    } else {
      // Development-only sandbox flow
      email = (body.email || "").trim().toLowerCase();
      name = (body.name || "").trim();
      avatar =
        body.avatar ||
        (provider === "google"
          ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");
    }

    // 3. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Adresse email fournie par le fournisseur social invalide.",
          },
        },
        { status: 400 }
      );
    }

    // 4. Find existing user or create a new one
    let user = store.getUserByEmail(email);

    if (user) {
      // Security Guard: Prevent account takeover of password-protected or admin accounts
      if (user.role === "ADMIN" || user.passwordHash) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "ACCOUNT_PROTECTED",
              message:
                "Un compte sécurisé existe déjà avec cette adresse email. Veuillez vous connecter avec votre mot de passe habituel.",
            },
          },
          { status: 403 }
        );
      }

      // Without a verified cryptographic idToken, do not allow taking over pre-existing accounts
      // unless it is an explicit local dev sandbox account (`google_user_*` or `fb_user_*`)
      if (
        !idToken &&
        !email.startsWith("google_user_") &&
        !email.startsWith("fb_user_")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "UNVERIFIED_SOCIAL_ACCOUNT",
              message:
                "Ce compte existe déjà. Un jeton OAuth vérifié ou votre mot de passe est requis pour vous y connecter.",
            },
          },
          { status: 403 }
        );
      }

      // Update avatar or name if previously missing on existing social account
      const updates: Record<string, string> = {};
      if (!user.avatar && avatar) updates.avatar = avatar;
      if (!user.name && name) updates.name = name;
      if (Object.keys(updates).length > 0) {
        user = store.updateUser(user.id, updates) || user;
      }
    } else {
      // Create new social user
      const derivedName =
        name ||
        email
          .split("@")[0]
          .replace(/[._-]/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase());

      user = store.createUser({
        name: derivedName,
        email,
        phone: null,
        avatar:
          avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "OWNER",
        passwordHash: null,
      });
    }

    // 5. Generate cryptographic signed session token
    const token = signSessionToken(user.id);

    // 6. Set HTTP-only secure cookie
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    const providerLabel =
      provider === "google"
        ? "Google"
        : provider === "facebook"
        ? "Facebook"
        : "Compte tiers";

    return NextResponse.json({
      success: true,
      data: sanitizeUser(user),
      message: `Connexion réussie avec ${providerLabel} ! Bienvenue ${user.name || ""}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: err.message || "Erreur lors de l'authentification sociale",
        },
      },
      { status: 500 }
    );
  }
}
