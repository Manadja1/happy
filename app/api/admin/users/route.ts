import { NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/auth/session";
import { store } from "@/lib/db/store";
import { sanitizeUser } from "@/lib/auth/security";
import { UserRole } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await assertAdminAccess();
    const rawUsers = store.getAllUsers();
    const allEvents = store.getAllEvents();

    const usersWithMetrics = rawUsers.map((u) => {
      const userEvents = allEvents.filter((e) => e.ownerId === u.id);
      return {
        ...sanitizeUser(u),
        eventsCount: userEvents.length,
        events: userEvents.map((e) => ({
          id: e.id,
          name: e.name,
          status: e.status,
          date: e.date,
          slug: e.slug,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      data: usersWithMetrics,
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

export async function PATCH(req: Request) {
  try {
    await assertAdminAccess();
    const body = await req.json();
    const { userId, role, name, phone } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { message: "Identifiant utilisateur requis" } },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (role && ["ADMIN", "OWNER", "MANAGER", "CHECKIN_AGENT"].includes(role)) {
      updates.role = role as UserRole;
    }
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;

    const updated = store.updateUser(userId, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: { message: "Utilisateur introuvable" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: sanitizeUser(updated),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Erreur lors de la mise à jour" } },
      { status: 403 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await assertAdminAccess();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { message: "userId requis" } },
        { status: 400 }
      );
    }

    // Protection: Admin cannot delete themselves
    if (userId === admin.id) {
      return NextResponse.json(
        { success: false, error: { message: "Action interdite : vous ne pouvez pas supprimer votre propre compte administrateur" } },
        { status: 400 }
      );
    }

    const deleted = store.deleteUser(userId);
    return NextResponse.json({
      success: deleted,
      message: deleted ? "Utilisateur et événements supprimés avec succès" : "Utilisateur introuvable",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Erreur serveur" } },
      { status: 403 }
    );
  }
}
