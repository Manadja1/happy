import { store } from "@/lib/db/store";
import { assertEventAccess } from "@/lib/auth/session";
import { RSVP, Guest } from "@/types";

export interface PublicRsvpInput {
  fullName: string;
  phone?: string;
  email?: string;
  status: "CONFIRMED" | "DECLINED";
  plusOneCount?: number;
  dietaryPreference?: string;
  message?: string;
  guestId?: string;
  inviteToken?: string;
}

export interface RsvpSubmissionResult {
  rsvp: RSVP;
  guest: Omit<Guest, "qrToken"> & { qrToken?: string };
  eventSlug: string;
  qrToken?: string;
}

export async function submitPublicRsvp(
  slug: string,
  input: PublicRsvpInput
): Promise<RsvpSubmissionResult> {
  const event = store.getEventBySlug(slug);
  if (!event || event.status !== "PUBLISHED") {
    throw new Error("NOT_FOUND: Événement introuvable ou non publié pour ce lien");
  }

  const normalizedPhone = input.phone?.trim().replace(/\s+/g, "");
  const nameParts = input.fullName.trim().split(/\s+/);
  const firstName = (nameParts[0] || "Invité").slice(0, 80);
  const lastName = (nameParts.slice(1).join(" ") || "").slice(0, 80);

  // Find existing guest by ID or phone number
  let guest: Guest | null = null;
  let verifiedInviteMatch = false;

  if (input.guestId) {
    const candidate = store.getGuestById(input.guestId);
    // Strict multi-tenant isolation: guest must belong to the current event
    if (candidate && candidate.eventId === event.id) {
      guest = candidate;
      if (input.inviteToken && candidate.qrToken === input.inviteToken) {
        verifiedInviteMatch = true;
      }
    }
  }

  if (!guest && normalizedPhone) {
    const existingGuests = store.getGuestsByEvent(event.id);
    const matchedByPhone =
      existingGuests.find(
        (g) => g.phone && g.phone.replace(/\s+/g, "") === normalizedPhone
      ) || null;
    if (matchedByPhone) {
      guest = matchedByPhone;
      if (input.inviteToken && matchedByPhone.qrToken === input.inviteToken) {
        verifiedInviteMatch = true;
      }
    }
  }

  let isNewlyCreatedGuest = false;

  // If not found, create new guest entry
  if (!guest) {
    isNewlyCreatedGuest = true;
    guest = store.createGuest({
      eventId: event.id,
      firstName,
      lastName,
      phone: input.phone?.trim() || null,
      email: input.email?.trim() || null,
      group: "RSVP Public",
      isVip: false,
      plusOneAllowed: (input.plusOneCount || 0) > 0,
      plusOneCount: Math.min(5, Math.max(0, input.plusOneCount || 0)),
      rsvpStatus: input.status,
    });
  } else {
    // Respect organizer's plusOneAllowed constraint on pre-registered guests
    const allowedPlusOnes = guest.plusOneAllowed
      ? Math.min(5, Math.max(0, input.plusOneCount ?? guest.plusOneCount))
      : 0;

    store.updateGuest(guest.id, {
      rsvpStatus: input.status,
      plusOneCount: allowedPlusOnes,
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
    dietaryPreference: input.dietaryPreference?.trim().slice(0, 120) || null,
    message: input.message?.trim().slice(0, 500) || null,
  });

  // Security Defense (Prevents Ticket Hijacking via Phone Enumeration):
  // Only expose the raw `qrToken` in an unauthenticated public response if the guest record
  // was newly created during this public RSVP or if the caller proved possession of the invite token.
  const canExposeQrToken =
    input.status === "CONFIRMED" && (isNewlyCreatedGuest || verifiedInviteMatch);

  const { qrToken: rawQrToken, ...safeGuest } = guest;

  return {
    rsvp,
    guest: canExposeQrToken ? { ...safeGuest, qrToken: rawQrToken } : safeGuest,
    eventSlug: event.slug,
    qrToken: canExposeQrToken ? rawQrToken : undefined,
  };
}

export async function getRsvpsForEvent(
  eventId: string,
  userId: string
): Promise<RSVP[]> {
  await assertEventAccess(userId, eventId);
  return store.getRsvpsByEvent(eventId);
}
