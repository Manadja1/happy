import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { importGuestsFromCsv } from "@/lib/guests";

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Connexion requise" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { eventId, csv } = body;

    if (!eventId || !csv) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "eventId et csv sont requis" } },
        { status: 400 }
      );
    }

    const result = await importGuestsFromCsv(eventId, session.user.id, csv);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: err.message } },
      { status: 400 }
    );
  }
}
