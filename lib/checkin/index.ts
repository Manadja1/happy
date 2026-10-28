import crypto from "crypto";
import { store } from "@/lib/db/store";
import { queryPostgres } from "@/lib/db/postgres";
import { Checkin, Guest, Event } from "@/types";

export interface QrVerificationResult {
  valid: boolean;
  guest?: Guest;
  event?: Event;
  alreadyCheckedIn: boolean;
  checkedInAt?: Date;
  checkedInBy?: string;
  error?: string;
}

export interface CheckinExecutionResult {
  success: boolean;
  guest?: Guest;
  checkin?: Checkin;
  error?: string;
  isAtomicDb?: boolean;
}

/**
 * Format a Date object to local Abidjan / GMT time (HH:mm:ss)
 */
function formatTime(d?: Date | string | null): string {
  if (!d) return "heure inconnue";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  return dateObj.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/**
 * Verifies a QR token against PostgreSQL (authoritative) or in-memory store (fallback).
 */
export async function verifyQrToken(qrToken: string): Promise<QrVerificationResult> {
  if (!qrToken || typeof qrToken !== "string") {
    return {
      valid: false,
      alreadyCheckedIn: false,
      error: "INVALID_TOKEN: Token QR code manquant ou malformé",
    };
  }

  const cleanToken = qrToken.trim();

  // 1. Authoritative check in PostgreSQL if available
  try {
    const rows = await queryPostgres(
      `
      SELECT 
        g.*,
        c."id" AS "checkinId",
        c."checkedInAt",
        c."checkedInBy",
        e."name" AS "eventName",
        e."venue" AS "eventVenue",
        e."status" AS "eventStatus"
      FROM "guests" g
      JOIN "events" e ON e."id" = g."eventId"
      LEFT JOIN "checkins" c ON c."guestId" = g."id"
      WHERE g."qrToken" = $1
      ORDER BY c."checkedInAt" DESC
      LIMIT 1;
    `,
      [cleanToken]
    );

    if (rows && rows.length > 0) {
      const row = rows[0];
      const guest: Guest = {
        id: row.id,
        eventId: row.eventId,
        firstName: row.firstName,
        lastName: row.lastName,
        phone: row.phone,
        email: row.email,
        group: row.group,
        isVip: row.isVip,
        plusOneAllowed: row.plusOneAllowed,
        plusOneCount: row.plusOneCount,
        rsvpStatus: row.rsvpStatus,
        qrToken: row.qrToken,
        checkedIn: Boolean(row.checkedIn),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      const event = store.getEventById(guest.eventId) || ({
        id: row.eventId,
        name: row.eventName,
        venue: row.eventVenue,
        status: row.eventStatus,
      } as any);

      if (guest.checkedIn) {
        return {
          valid: true,
          guest,
          event,
          alreadyCheckedIn: true,
          checkedInAt: row.checkedInAt ? new Date(row.checkedInAt) : undefined,
          checkedInBy: row.checkedInBy || undefined,
          error: `ALREADY_CHECKED_IN: Pass déjà validé à ${formatTime(row.checkedInAt)} par ${row.checkedInBy || "un agent"}.`,
        };
      }

      return {
        valid: true,
        guest,
        event,
        alreadyCheckedIn: false,
      };
    }
  } catch {
    // If PostgreSQL query fails or is not configured, fall through to in-memory store
  }

  // 2. In-Memory Store Fallback
  const guest = store.getGuestByQrToken(cleanToken);
  if (!guest) {
    return {
      valid: false,
      alreadyCheckedIn: false,
      error: "TOKEN_NOT_FOUND: Ce QR code ne correspond à aucun invité enregistré",
    };
  }

  const event = store.getEventById(guest.eventId);
  if (!event) {
    return {
      valid: false,
      alreadyCheckedIn: false,
      error: "EVENT_NOT_FOUND: Événement introuvable",
    };
  }

  if (guest.checkedIn) {
    const checkins = store.getCheckinsByEvent(guest.eventId);
    const existing = checkins.find((c) => c.guestId === guest.id);
    return {
      valid: true,
      guest,
      event,
      alreadyCheckedIn: true,
      checkedInAt: existing?.checkedInAt,
      checkedInBy: existing?.checkedInBy,
      error: `ALREADY_CHECKED_IN: Pass déjà validé à ${formatTime(existing?.checkedInAt)} par ${existing?.checkedInBy || "un agent"}.`,
    };
  }

  return {
    valid: true,
    guest,
    event,
    alreadyCheckedIn: false,
  };
}

/**
 * Atomically confirms a guest check-in with row-level database locking to prevent race conditions.
 */
export async function confirmGuestCheckin(
  qrToken: string,
  agentId: string = "agent_mobile_gate"
): Promise<CheckinExecutionResult> {
  if (!qrToken || typeof qrToken !== "string") {
    return { success: false, error: "INVALID_TOKEN: Token manquant" };
  }

  const cleanToken = qrToken.trim();

  // --- ATOMIC EXECUTION IN POSTGRESQL (Row-level lock) ---
  try {
    // Atomic Compare-And-Swap: UPDATE only if checkedIn is currently FALSE
    const updateRows = await queryPostgres(
      `
      UPDATE "guests"
      SET "checkedIn" = true, "updatedAt" = NOW()
      WHERE "qrToken" = $1 AND "checkedIn" = false
      RETURNING *;
    `,
      [cleanToken]
    );

    if (updateRows && updateRows.length > 0) {
      const gRow = updateRows[0];
      const checkinId = "chk_" + crypto.randomBytes(8).toString("hex");

      // Insert checkin record
      await queryPostgres(
        `
        INSERT INTO "checkins" ("id", "eventId", "guestId", "checkedInAt", "checkedInBy")
        VALUES ($1, $2, $3, NOW(), $4)
        ON CONFLICT ("id") DO NOTHING;
      `,
        [checkinId, gRow.eventId, gRow.id, agentId]
      );

      const guest: Guest = {
        id: gRow.id,
        eventId: gRow.eventId,
        firstName: gRow.firstName,
        lastName: gRow.lastName,
        phone: gRow.phone,
        email: gRow.email,
        group: gRow.group,
        isVip: gRow.isVip,
        plusOneAllowed: gRow.plusOneAllowed,
        plusOneCount: gRow.plusOneCount,
        rsvpStatus: gRow.rsvpStatus,
        qrToken: gRow.qrToken,
        checkedIn: true,
        createdAt: new Date(gRow.createdAt),
        updatedAt: new Date(gRow.updatedAt),
      };

      const checkin: Checkin = {
        id: checkinId,
        eventId: gRow.eventId,
        guestId: gRow.id,
        checkedInAt: new Date(),
        checkedInBy: agentId,
      };

      // Mirror state in memory store for fast local reads
      store.performCheckin(gRow.eventId, gRow.id, agentId);

      return {
        success: true,
        guest,
        checkin,
        isAtomicDb: true,
      };
    }

    // If 0 rows updated, verify if it was already checked in (anti-fraud detection)
    const existing = await queryPostgres(
      `
      SELECT 
        g.*,
        c."checkedInAt",
        c."checkedInBy"
      FROM "guests" g
      LEFT JOIN "checkins" c ON c."guestId" = g."id"
      WHERE g."qrToken" = $1
      ORDER BY c."checkedInAt" DESC
      LIMIT 1;
    `,
      [cleanToken]
    );

    if (existing && existing.length > 0) {
      const row = existing[0];
      const g: Guest = {
        id: row.id,
        eventId: row.eventId,
        firstName: row.firstName,
        lastName: row.lastName,
        phone: row.phone,
        email: row.email,
        group: row.group,
        isVip: row.isVip,
        plusOneAllowed: row.plusOneAllowed,
        plusOneCount: row.plusOneCount,
        rsvpStatus: row.rsvpStatus,
        qrToken: row.qrToken,
        checkedIn: true,
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
      };

      return {
        success: false,
        guest: g,
        error: `ALREADY_CHECKED_IN: Ce pass a déjà été scanné à ${formatTime(row.checkedInAt)} par ${row.checkedInBy || "un agent"}. Double entrée interdite.`,
      };
    }

    // Token did not match any guest in database
    return {
      success: false,
      error: "INVALID_TOKEN: QR code non reconnu dans la base d'invités",
    };
  } catch (err: any) {
    // If PostgreSQL fails or is unavailable, use in-memory store with lock protection
    console.warn(`[Checkin Postgres Fallback] ${err.message}`);
  }

  // --- LOCAL MEMORY FALLBACK ---
  const verification = await verifyQrToken(cleanToken);
  if (!verification.valid || !verification.guest || !verification.event) {
    return {
      success: false,
      error: verification.error || "INVALID_TOKEN",
    };
  }

  if (verification.alreadyCheckedIn) {
    return {
      success: false,
      guest: verification.guest,
      error: verification.error || "ALREADY_CHECKED_IN: Ce pass a déjà été utilisé",
    };
  }

  const result = store.performCheckin(
    verification.guest.eventId,
    verification.guest.id,
    agentId
  );

  if (!result.success) {
    return {
      success: false,
      guest: verification.guest,
      error: result.error || "CHECKIN_FAILED",
    };
  }

  return {
    success: true,
    guest: verification.guest,
    checkin: result.checkin,
    isAtomicDb: false,
  };
}
