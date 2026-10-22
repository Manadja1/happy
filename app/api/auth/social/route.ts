import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/db/store";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { signSessionToken, sanitizeUser } from "@/lib/auth/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const provider = (body.provider || "google").toLowerCase();
    const email = (body.email || "").trim().toLowerCase();
    const name = (body.name || "").trim();
    const avatar =
      body.avatar ||
      (provider === "google"
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80");

    // 1. Validate email
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

    // 2. Find existing user or create a new one
    let user = store.getUserByEmail(email);

    if (!user) {
      // Create new user automatically from Google / Facebook profile
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
        avatar,
        role: "OWNER",
        passwordHash: null, // Social SSO account
      });
    } else {
      // Update avatar or name if previously missing
      const updates: any = {};
      if (!user.avatar && avatar) updates.avatar = avatar;
      if (!user.name && name) updates.name = name;
      if (Object.keys(updates).length > 0) {
        user = store.updateUser(user.id, updates) || user;
      }
    }

    // 3. Generate cryptographic signed session token
    const token = signSessionToken(user.id);

    // 4. Set HTTP-only secure cookie
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
