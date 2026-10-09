import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { updateGuestInEvent, deleteGuestFromEvent } from "@/lib/guests";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCurrentSession();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Connexion requise" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { eventId, ...updates } = body;

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "eventId requis" } },
        { status: 400 }
      );
    }

    const updated = await updateGuestInEvent(
      params.id,
      eventId,
      session.user.id,
      updates
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: err.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const deleted = await deleteGuestFromEvent(params.id, eventId, session.user.id);
    return NextResponse.json({ success: true, data: { deleted } });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: err.message } },
      { status: 400 }
    );
  }
}
