import { NextRequest, NextResponse } from "next/server";
import { verifyQrToken, confirmGuestCheckin } from "@/lib/checkin";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token") || searchParams.get("qrToken");

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Token QR code requis" } },
        { status: 400 }
      );
    }

    const verification = await verifyQrToken(token);
    return NextResponse.json({ success: true, data: verification });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, qrToken, agentId } = body;
    const finalToken = token || qrToken;

    if (!finalToken) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Token QR code requis" } },
        { status: 400 }
      );
    }

    const result = await confirmGuestCheckin(
      finalToken,
      agentId || "agent_mobile_gate"
    );

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: result.error?.startsWith("ALREADY") ? "ALREADY_CHECKED_IN" : "INVALID_TOKEN",
            message: result.error,
          },
          guest: result.guest,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
