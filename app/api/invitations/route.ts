import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession, assertEventAccess } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

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

    await assertEventAccess(session.user.id, eventId);
    const invitation = store.getInvitationByEventId(eventId);

    return NextResponse.json({ success: true, data: invitation });
  } catch (err: any) {
    const isForbidden = err.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: { code: isForbidden ? "FORBIDDEN" : "NOT_FOUND", message: err.message } },
      { status: isForbidden ? 403 : 404 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Connexion requise" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { eventId, templateId, title, content, themeConfig, published } = body;

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "eventId requis" } },
        { status: 400 }
      );
    }

    await assertEventAccess(session.user.id, eventId);

    const updated = store.upsertInvitation({
      eventId,
      templateId,
      title: title || "Invitation",
      content: content || "",
      themeConfig,
      published,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    const isForbidden = err.message?.includes("FORBIDDEN");
    return NextResponse.json(
      { success: false, error: { code: isForbidden ? "FORBIDDEN" : "BAD_REQUEST", message: err.message } },
      { status: isForbidden ? 403 : 400 }
    );
  }
}
