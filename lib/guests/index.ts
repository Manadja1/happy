import { store } from "@/lib/db/store";
import { assertEventAccess } from "@/lib/auth/session";
import { Guest, RsvpStatus } from "@/types";
import { syncGuestToPostgres, deleteGuestFromPostgres } from "@/lib/db/sync";

export interface CreateGuestInput {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  group?: string;
  isVip?: boolean;
  plusOneAllowed?: boolean;
  plusOneCount?: number;
  rsvpStatus?: RsvpStatus;
}

export interface UpdateGuestInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  group?: string;
  isVip?: boolean;
  plusOneAllowed?: boolean;
  plusOneCount?: number;
  rsvpStatus?: RsvpStatus;
}

export interface CsvImportResult {
  totalParsed: number;
  importedCount: number;
  skippedCount: number;
  guests: Guest[];
  errors: string[];
}

export async function getGuestsForEvent(
  eventId: string,
  userId: string
): Promise<Guest[]> {
  await assertEventAccess(userId, eventId);
  return store.getGuestsByEvent(eventId);
}

export async function addGuestToEvent(
  eventId: string,
  userId: string,
  input: CreateGuestInput
): Promise<Guest> {
  await assertEventAccess(userId, eventId);

  if (!input.firstName?.trim() || !input.lastName?.trim()) {
    throw new Error("VALIDATION_ERROR: Le prénom et le nom sont requis");
  }

  const guest = store.createGuest({
    eventId,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    group: input.group?.trim() || "Invités",
    isVip: Boolean(input.isVip),
    plusOneAllowed: Boolean(input.plusOneAllowed),
    plusOneCount: input.plusOneCount || 0,
    rsvpStatus: input.rsvpStatus || "PENDING",
  });
  await syncGuestToPostgres(guest);
  return guest;
}

export async function updateGuestInEvent(
  guestId: string,
  eventId: string,
  userId: string,
  input: UpdateGuestInput
): Promise<Guest> {
  await assertEventAccess(userId, eventId);

  const guest = store.getGuestById(guestId);
  if (!guest || guest.eventId !== eventId) {
    throw new Error("NOT_FOUND: Invité introuvable dans cet événement");
  }

  const updates: Partial<Guest> = {};
  if (input.firstName !== undefined) updates.firstName = input.firstName.trim();
  if (input.lastName !== undefined) updates.lastName = input.lastName.trim();
  if (input.phone !== undefined) updates.phone = input.phone?.trim() || null;
  if (input.email !== undefined) updates.email = input.email?.trim() || null;
  if (input.group !== undefined) updates.group = input.group?.trim() || null;
  if (input.isVip !== undefined) updates.isVip = input.isVip;
  if (input.plusOneAllowed !== undefined) updates.plusOneAllowed = input.plusOneAllowed;
  if (input.plusOneCount !== undefined) updates.plusOneCount = input.plusOneCount;
  if (input.rsvpStatus !== undefined) updates.rsvpStatus = input.rsvpStatus;

  const updated = store.updateGuest(guestId, updates);
  if (!updated) {
    throw new Error("UPDATE_FAILED: Impossible de mettre à jour l'invité");
  }
  await syncGuestToPostgres(updated);
  return updated;
}

export async function deleteGuestFromEvent(
  guestId: string,
  eventId: string,
  userId: string
): Promise<boolean> {
  await assertEventAccess(userId, eventId);

  const guest = store.getGuestById(guestId);
  if (!guest || guest.eventId !== eventId) {
    throw new Error("NOT_FOUND: Invité introuvable dans cet événement");
  }

  const ok = store.deleteGuest(guestId);
  if (ok) {
    await deleteGuestFromPostgres(guestId);
  }
  return ok;
}

/**
 * Parses and imports CSV data with intelligent column detection
 * Supports headers like: Nom, Prénom, Téléphone, Groupe, VIP, +1
 */
export async function importGuestsFromCsv(
  eventId: string,
  userId: string,
  csvText: string
): Promise<CsvImportResult> {
  await assertEventAccess(userId, eventId);

  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      totalParsed: 0,
      importedCount: 0,
      skippedCount: 0,
      guests: [],
      errors: ["Fichier CSV vide"],
    };
  }

  // Detect delimiter (, or ;)
  const firstLine = lines[0];
  const delimiter = firstLine.includes(";") ? ";" : ",";

  const headers = firstLine
    .split(delimiter)
    .map((h) => h.trim().toLowerCase().replace(/["']/g, ""));

  const fnIndex = headers.findIndex((h) => h.includes("prenom") || h.includes("first"));
  const lnIndex = headers.findIndex((h) => h.includes("nom") || h.includes("last"));
  const phoneIndex = headers.findIndex((h) => h.includes("tel") || h.includes("phone") || h.includes("mobile"));
  const emailIndex = headers.findIndex((h) => h.includes("email") || h.includes("mail"));
  const groupIndex = headers.findIndex((h) => h.includes("groupe") || h.includes("group") || h.includes("table"));
  const vipIndex = headers.findIndex((h) => h.includes("vip"));
  const plusOneIndex = headers.findIndex((h) => h.includes("+1") || h.includes("plusone") || h.includes("accomp"));

  const guestsToInsert: Array<Omit<Guest, "id" | "eventId" | "qrToken" | "checkedIn" | "createdAt" | "updatedAt">> = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i];
    const cols = rawLine.split(delimiter).map((c) => c.trim().replace(/^["']|["']$/g, ""));

    let firstName = fnIndex !== -1 && cols[fnIndex] ? cols[fnIndex] : "";
    let lastName = lnIndex !== -1 && cols[lnIndex] ? cols[lnIndex] : "";

    // If only one column was mapped or found
    if (!firstName && !lastName && cols[0]) {
      const parts = cols[0].split(/\s+/);
      firstName = parts[0] || "Invité";
      lastName = parts.slice(1).join(" ") || String(i);
    } else if (!firstName && lastName) {
      firstName = "Invité";
    } else if (firstName && !lastName) {
      lastName = "";
    }

    if (!firstName) {
      errors.push(`Ligne ${i + 1} ignorée : Nom ou prénom manquant`);
      continue;
    }

    const phone = phoneIndex !== -1 ? cols[phoneIndex] : null;
    const email = emailIndex !== -1 ? cols[emailIndex] : null;
    const group = groupIndex !== -1 && cols[groupIndex] ? cols[groupIndex] : "Invités";
    const isVip = vipIndex !== -1 ? ["true", "1", "oui", "yes"].includes((cols[vipIndex] || "").toLowerCase()) : false;
    const plusOneAllowed = plusOneIndex !== -1 ? ["true", "1", "oui", "yes"].includes((cols[plusOneIndex] || "").toLowerCase()) : false;

    guestsToInsert.push({
      firstName,
      lastName,
      phone: phone || null,
      email: email || null,
      group,
      isVip,
      plusOneAllowed,
      plusOneCount: plusOneAllowed ? 1 : 0,
      rsvpStatus: "PENDING",
    });
  }

  const createdGuests = store.batchCreateGuests(eventId, guestsToInsert);

  return {
    totalParsed: lines.length - 1,
    importedCount: createdGuests.length,
    skippedCount: lines.length - 1 - createdGuests.length,
    guests: createdGuests,
    errors,
  };
}
