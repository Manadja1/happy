import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/db/store";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import {
  verifyPassword,
  hashPassword,
  signSessionToken,
  sanitizeUser,
} from "@/lib/auth/security";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, { limit: 5, windowSec: 60, prefix: "auth:login" });
    if (!rateLimit.success) {
      return createRateLimitResponse(rateLimit, "Trop de tentatives de connexion. Veuillez patienter une minute avant de réessayer.");
    }

    const body = await req.json();
    const isDemo = Boolean(body.isDemo);
    const identifier = (body.email || body.phone || body.identifier || "").trim();
    const password = body.password || "";

    // 1. Direct Demo Account Login (Strictly prohibited in production)
    if (isDemo) {
      if ((process.env.NODE_ENV as string) === "production") {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "L'accès démo automatique est désactivé en production pour des raisons de sécurité.",
            },
          },
          { status: 403 }
        );
      }

      let demoUser = store.getUserById("usr_demo_abidjan_01");
      if (!demoUser) {
        demoUser = store.createUser({
          name: "Ange Koffi",
          email: "ange.koffi@happyevents.ci",
          phone: "+225 07 00 11 22 33",
          avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          role: "ADMIN",
          passwordHash: hashPassword("HappyEvents2026!"),
        });
      }

      const token = signSessionToken(demoUser.id);
      const cookieStore = cookies();
      cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: (process.env.NODE_ENV as string) === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return NextResponse.json({
        success: true,
        data: sanitizeUser(demoUser),
        message: "Connexion réussie au compte de démonstration",
      });
    }

    // 2. Validate input
    if (!identifier) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Veuillez renseigner votre adresse email ou numéro de téléphone.",
          },
        },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Veuillez renseigner votre mot de passe.",
          },
        },
        { status: 400 }
      );
    }

    // 3. Find user by email or phone
    const isEmail = identifier.includes("@");
    const user = isEmail
      ? store.getUserByEmail(identifier)
      : store.getUserByPhone(identifier);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message:
              "Identifiants incorrects. Aucun compte n'est associé à cette adresse. Cliquez sur 'Inscription' pour créer votre compte.",
          },
        },
        { status: 401 }
      );
    }

    // 4. Verify password
    if (user.passwordHash) {
      const isValid = verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "INVALID_CREDENTIALS",
              message: "Mot de passe incorrect. Veuillez vérifier votre saisie.",
            },
          },
          { status: 401 }
        );
      }
    } else {
      // Accounts without a passwordHash (e.g. Social SSO or initial seed)
      if (user.id === "usr_demo_abidjan_01" && (process.env.NODE_ENV as string) !== "production") {
        if (password === "HappyEvents2026!" || password === "demo") {
          store.updateUser(user.id, { passwordHash: hashPassword(password) });
        } else {
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "INVALID_CREDENTIALS",
                message: "Mot de passe incorrect pour le compte démo.",
              },
            },
            { status: 401 }
          );
        }
      } else {
        // Prevent arbitrary password creation and account takeover
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "SSO_ACCOUNT_PASSWORD_REQUIRED",
              message:
                "Ce compte est associé à un profil tiers et n'a pas de mot de passe défini. Veuillez vous connecter avec le bouton associé ou demander une réinitialisation.",
            },
          },
          { status: 400 }
        );
      }
    }

    // 5. Sign cryptographic session token
    const token = signSessionToken(user.id);

    // 6. Set HTTP-only secure cookie
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: (process.env.NODE_ENV as string) === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json({
      success: true,
      data: sanitizeUser(user),
      message: "Connexion réussie ! Redirection...",
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Erreur interne" } },
      { status: 500 }
    );
  }
}
