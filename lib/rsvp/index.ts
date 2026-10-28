import { store } from "@/lib/db/store";
import { assertEventAccess } from "@/lib/auth/session";
import { RSVP, Guest, RsvpStatus } from "@/types";

export interface PublicRsvpInput {
  fullName: string;
  phone?: string;
  email?: string;
  status: "CONFIRMED" | "DECLINED";
  plusOneCount?: number;
  dietaryPreference?: string;
  message?: string;
  guestId?: string;
}

export interface RsvpSubmissionResult {
  rsvp: RSVP;
  guest: Guest;
  eventSlug: string;
  qrToken?: string;
}

export async function submitPublicRsvp(
  slug: string,
  input: PublicRsvpInput
): Promise<RsvpSubmissionResult> {
  const event = store.getEventBySlug(slug);
  if (!event) {
    throw new Error("NOT_FOUND: Événement introuvable pour ce lien");
  }

  if (event.status === "CANCELLED" || event.status === "COMPLETED") {
    throw new Error("EVENT_CLOSED: Les réponses pour cet événement sont clôturées");
  }

  const normalizedPhone = input.phone?.trim().replace(/\s+/g, "");
  const nameParts = input.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || "Invité";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Find existing guest by ID or phone number
  let guest: Guest | null = null;
  if (input.guestId) {
    const candidate = store.getGuestById(input.guestId);
    // Strict multi-tenant isolation: guest must belong to the current event
    if (candidate && candidate.eventId === event.id) {
      guest = candidate;
    }
  }

  if (!guest && normalizedPhone) {
    const existingGuests = store.getGuestsByEvent(event.id);
    guest =
      existingGuests.find(
        (g) => g.phone && g.phone.replace(/\s+/g, "") === normalizedPhone
      ) || null;
  }

  // If not found, create new guest entry
  if (!guest) {
    guest = store.createGuest({
      eventId: event.id,
      firstName,
      lastName,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      group: "RSVP Public",
      isVip: false,
      plusOneAllowed: (input.plusOneCount || 0) > 0,
      plusOneCount: input.plusOneCount || 0,
      rsvpStatus: input.status,
    });
  } else {
    // Update existing guest info
    store.updateGuest(guest.id, {
      rsvpStatus: input.status,
      plusOneCount: input.plusOneCount || guest.plusOneCount,
      phone: input.phone?.trim() || guest.phone,
      email: input.email?.trim() || guest.email,
    });
  }

  const attendeeCount = input.status === "CONFIRMED" ? 1 + (input.plusOneCount || 0) : 0;

  const rsvp = store.recordRsvp({
    eventId: event.id,
    guestId: guest.id,
    status: input.status,
    attendeeCount,
    dietaryPreference: input.dietaryPreference?.trim() || null,
    message: input.message?.trim() || null,
  });

  return {
    rsvp,
    guest,
    eventSlug: event.slug,
    qrToken: input.status === "CONFIRMED" ? guest.qrToken : undefined,
  };
}

export async function getRsvpsForEvent(
  eventId: string,
  userId: string
): Promise<RSVP[]> {
  await assertEventAccess(userId, eventId);
  return store.getRsvpsByEvent(eventId);
}
