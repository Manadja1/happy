import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import {
  getEventForUser,
  updateExistingEvent,
  deleteExistingEvent,
} from "@/lib/events";

export async function GET(
  _req: NextRequest,
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

    const event = await getEventForUser(params.id, session.user.id);
    return NextResponse.json({ success: true, data: event });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "NOT_FOUND", message: err.message } },
      { status: 404 }
    );
  }
}

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
    const updated = await updateExistingEvent(params.id, session.user.id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: err.message } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
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

    const deleted = await deleteExistingEvent(params.id, session.user.id);
    return NextResponse.json({ success: true, data: { deleted } });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: err.message } },
      { status: 400 }
    );
  }
}
