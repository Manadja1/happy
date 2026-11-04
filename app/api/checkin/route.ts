import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, assertEventAccess, isAdminUser } from "@/lib/auth/session";
import { verifyQrToken, confirmGuestCheckin } from "@/lib/checkin";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Connexion requise pour inspecter un pass" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || searchParams.get("qrToken");

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Token QR code requis" } },
        { status: 400 }
      );
    }

    const verification = await verifyQrToken(token);

    // Enforce multi-tenant event ownership: only the event owner, a CHECKIN_AGENT, or an ADMIN can inspect this pass
    if (verification.guest?.eventId && !isAdminUser(session.user) && session.user.role !== "CHECKIN_AGENT") {
      try {
        await assertEventAccess(session.user.id, verification.guest.eventId);
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "Ce pass appartient à un événement dont vous n'êtes pas l'organisateur.",
            },
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ success: true, data: verification });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Erreur lors de la vérification du pass" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, { limit: 120, windowSec: 60, prefix: "api:checkin" });
    if (!rateLimit.success) {
      return createRateLimitResponse(rateLimit, "Trop de requêtes de scan. Veuillez ralentir la cadence.");
    }

    const session = await getCurrentSession();
    if (!session.isAuthenticated || !session.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Connexion requise pour valider un pass d'entrée" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { token, qrToken, agentId } = body;
    const finalToken = token || qrToken;

    if (!finalToken) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Token QR code requis" } },
        { status: 400 }
      );
    }

    // 1. Pre-verify token ownership before mutating check-in state
    const preCheck = await verifyQrToken(finalToken);
    if (preCheck.guest?.eventId && !isAdminUser(session.user) && session.user.role !== "CHECKIN_AGENT") {
      try {
        await assertEventAccess(session.user.id, preCheck.guest.eventId);
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "Accès refusé : vous n'êtes pas autorisé à scanner des billets pour cet événement.",
            },
          },
          { status: 403 }
        );
      }
    }

    const operatorId = session.user.name || session.user.email || agentId || "agent_mobile_gate";
    const result = await confirmGuestCheckin(finalToken, operatorId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.error?.startsWith("ALREADY") ? "ALREADY_CHECKED_IN" : "INVALID_TOKEN",
            message: result.error,
          },
          guest: result.guest,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Erreur lors de la validation du check-in" } },
      { status: 500 }
    );
  }
}
