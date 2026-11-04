import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { sanitizeUser } from "@/lib/auth/security";
import { store } from "@/lib/db/store";

export async function GET() {
  try {
    const session = await getCurrentSession();
    return NextResponse.json({
      success: true,
      data: {
        user: sanitizeUser(session.user),
        isAuthenticated: session.isAuthenticated,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Impossible de récupérer la session" } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email, phone } = body;

    let normalizedEmail: string | undefined;
    if (email !== undefined) {
      normalizedEmail = String(email).trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        return NextResponse.json(
          { success: false, error: { code: "VALIDATION_ERROR", message: "Format d'email invalide" } },
          { status: 400 }
        );
      }

      // Prevent email collision with another account
      const existing = store.getUserByEmail(normalizedEmail);
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "EMAIL_ALREADY_IN_USE",
              message: "Cette adresse email est déjà associée à un autre compte.",
            },
          },
          { status: 409 }
        );
      }
    }

    const updated = store.updateUser(session.user.id, {
      ...(name ? { name: String(name).trim().slice(0, 120) } : {}),
      ...(normalizedEmail ? { email: normalizedEmail } : {}),
      ...(phone ? { phone: String(phone).trim().slice(0, 40) } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Utilisateur introuvable" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user: sanitizeUser(updated) },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Erreur lors de la mise à jour du profil" } },
      { status: 500 }
    );
  }
}
