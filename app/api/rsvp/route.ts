import { NextRequest, NextResponse } from "next/server";
import { submitPublicRsvp } from "@/lib/rsvp";
import { checkRateLimit, createRateLimitResponse } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, { limit: 15, windowSec: 60, prefix: "api:rsvp" });
    if (!rateLimit.success) {
      return createRateLimitResponse(rateLimit, "Trop de réponses envoyées. Veuillez patienter un instant.");
    }

    const body = await req.json();
    const { slug, ...rsvpData } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Le slug de l'événement est requis" } },
        { status: 400 }
      );
    }

    if (!rsvpData.fullName || !rsvpData.status) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Le nom complet et le statut (CONFIRMED/DECLINED) sont requis" } },
        { status: 400 }
      );
    }

    const result = await submitPublicRsvp(slug, rsvpData);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: err.message } },
      { status: 400 }
    );
  }
}
