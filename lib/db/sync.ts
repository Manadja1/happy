import { queryPostgres } from "./postgres";
import { User, Event, Guest, RSVP, Invitation, Checkin } from "@/types";

export async function syncUserToPostgres(u: User): Promise<void> {
  try {
    await queryPostgres(
      `
      INSERT INTO "users" ("id", "name", "email", "phone", "avatar", "role", "passwordHash", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6::"Role", $7, $8, $9)
      ON CONFLICT ("id") DO UPDATE SET
        "name" = EXCLUDED."name",
        "email" = EXCLUDED."email",
        "phone" = EXCLUDED."phone",
        "avatar" = EXCLUDED."avatar",
        "role" = EXCLUDED."role",
        "passwordHash" = COALESCE(EXCLUDED."passwordHash", "users"."passwordHash"),
        "updatedAt" = EXCLUDED."updatedAt"
    `,
      [u.id, u.name, u.email, u.phone, u.avatar, u.role, u.passwordHash || null, u.createdAt, u.updatedAt]
    );
  } catch (err: any) {
    console.warn(`[Sync User Failed]`, err.message);
  }
}

export async function syncEventToPostgres(e: Event): Promise<void> {
  try {
    await queryPostgres(
      `
      INSERT INTO "events" ("id", "ownerId", "name", "type", "description", "date", "startTime", "endTime", "timezone", "venue", "address", "latitude", "longitude", "coverImage", "theme", "slug", "status", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4::"EventType", $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17::"EventStatus", $18, $19)
      ON CONFLICT ("id") DO UPDATE SET
        "name" = EXCLUDED."name",
        "type" = EXCLUDED."type",
        "description" = EXCLUDED."description",
        "date" = EXCLUDED."date",
        "startTime" = EXCLUDED."startTime",
        "endTime" = EXCLUDED."endTime",
        "venue" = EXCLUDED."venue",
        "address" = EXCLUDED."address",
        "coverImage" = EXCLUDED."coverImage",
        "theme" = EXCLUDED."theme",
        "slug" = EXCLUDED."slug",
        "status" = EXCLUDED."status",
        "updatedAt" = EXCLUDED."updatedAt"
    `,
      [
        e.id,
        e.ownerId,
        e.name,
        e.type,
        e.description,
        e.date,
        e.startTime,
        e.endTime,
        e.timezone,
        e.venue,
        e.address,
        e.latitude,
        e.longitude,
        e.coverImage,
        e.theme,
        e.slug,
        e.status,
        e.createdAt,
        e.updatedAt,
      ]
    );
  } catch (err: any) {
    console.warn(`[Sync Event Failed]`, err.message);
  }
}

export async function deleteEventFromPostgres(eventId: string): Promise<void> {
  try {
    await queryPostgres('DELETE FROM "events" WHERE "id" = $1', [eventId]);
  } catch (err: any) {
    console.warn(`[Delete Event Failed]`, err.message);
  }
}

export async function syncGuestToPostgres(g: Guest): Promise<void> {
  try {
    await queryPostgres(
      `
      INSERT INTO "guests" ("id", "eventId", "firstName", "lastName", "phone", "email", "group", "isVip", "plusOneAllowed", "plusOneCount", "rsvpStatus", "qrToken", "checkedIn", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::"RsvpStatus", $12, $13, $14, $15)
      ON CONFLICT ("id") DO UPDATE SET
        "firstName" = EXCLUDED."firstName",
        "lastName" = EXCLUDED."lastName",
        "phone" = EXCLUDED."phone",
        "email" = EXCLUDED."email",
        "group" = EXCLUDED."group",
        "isVip" = EXCLUDED."isVip",
        "plusOneAllowed" = EXCLUDED."plusOneAllowed",
        "plusOneCount" = EXCLUDED."plusOneCount",
        "rsvpStatus" = EXCLUDED."rsvpStatus",
        "checkedIn" = EXCLUDED."checkedIn",
        "updatedAt" = EXCLUDED."updatedAt"
    `,
      [
        g.id,
        g.eventId,
        g.firstName,
        g.lastName,
        g.phone,
        g.email,
        g.group,
        g.isVip,
        g.plusOneAllowed,
        g.plusOneCount,
        g.rsvpStatus,
        g.qrToken,
        g.checkedIn,
        g.createdAt,
        g.updatedAt,
      ]
    );
  } catch (err: any) {
    console.warn(`[Sync Guest Failed]`, err.message);
  }
}

export async function deleteGuestFromPostgres(guestId: string): Promise<void> {
  try {
    await queryPostgres('DELETE FROM "guests" WHERE "id" = $1', [guestId]);
  } catch (err: any) {
    console.warn(`[Delete Guest Failed]`, err.message);
  }
}

