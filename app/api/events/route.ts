import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getUserEvents, createNewEvent } from "@/lib/events";

export async function GET() {
  try {
    const session = await getCurrentSession();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Connexion requise" } },
        { status: 401 }
      );
    }

    const events = await getUserEvents(session.user.id);
    return NextResponse.json({ success: true, data: events });
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
    const event = await createNewEvent(session.user.id, body);
    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: err.message } },
      { status: 400 }
    );
  }
}
