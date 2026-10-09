import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getGuestsForEvent, addGuestToEvent } from "@/lib/guests";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Connexion requise" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Paramètre eventId requis" } },
        { status: 400 }
      );
    }

    const guests = await getGuestsForEvent(eventId, session.user.id);
    return NextResponse.json({ success: true, data: guests });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

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
    const { eventId, ...guestData } = body;

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "eventId requis" } },
        { status: 400 }
      );
    }

    const guest = await addGuestToEvent(eventId, session.user.id, guestData);
    return NextResponse.json({ success: true, data: guest }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: err.message } },
      { status: 400 }
    );
  }
}