export async function syncRsvpToPostgres(r: RSVP): Promise<void> {
  try {
    await queryPostgres(
      `
      INSERT INTO "rsvps" ("id", "eventId", "guestId", "status", "attendeeCount", "dietaryPreference", "message", "respondedAt")
      VALUES ($1, $2, $3, $4::"RsvpStatus", $5, $6, $7, $8)
      ON CONFLICT ("id") DO UPDATE SET
        "status" = EXCLUDED."status",
        "attendeeCount" = EXCLUDED."attendeeCount",
        "dietaryPreference" = EXCLUDED."dietaryPreference",
        "message" = EXCLUDED."message"
    `,
      [r.id, r.eventId, r.guestId, r.status, r.attendeeCount, r.dietaryPreference, r.message, r.respondedAt]
    );
  } catch (err: any) {
    console.warn(`[Sync RSVP Failed]`, err.message);
  }
}

export async function syncInvitationToPostgres(inv: Invitation): Promise<void> {
  try {
    await queryPostgres(
      `
      INSERT INTO "invitations" ("id", "eventId", "templateId", "title", "content", "themeConfig", "published", "publishedAt", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT ("id") DO UPDATE SET
        "templateId" = EXCLUDED."templateId",
        "title" = EXCLUDED."title",
        "content" = EXCLUDED."content",
        "themeConfig" = EXCLUDED."themeConfig",
        "published" = EXCLUDED."published",
        "publishedAt" = EXCLUDED."publishedAt",
        "updatedAt" = EXCLUDED."updatedAt"
    `,
      [
        inv.id,
        inv.eventId,
        inv.templateId,
        inv.title,
        inv.content,
        JSON.stringify(inv.themeConfig || {}),
        inv.published,
        inv.publishedAt,
        inv.createdAt,
        inv.updatedAt,
      ]
    );
  } catch (err: any) {
    console.warn(`[Sync Invitation Failed]`, err.message);
  }
}

export async function syncCheckinToPostgres(chk: Checkin): Promise<void> {
  try {
    await queryPostgres(
      `
      INSERT INTO "checkins" ("id", "eventId", "guestId", "checkedInAt", "checkedInBy")
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT ("id") DO NOTHING
    `,
      [chk.id, chk.eventId, chk.guestId, chk.checkedInAt, chk.checkedInBy]
    );
  } catch (err: any) {
    console.warn(`[Sync Checkin Failed]`, err.message);
  }
}

/**
 * Loads entire datasets from Supabase PostgreSQL to hydrate the local application cache.
 */
export async function fetchStoreFromPostgres(): Promise<{
  users: User[];
  events: Event[];
  guests: Guest[];
  rsvps: RSVP[];
  invitations: Invitation[];
  checkins: Checkin[];
} | null> {
  try {
    const [uRows, eRows, gRows, rRows, iRows, cRows] = await Promise.all([
      queryPostgres(`SELECT * FROM "users"`),
      queryPostgres(`SELECT * FROM "events"`),
      queryPostgres(`SELECT * FROM "guests"`),
      queryPostgres(`SELECT * FROM "rsvps"`),
      queryPostgres(`SELECT * FROM "invitations"`),
      queryPostgres(`SELECT * FROM "checkins"`),
    ]);

    if (!uRows || uRows.length === 0) {
      return null;
    }

    const reviveDate = (d: any) => (d ? new Date(d) : d);

    return {
      users: uRows.map((u: any) => ({
        ...u,
        createdAt: reviveDate(u.createdAt),
        updatedAt: reviveDate(u.updatedAt),
      })),
      events: eRows.map((e: any) => ({
        ...e,
        date: reviveDate(e.date),
        createdAt: reviveDate(e.createdAt),
        updatedAt: reviveDate(e.updatedAt),
      })),
      guests: gRows.map((g: any) => ({
        ...g,
        checkedIn: Boolean(g.checkedIn),
        createdAt: reviveDate(g.createdAt),
        updatedAt: reviveDate(g.updatedAt),
      })),
      rsvps: rRows.map((r: any) => ({
        ...r,
        respondedAt: reviveDate(r.respondedAt),
      })),
      invitations: iRows.map((i: any) => ({
        ...i,
        themeConfig: typeof i.themeConfig === "string" ? JSON.parse(i.themeConfig) : (i.themeConfig || {}),
        publishedAt: reviveDate(i.publishedAt),
        createdAt: reviveDate(i.createdAt),
        updatedAt: reviveDate(i.updatedAt),
      })),
      checkins: cRows.map((c: any) => ({
        ...c,
        checkedInAt: reviveDate(c.checkedInAt),
      })),
    };
  } catch (err: any) {
    console.warn("[Postgres Fetch Store Failed]", err.message);
    return null;
  }
}
