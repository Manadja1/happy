import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { getEventStatsForUser } from "@/lib/events";

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

    const stats = await getEventStatsForUser(params.id, session.user.id);
    return NextResponse.json({ success: true, data: stats });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "BAD_REQUEST", message: err.message } },
      { status: 400 }
    );
  }
}
