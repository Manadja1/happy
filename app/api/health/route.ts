import { NextResponse } from "next/server";
import { queryPostgres } from "@/lib/db/postgres";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  try {
    const rows = await queryPostgres<{ alive: number }>("SELECT 1 as alive");
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      status: "healthy",
      database: {
        provider: "Supabase PostgreSQL (Ireland eu-west-1)",
        status: "CONNECTED",
        latencyMs,
        alive: rows[0]?.alive === 1,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "degraded",
        database: {
          provider: "Supabase PostgreSQL",
          status: "DISCONNECTED",
          error: err.message,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
