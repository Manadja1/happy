import { NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/auth/session";
import { store } from "@/lib/db/store";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await assertAdminAccess();
    const events = store.getAllEvents();
    const users = store.getAllUsers();

    const eventsWithDetails = events.map((event) => {
      const owner = users.find((u) => u.id === event.ownerId);
      const stats = store.getEventStats(event.id);
      return {
        ...event,
        owner: owner
          ? {
              id: owner.id,
              name: owner.name,
              email: owner.email,
              phone: owner.phone,
              avatar: owner.avatar,
            }
          : null,
        stats,
      };
    });

    return NextResponse.json({
      success: true,
      data: eventsWithDetails,
    });
  } catch (error: any) {
    const isForbidden = error.message?.includes("FORBIDDEN");
    return NextResponse.json(
      {
        success: false,
        error: {
          code: isForbidden ? "FORBIDDEN" : "UNAUTHORIZED",
          message: error.message || "Accès refusé",
        },
      },
      { status: isForbidden ? 403 : 401 }
    );
  }
}
