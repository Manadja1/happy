import { NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/auth/session";
import { store } from "@/lib/db/store";
import { checkPostgresHealth } from "@/lib/db/postgres";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await assertAdminAccess();
    const stats = store.getGlobalPlatformStats();
    const dbHealth = await checkPostgresHealth();

    return NextResponse.json({
      success: true,
      data: {
        adminUser: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        stats,
        system: {
          database: dbHealth.status,
          databaseLatencyMs: dbHealth.latencyMs,
          nodeVersion: process.version,
          platform: process.platform,
          uptime: process.uptime(),
          memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        },
      },
    });
  } catch (error: any) {
    const isForbidden = error.message?.includes("FORBIDDEN");
    const isUnauthorized = error.message?.includes("UNAUTHORIZED");

    return NextResponse.json(
      {
        success: false,
        error: {
          code: isForbidden ? "FORBIDDEN" : isUnauthorized ? "UNAUTHORIZED" : "INTERNAL_ERROR",
          message: error.message || "Erreur serveur lors de la récupération des statistiques administratives",
        },
      },
      { status: isForbidden ? 403 : isUnauthorized ? 401 : 500 }
    );
  }
}
