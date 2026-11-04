import { NextRequest, NextResponse } from "next/server";
import { getPublicEvent } from "@/lib/events";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await getPublicEvent(params.slug);
    if (!event || event.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Événement introuvable ou non publié" } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: event });
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Impossible de charger l'événement" } },
      { status: 500 }
    );
  }
}
