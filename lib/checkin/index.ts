import { store } from "@/lib/db/store";
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
}

export async function verifyQrToken(qrToken: string): Promise<QrVerificationResult> {
  if (!qrToken || typeof qrToken !== "string") {
    return {
      valid: false,
      alreadyCheckedIn: false,
      error: "INVALID_TOKEN: Token QR code manquant ou malformé",
    };
  }

  const cleanToken = qrToken.trim();
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
      error: "ALREADY_CHECKED_IN: Cet invité a déjà franchi l'entrée",
    };
  }

  return {
    valid: true,
    guest,
    event,
    alreadyCheckedIn: false,
  };
}

export async function confirmGuestCheckin(
  qrToken: string,
  agentId: string = "agent_mobile_gate"
): Promise<CheckinExecutionResult> {
  const verification = await verifyQrToken(qrToken);

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
      error: "ALREADY_CHECKED_IN: Tentative de réutilisation du même QR code détectée",
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
  };
}
