import { store } from "@/lib/db/store";
import { assertEventAccess } from "@/lib/auth/session";
import { Event, EventStatus, EventType, EventStats } from "@/types";
import { syncEventToPostgres, deleteEventFromPostgres } from "@/lib/db/sync";

export interface CreateEventInput {
  name: string;
  type: EventType;
  description?: string;
  date: string | Date;
  startTime?: string;
  endTime?: string;
  venue?: string;
  address?: string;
  theme?: string;
  coverImage?: string;
  slug?: string;
  status?: EventStatus;
}

export interface UpdateEventInput {
  name?: string;
  type?: EventType;
  description?: string;
  date?: string | Date;
  startTime?: string;
  endTime?: string;
  venue?: string;
  address?: string;
  theme?: string;
  coverImage?: string;
  slug?: string;
  status?: EventStatus;
}

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const rand = Math.random().toString(36).substring(2, 6);
  return `${base || "event"}-${rand}`;
}

export async function getUserEvents(userId: string): Promise<Event[]> {
  if (!userId) throw new Error("UNAUTHORIZED: Utilisateur non authentifié");
  return store.getEventsByOwner(userId);
}

export async function getEventForUser(eventId: string, userId: string): Promise<Event> {
  await assertEventAccess(userId, eventId);
  const event = store.getEventById(eventId);
  if (!event || event.ownerId !== userId) {
    throw new Error("NOT_FOUND: Événement introuvable ou accès refusé");
  }
  return event;
}

export async function getPublicEvent(slug: string): Promise<Event | null> {
  if (!slug) return null;
  return store.getEventBySlug(slug);
}

export async function createNewEvent(
  userId: string,
  input: CreateEventInput
): Promise<Event> {
  if (!userId) throw new Error("UNAUTHORIZED: Identifiant requis pour créer un événement");
  if (!input.name || !input.date) {
    throw new Error("VALIDATION_ERROR: Le nom et la date sont obligatoires");
  }

  const slug = input.slug?.trim() || generateSlug(input.name);

  // Check unique slug
  const existingWithSlug = store.getEventBySlug(slug);
  const finalSlug = existingWithSlug ? generateSlug(input.name) : slug;

  const newEvt = store.createEvent({
    ownerId: userId,
    name: input.name,
    type: input.type || "OTHER",
    description: input.description || null,
    date: new Date(input.date),
    startTime: input.startTime || null,
    endTime: input.endTime || null,
    timezone: "Africa/Abidjan",
    venue: input.venue || null,
    address: input.address || null,
    latitude: null,
    longitude: null,
    coverImage: input.coverImage || null,
    theme: input.theme || null,
    slug: finalSlug,
    status: input.status || "DRAFT",
  });
  await syncEventToPostgres(newEvt);
  return newEvt;
}

export async function updateExistingEvent(
  eventId: string,
  userId: string,
  input: UpdateEventInput
): Promise<Event> {
  await assertEventAccess(userId, eventId);

  const existing = store.getEventById(eventId);
  if (!existing || existing.ownerId !== userId) {
    throw new Error("NOT_FOUND: Événement introuvable ou vous n'en êtes pas le propriétaire");
  }

  const updates: Partial<Event> = {};
  if (input.name !== undefined) updates.name = input.name;
  if (input.type !== undefined) updates.type = input.type;
  if (input.description !== undefined) updates.description = input.description;
  if (input.date !== undefined) updates.date = new Date(input.date);
  if (input.startTime !== undefined) updates.startTime = input.startTime;
  if (input.endTime !== undefined) updates.endTime = input.endTime;
  if (input.venue !== undefined) updates.venue = input.venue;
  if (input.address !== undefined) updates.address = input.address;
  if (input.theme !== undefined) updates.theme = input.theme;
  if (input.coverImage !== undefined) updates.coverImage = input.coverImage;
  if (input.status !== undefined) updates.status = input.status;

  const updated = store.updateEvent(eventId, updates);
  if (!updated) {
    throw new Error("UPDATE_FAILED: Échec de mise à jour de l'événement");
  }

  await syncEventToPostgres(updated);
  return updated;
}

export async function deleteExistingEvent(
  eventId: string,
  userId: string
): Promise<boolean> {
  await assertEventAccess(userId, eventId);

  const existing = store.getEventById(eventId);
  if (!existing || existing.ownerId !== userId) {
    throw new Error("NOT_FOUND: Événement introuvable ou vous n'en êtes pas le propriétaire");
  }

  const ok = store.deleteEvent(eventId);
  if (ok) {
    await deleteEventFromPostgres(eventId);
  }
  return ok;
}

export async function getEventStatsForUser(
  eventId: string,
  userId: string
): Promise<EventStats> {
  await assertEventAccess(userId, eventId);
  return store.getEventStats(eventId);
}
