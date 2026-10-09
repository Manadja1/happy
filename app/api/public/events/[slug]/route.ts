import { NextRequest, NextResponse } from "next/server";
import { getPublicEvent } from "@/lib/events";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const event = await getPublicEvent(params.slug);
    if (!event) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Événement introuvable" } },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: event });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
