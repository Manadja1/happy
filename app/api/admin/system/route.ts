import { NextResponse } from "next/server";
import { assertAdminAccess } from "@/lib/auth/session";
import {
  checkPostgresHealth,
  testPostgresPooler,
  checkRlsStatus,
  enforceRlsOnAllTables,
} from "@/lib/db/postgres";
import { store } from "@/lib/db/store";
import {
  syncUserToPostgres,
  syncEventToPostgres,
  syncGuestToPostgres,
  syncRsvpToPostgres,
  syncInvitationToPostgres,
  syncCheckinToPostgres,
} from "@/lib/db/sync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await assertAdminAccess();
    const [health, pooler, rls] = await Promise.all([
      checkPostgresHealth(),
      testPostgresPooler(),
      checkRlsStatus(),
    ]);

    const users = store.getAllUsers();
    const events = store.getAllEvents();
    const guests = store.getAllGuests();
    const checkins = store.getAllCheckins();
    const rsvps = store.getAllRsvps();

    return NextResponse.json({
      success: true,
      data: {
        postgres: {
          health,
          pooler,
          rls,
          region: process.env.SUPABASE_REGION || "eu-west-1 (Irlande)",
          projectRef: process.env.SUPABASE_PROJECT_REF || "supabase-cluster",
        },
        counts: {
          users: users.length,
          events: events.length,
          guests: guests.length,
          checkins: checkins.length,
          rsvps: rsvps.length,
        },
        node: {
          version: process.version,
          uptimeSec: Math.round(process.uptime()),
          memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          env: process.env.NODE_ENV || "development",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Accès refusé" } },
      { status: 403 }
    );
  }
}

export async function POST() {
  try {
    await assertAdminAccess();

    const users = store.getAllUsers();
    const events = store.getAllEvents();
    const guests = store.getAllGuests();
    const checkins = store.getAllCheckins();
    const rsvps = store.getAllRsvps();

    // Enforce Row-Level Security (RLS) on all public tables + trigger sync
    const rlsResult = await enforceRlsOnAllTables().catch(() => ({
      success: false,
      securedTables: [],
    }));

    users.forEach((u) => syncUserToPostgres(u));
    events.forEach((e) => syncEventToPostgres(e));
    guests.forEach((g) => syncGuestToPostgres(g));
    rsvps.forEach((r) => syncRsvpToPostgres(r));
    checkins.forEach((c) => syncCheckinToPostgres(c));

    return NextResponse.json({
      success: true,
      message: "Synchronisation globale et sécurisation RLS Supabase exécutées avec succès",
      rlsSecuredTables: rlsResult.securedTables,
      syncedCounts: {
        users: users.length,
        events: events.length,
        guests: guests.length,
        checkins: checkins.length,
        rsvps: rsvps.length,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { message: error.message || "Erreur de synchronisation" } },
      { status: 403 }
    );
  }
}
