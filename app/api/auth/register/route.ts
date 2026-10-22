import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/db/store";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { hashPassword, signSessionToken, sanitizeUser } from "@/lib/auth/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = (body.name || body.fullName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = (body.phone || body.whatsapp || "").trim();
    const password = body.password || "";

    // 1. Validate name
    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Veuillez renseigner votre nom complet (au moins 2 caractères).",
          },
        },
        { status: 400 }
      );
    }

    // 2. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Veuillez renseigner une adresse email valide.",
          },
        },
        { status: 400 }
      );
    }

    // 3. Validate password
    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Le mot de passe doit contenir au moins 6 caractères.",
          },
        },
        { status: 400 }
      );
    }

    // 4. Check if email already registered
    const existingUser = store.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_ALREADY_EXISTS",
            message: "Un compte avec cette adresse email existe déjà. Veuillez vous connecter.",
          },
        },
        { status: 409 }
      );
    }

    // 5. Hash password with secure cryptographic salt
    const passwordHash = hashPassword(password);

    // 6. Create user in store & PostgreSQL
    const newUser = store.createUser({
      name,
      email,
      phone: phone || null,
      role: "OWNER",
      passwordHash,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    });

    // 7. Generate signed cryptographic session token
    const token = signSessionToken(newUser.id);

    // 8. Set HTTP-only secure cookie
    const cookieStore = cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return NextResponse.json(
      {
        success: true,
        data: sanitizeUser(newUser),
        message: "Compte créé avec succès ! Bienvenue sur HAPPY EVENTS.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message || "Erreur interne" } },
      { status: 500 }
    );
  }
}
