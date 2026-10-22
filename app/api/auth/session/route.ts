import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export async function GET() {
  try {
    const session = await getCurrentSession();
    return NextResponse.json({
      success: true,
      data: {
        user: session.user,
        isAuthenticated: session.isAuthenticated,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session.user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Non authentifié" } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email, phone } = body;

    const updated = store.updateUser(session.user.id, {
      ...(name ? { name: name.trim() } : {}),
      ...(email ? { email: email.trim().toLowerCase() } : {}),
      ...(phone ? { phone: phone.trim() } : {}),
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Utilisateur introuvable" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { user: updated },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
