import fs from "fs";
import path from "path";
import {
  Event,
  Guest,
  RSVP,
  Invitation,
  Checkin,
  EventStats,
  User,
  EventStatus,
  RsvpStatus,
} from "@/types";
import {
  syncUserToPostgres,
  syncEventToPostgres,
  deleteEventFromPostgres,
  syncGuestToPostgres,
  deleteGuestFromPostgres,
  syncRsvpToPostgres,
  syncInvitationToPostgres,
  syncCheckinToPostgres,
} from "./sync";

interface DataStoreSchema {
  users: User[];
  events: Event[];
  guests: Guest[];
  rsvps: RSVP[];
  invitations: Invitation[];
  checkins: Checkin[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

// Default initial state
const INITIAL_USER: User = {
  id: "usr_demo_abidjan_01",
  name: "Ange Koffi",
  email: "ange.koffi@happyevents.ci",
  phone: "+225 07 00 11 22 33",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  role: "ADMIN",
  createdAt: new Date("2026-01-15T10:00:00.000Z"),
  updatedAt: new Date("2026-09-01T12:00:00.000Z"),
};

const INITIAL_EVENTS: Event[] = [
  {
    id: "evt_30ans_ange",
    ownerId: "usr_demo_abidjan_01",
    name: "Anniversaire d'Ange — 30 Ans",
    type: "BIRTHDAY",
    description:
      "Trente ans, c'est une étape inoubliable ! J'ai l'immense joie de vous convier pour une soirée festive d'exception au Sofitel Hôtel Ivoire.",
    date: new Date("2026-09-26T19:30:00.000Z"),
    startTime: "19:30",
    endTime: "04:00",
    timezone: "Africa/Abidjan",
    venue: "Sofitel Abidjan Hôtel Ivoire — Salle Chandelier",
    address: "Boulevard Hassan II, Cocody, Abidjan, Côte d'Ivoire",
    latitude: 5.3283,
    longitude: -4.0083,
    coverImage: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&auto=format&fit=crop&q=80",
    theme: "Or & Blanc Impérial",
    slug: "ange-anniversaire-30",
    status: "PUBLISHED",
    createdAt: new Date("2026-08-01T08:00:00.000Z"),
    updatedAt: new Date("2026-09-10T14:30:00.000Z"),
  },
  {
    id: "evt_mariage_marc_aminata",
    ownerId: "usr_demo_abidjan_01",
    name: "Mariage de Marc & Aminata",
    type: "WEDDING",
    description: "Célébration solennelle et réception nuptiale sous les étoiles.",
    date: new Date("2026-10-17T15:00:00.000Z"),
    startTime: "15:00",
    endTime: "02:00",
    timezone: "Africa/Abidjan",
    venue: "Cathédrale Saint-Paul & Espace Crystal, Abidjan",
    address: "Plateau & Zone 4, Abidjan",
    latitude: 5.334,
    longitude: -4.018,
    coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80",
    theme: "Classic Gold & Ivory",
    slug: "mariage-marc-et-aminata",
    status: "PUBLISHED",
    createdAt: new Date("2026-08-15T09:00:00.000Z"),
    updatedAt: new Date("2026-09-20T11:00:00.000Z"),
  },
  {
    id: "evt_dot_koffi_estelle",
    ownerId: "usr_demo_abidjan_01",
    name: "Dot Coutumière de Koffi & Estelle",
    type: "DOT",
    description: "Union coutumière et festivités traditionnelles familiales.",
    date: new Date("2026-11-07T11:00:00.000Z"),
    startTime: "11:00",
    endTime: "20:00",
    timezone: "Africa/Abidjan",
    venue: "Résidence Familiale Baoulé, Yamoussoukro",
    address: "Quartier Millionnaire, Yamoussoukro",
    latitude: 6.827,
    longitude: -5.289,
    coverImage: "https://images.unsplash.com/photo-1544077960-604201fe74bc?w=1200&auto=format&fit=crop&q=80",
    theme: "Wax Royal & Kente",
    slug: "dot-koffi-estelle-2026",
    status: "DRAFT",
    createdAt: new Date("2026-09-01T10:00:00.000Z"),
    updatedAt: new Date("2026-09-18T16:00:00.000Z"),
  },
];

const INITIAL_GUESTS: Guest[] = [
  {
    id: "gst_01",
    eventId: "evt_30ans_ange",
    firstName: "Marc-Antoine",
    lastName: "Konan",
    phone: "+225 07 48 19 20 11",
    email: "ma.konan@example.ci",
    group: "Famille proche",
    isVip: true,
    plusOneAllowed: true,
    plusOneCount: 1,
    rsvpStatus: "CONFIRMED",
    qrToken: "tok_ange_konan_01",
    checkedIn: true,
    createdAt: new Date("2026-08-05T10:00:00.000Z"),
    updatedAt: new Date("2026-09-26T20:15:00.000Z"),
  },
  {
    id: "gst_02",
    eventId: "evt_30ans_ange",
    firstName: "Aïcha",
    lastName: "Traoré",
    phone: "+225 05 12 34 56 78",
    email: "aicha.traore@example.com",
    group: "Amis d'enfance",
    isVip: false,
    plusOneAllowed: false,
    plusOneCount: 0,
    rsvpStatus: "CONFIRMED",
    qrToken: "tok_ange_traore_02",
    checkedIn: true,
    createdAt: new Date("2026-08-05T11:00:00.000Z"),
    updatedAt: new Date("2026-09-26T20:45:00.000Z"),
  },
  {
    id: "gst_03",
    eventId: "evt_30ans_ange",
    firstName: "Dr. Jean-Yves",
    lastName: "Touré",
    phone: "+225 01 98 76 54 32",
    email: "dr.toure@clinic.ci",
    group: "Collègues",
    isVip: true,
    plusOneAllowed: true,
    plusOneCount: 1,
    rsvpStatus: "CONFIRMED",
    qrToken: "tok_ange_toure_03",
    checkedIn: false,
    createdAt: new Date("2026-08-06T09:30:00.000Z"),
    updatedAt: new Date("2026-09-20T15:00:00.000Z"),
  },
  {
    id: "gst_04",
    eventId: "evt_30ans_ange",
    firstName: "Carine",
    lastName: "Kouamé",
    phone: "+225 07 65 43 21 00",
    email: "carine.k@example.com",
    group: "Amis",
    isVip: false,
    plusOneAllowed: false,
    plusOneCount: 0,
    rsvpStatus: "PENDING",
    qrToken: "tok_ange_kouame_04",
    checkedIn: false,
    createdAt: new Date("2026-08-07T14:00:00.000Z"),
    updatedAt: new Date("2026-08-07T14:00:00.000Z"),
  },
  {
    id: "gst_05",
    eventId: "evt_30ans_ange",
    firstName: "Ibrahim",
    lastName: "Diallo",
    phone: "+225 07 11 22 33 44",
    email: "ibrahim.diallo@example.com",
    group: "Collègues",
    isVip: false,
    plusOneAllowed: false,
    plusOneCount: 0,
    rsvpStatus: "DECLINED",
    qrToken: "tok_ange_diallo_05",
    checkedIn: false,
    createdAt: new Date("2026-08-08T16:00:00.000Z"),
    updatedAt: new Date("2026-09-12T11:00:00.000Z"),
  },
  {
    id: "gst_06",
    eventId: "evt_30ans_ange",
    firstName: "Sarah",
    lastName: "Bamba",
    phone: "+225 05 99 88 77 66",
    email: "sarah.b@example.ci",
    group: "Famille proche",
    isVip: true,
    plusOneAllowed: true,
    plusOneCount: 1,
    rsvpStatus: "CONFIRMED",
    qrToken: "tok_ange_bamba_06",
    checkedIn: false,
    createdAt: new Date("2026-08-10T12:00:00.000Z"),
    updatedAt: new Date("2026-09-22T10:00:00.000Z"),
  },
];

const INITIAL_RSVPS: RSVP[] = [
  {
    id: "rsvp_01",
    eventId: "evt_30ans_ange",
    guestId: "gst_01",
    status: "CONFIRMED",
    attendeeCount: 2,
    dietaryPreference: "Sans fruits de mer",
    message: "Joyeux 30 ans mon frère ! On sera présents avec Estelle.",
    respondedAt: new Date("2026-08-10T18:00:00.000Z"),
  },
  {
    id: "rsvp_02",
    eventId: "evt_30ans_ange",
    guestId: "gst_02",
    status: "CONFIRMED",
    attendeeCount: 1,
    dietaryPreference: null,
    message: "Hâte de fêter ça ensemble !",
    respondedAt: new Date("2026-08-12T09:30:00.000Z"),
  },
  {
    id: "rsvp_03",
    eventId: "evt_30ans_ange",
    guestId: "gst_03",
    status: "CONFIRMED",
    attendeeCount: 2,
    dietaryPreference: "Végétarien pour Mme Touré",
    message: "Toutes nos félicitations Ange.",
    respondedAt: new Date("2026-09-20T15:00:00.000Z"),
  },
  {
    id: "rsvp_05",
    eventId: "evt_30ans_ange",
    guestId: "gst_05",
    status: "DECLINED",
    attendeeCount: 0,
    dietaryPreference: null,
    message: "Vraiment désolé, je serai en déplacement professionnel à Dakar à cette date.",
    respondedAt: new Date("2026-09-12T11:00:00.000Z"),
  },
];

const INITIAL_CHECKINS: Checkin[] = [
  {
    id: "chk_01",
    eventId: "evt_30ans_ange",
    guestId: "gst_01",
    checkedInAt: new Date("2026-09-26T20:15:00.000Z"),
    checkedInBy: "agent_reception_01",
  },
  {
    id: "chk_02",
    eventId: "evt_30ans_ange",
    guestId: "gst_02",
    checkedInAt: new Date("2026-09-26T20:45:00.000Z"),
    checkedInBy: "agent_reception_01",
  },
];

const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: "inv_01",
    eventId: "evt_30ans_ange",
    templateId: "midnight-sparkle",
    title: "Anniversaire d'Ange — 30 Ans",
    content: "Nous avons l'immense joie de vous convier à célébrer ce grand cap dans une ambiance festive et chaleureuse !",
    themeConfig: {
      accentColor: "#F59E0B",
      fontDisplay: "Outfit",
    },
    published: true,
    publishedAt: new Date("2026-08-01T08:00:00.000Z"),
    createdAt: new Date("2026-08-01T08:00:00.000Z"),
    updatedAt: new Date("2026-08-01T08:00:00.000Z"),
  },
  {
    id: "inv_02",
    eventId: "evt_mariage_marc_aminata",
    templateId: "classic-gold",
    title: "Mariage de Marc & Aminata",
    content: "Deux cœurs s'unissent pour l'éternité sous la bénédiction divine.",
    themeConfig: {
      accentColor: "#E05A47",
      fontDisplay: "Outfit",
    },
    published: true,
    publishedAt: new Date("2026-08-15T09:00:00.000Z"),
    createdAt: new Date("2026-08-15T09:00:00.000Z"),
    updatedAt: new Date("2026-08-15T09:00:00.000Z"),
  },
];

class MemoryStore {
  private data: DataStoreSchema;

  constructor() {
    this.data = this.loadFromFile();
  }

  private loadFromFile(): DataStoreSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        // Revive Dates
        const reviveDate = (d: any) => (d ? new Date(d) : d);
        return {
          users: parsed.users.map((u: any) => ({
            ...u,
            createdAt: reviveDate(u.createdAt),
            updatedAt: reviveDate(u.updatedAt),
          })),
          events: parsed.events.map((e: any) => ({
            ...e,
            date: reviveDate(e.date),
            createdAt: reviveDate(e.createdAt),
            updatedAt: reviveDate(e.updatedAt),
          })),
          guests: parsed.guests.map((g: any) => ({
            ...g,
            createdAt: reviveDate(g.createdAt),
            updatedAt: reviveDate(g.updatedAt),
          })),
          rsvps: parsed.rsvps.map((r: any) => ({
            ...r,
            respondedAt: reviveDate(r.respondedAt),
          })),
          invitations: parsed.invitations.map((i: any) => ({
            ...i,
            publishedAt: reviveDate(i.publishedAt),
            createdAt: reviveDate(i.createdAt),
            updatedAt: reviveDate(i.updatedAt),
          })),
          checkins: parsed.checkins.map((c: any) => ({
            ...c,
            checkedInAt: reviveDate(c.checkedInAt),
          })),
        };
      }
    } catch {
      // Fallback on error
    }

    const defaultState: DataStoreSchema = {
      users: [INITIAL_USER],
      events: INITIAL_EVENTS,
      guests: INITIAL_GUESTS,
      rsvps: INITIAL_RSVPS,
      invitations: INITIAL_INVITATIONS,
      checkins: INITIAL_CHECKINS,
    };

    this.saveToFile(defaultState);
    return defaultState;
  }

  private saveToFile(state: DataStoreSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
    } catch {
      // Ignore write errors in read-only environments
    }
  }

  private persist() {
    this.saveToFile(this.data);
  }

  // --- Users ---
  getAllUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | null {
    return this.data.users.find((u) => u.id === id) || null;
  }

  getUserByEmail(email: string): User | null {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    return this.data.users.find((u) => u.email && u.email.toLowerCase() === clean) || null;
  }

  getUserByPhone(phone: string): User | null {
    if (!phone) return null;
    const clean = phone.trim().replace(/[^0-9]/g, "");
    return this.data.users.find((u) => u.phone && u.phone.replace(/[^0-9]/g, "") === clean) || null;
  }

  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const id = "usr_" + Math.random().toString(36).substring(2, 9);
    const newUser: User = {
      ...user,
      id,
      passwordHash: user.passwordHash || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.data.users.push(newUser);
    this.persist();
    syncUserToPostgres(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date(),
    };
    this.persist();
    syncUserToPostgres(this.data.users[idx]);
    return this.data.users[idx];
  }

  // --- Events ---
  getEventsByOwner(ownerId: string): Event[] {
    return this.data.events
      .filter((e) => e.ownerId === ownerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getEventById(id: string): Event | null {
    return this.data.events.find((e) => e.id === id) || null;
  }

  getEventBySlug(slug: string): Event | null {
    return this.data.events.find((e) => e.slug === slug) || null;
  }

  createEvent(event: Omit<Event, "id" | "createdAt" | "updatedAt">): Event {
    const id = "evt_" + Math.random().toString(36).substring(2, 9);
    const newEvent: Event = {
      ...event,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.data.events.unshift(newEvent);
    this.persist();
    syncEventToPostgres(newEvent);
    return newEvent;
  }

  updateEvent(id: string, updates: Partial<Event>): Event | null {
    const index = this.data.events.findIndex((e) => e.id === id);
    if (index === -1) return null;
    this.data.events[index] = {
      ...this.data.events[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.persist();
    syncEventToPostgres(this.data.events[index]);
    return this.data.events[index];
  }

  deleteEvent(id: string): boolean {
    const initialLen = this.data.events.length;
    this.data.events = this.data.events.filter((e) => e.id !== id);
    this.data.guests = this.data.guests.filter((g) => g.eventId !== id);
    this.data.rsvps = this.data.rsvps.filter((r) => r.eventId !== id);
    this.data.checkins = this.data.checkins.filter((c) => c.eventId !== id);
    this.persist();
    deleteEventFromPostgres(id);
    return this.data.events.length < initialLen;
  }

  // --- Guests ---
  getGuestsByEvent(eventId: string): Guest[] {
    return this.data.guests.filter((g) => g.eventId === eventId);
  }

  getGuestById(id: string): Guest | null {
    return this.data.guests.find((g) => g.id === id) || null;
  }

  getGuestByQrToken(qrToken: string): Guest | null {
    return this.data.guests.find((g) => g.qrToken === qrToken) || null;
  }

  createGuest(guest: Omit<Guest, "id" | "qrToken" | "checkedIn" | "createdAt" | "updatedAt">): Guest {
    const id = "gst_" + Math.random().toString(36).substring(2, 9);
    const qrToken = "tok_" + Math.random().toString(36).substring(2, 12);
    const newGuest: Guest = {
      ...guest,
      id,
      qrToken,
      checkedIn: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.data.guests.unshift(newGuest);
    this.persist();
    syncGuestToPostgres(newGuest);
    return newGuest;
  }

  batchCreateGuests(
    eventId: string,
    rawList: Array<Omit<Guest, "id" | "eventId" | "qrToken" | "checkedIn" | "createdAt" | "updatedAt">>
  ): Guest[] {
    const created: Guest[] = [];
    for (const item of rawList) {
      const id = "gst_" + Math.random().toString(36).substring(2, 9);
      const qrToken = "tok_" + Math.random().toString(36).substring(2, 12);
      const newGuest: Guest = {
        ...item,
        id,
        eventId,
        qrToken,
        checkedIn: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.data.guests.unshift(newGuest);
      created.push(newGuest);
    }
    this.persist();
    for (const g of created) {
      syncGuestToPostgres(g);
    }
    return created;
  }

  updateGuest(id: string, updates: Partial<Guest>): Guest | null {
    const index = this.data.guests.findIndex((g) => g.id === id);
    if (index === -1) return null;
    this.data.guests[index] = {
      ...this.data.guests[index],
      ...updates,
      updatedAt: new Date(),
    };
    this.persist();
    syncGuestToPostgres(this.data.guests[index]);
    return this.data.guests[index];
  }

  deleteGuest(id: string): boolean {
    const initialLen = this.data.guests.length;
    this.data.guests = this.data.guests.filter((g) => g.id !== id);
    this.data.rsvps = this.data.rsvps.filter((r) => r.guestId !== id);
    this.data.checkins = this.data.checkins.filter((c) => c.guestId !== id);
    this.persist();
    deleteGuestFromPostgres(id);
    return this.data.guests.length < initialLen;
  }

  // --- RSVP ---
  getRsvpsByEvent(eventId: string): RSVP[] {
    return this.data.rsvps.filter((r) => r.eventId === eventId);
  }

  recordRsvp(rsvp: Omit<RSVP, "id" | "respondedAt">): RSVP {
    const existingIndex = this.data.rsvps.findIndex(
      (r) => r.eventId === rsvp.eventId && r.guestId === rsvp.guestId
    );

    let recordedRsvp: RSVP;
    if (existingIndex !== -1) {
      this.data.rsvps[existingIndex] = {
        ...this.data.rsvps[existingIndex],
        ...rsvp,
        respondedAt: new Date(),
      };
      recordedRsvp = this.data.rsvps[existingIndex];
    } else {
      const id = "rsvp_" + Math.random().toString(36).substring(2, 9);
      recordedRsvp = {
        ...rsvp,
        id,
        respondedAt: new Date(),
      };
      this.data.rsvps.unshift(recordedRsvp);
    }

    // Update guest RSVP status
    const guest = this.data.guests.find((g) => g.id === rsvp.guestId);
    if (guest) {
      guest.rsvpStatus = rsvp.status;
      guest.updatedAt = new Date();
    }

    this.persist();
    syncRsvpToPostgres(recordedRsvp);
    if (guest) syncGuestToPostgres(guest);
    return recordedRsvp;
  }

  // --- Check-in ---
  getCheckinsByEvent(eventId: string): Checkin[] {
    return this.data.checkins.filter((c) => c.eventId === eventId);
  }

  performCheckin(eventId: string, guestId: string, checkedInBy: string): { success: boolean; checkin?: Checkin; error?: string } {
    const guest = this.data.guests.find((g) => g.id === guestId && g.eventId === eventId);
    if (!guest) {
      return { success: false, error: "GUEST_NOT_FOUND" };
    }

    if (guest.checkedIn) {
      const existingCheckin = this.data.checkins.find((c) => c.guestId === guestId);
      return {
        success: false,
        error: "ALREADY_CHECKED_IN",
        checkin: existingCheckin,
      };
    }

    guest.checkedIn = true;
    guest.updatedAt = new Date();

    const id = "chk_" + Math.random().toString(36).substring(2, 9);
    const newCheckin: Checkin = {
      id,
      eventId,
      guestId,
      checkedInAt: new Date(),
      checkedInBy,
    };
    this.data.checkins.unshift(newCheckin);
    this.persist();
    syncCheckinToPostgres(newCheckin);
    syncGuestToPostgres(guest);

    return { success: true, checkin: newCheckin };
  }

  // --- Invitations ---
  getInvitationByEventId(eventId: string): Invitation | null {
    return this.data.invitations.find((i) => i.eventId === eventId) || null;
  }

  upsertInvitation(inv: {
    eventId: string;
    templateId?: string;
    title: string;
    content: string;
    themeConfig?: Record<string, unknown> | null;
    published?: boolean;
  }): Invitation {
    const idx = this.data.invitations.findIndex((i) => i.eventId === inv.eventId);
    if (idx !== -1) {
      this.data.invitations[idx] = {
        ...this.data.invitations[idx],
        ...inv,
        templateId: inv.templateId || this.data.invitations[idx].templateId,
        updatedAt: new Date(),
      };
      this.persist();
      syncInvitationToPostgres(this.data.invitations[idx]);
      return this.data.invitations[idx];
    } else {
      const newInv: Invitation = {
        id: "inv_" + Math.random().toString(36).substring(2, 9),
        eventId: inv.eventId,
        templateId: inv.templateId || "classic-gold",
        title: inv.title,
        content: inv.content,
        themeConfig: inv.themeConfig || null,
        published: inv.published ?? true,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.data.invitations.unshift(newInv);
      this.persist();
      syncInvitationToPostgres(newInv);
      return newInv;
    }
  }

  // --- Statistics ---
  getEventStats(eventId: string): EventStats {
    const guests = this.getGuestsByEvent(eventId);
    const totalGuests = guests.length;
    const confirmedGuests = guests.filter((g) => g.rsvpStatus === "CONFIRMED").length;
    const pendingGuests = guests.filter((g) => g.rsvpStatus === "PENDING").length;
    const declinedGuests = guests.filter((g) => g.rsvpStatus === "DECLINED").length;

    const rsvps = this.getRsvpsByEvent(eventId);
    const confirmedRsvps = rsvps.filter((r) => r.status === "CONFIRMED");
    const totalAttendees = confirmedRsvps.reduce(
      (acc, r) => acc + (r.attendeeCount || 1),
      0
    );

    const checkedInCount = guests.filter((g) => g.checkedIn).length;
    const responseRate = totalGuests > 0 ? Math.round(((totalGuests - pendingGuests) / totalGuests) * 100) : 0;
    const checkinRate = confirmedGuests > 0 ? Math.round((checkedInCount / confirmedGuests) * 100) : 0;

    return {
      totalGuests,
      confirmedGuests,
      pendingGuests,
      declinedGuests,
      totalAttendees,
      checkedInCount,
      responseRate,
      checkinRate,
    };
  }

  // --- Platform-wide Admin Oversight ---
  getAllEvents(): Event[] {
    return [...this.data.events].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getAllGuests(): Guest[] {
    return [...this.data.guests];
  }

  getAllCheckins(): Checkin[] {
    return [...this.data.checkins].sort(
      (a, b) => new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime()
    );
  }

  getAllRsvps(): RSVP[] {
    return [...this.data.rsvps];
  }

  deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    // Delete user's events and related data
    const userEvents = this.data.events.filter((e) => e.ownerId === id);
    for (const e of userEvents) {
      this.deleteEvent(e.id);
    }
    this.persist();
    return this.data.users.length < initialLen;
  }

  getGlobalPlatformStats() {
    const users = this.getAllUsers();
    const events = this.getAllEvents();
    const guests = this.getAllGuests();
    const checkins = this.getAllCheckins();
    const rsvps = this.getAllRsvps();

    const totalUsers = users.length;
    const totalEvents = events.length;
    const publishedEvents = events.filter((e) => e.status === "PUBLISHED").length;
    const draftEvents = events.filter((e) => e.status === "DRAFT").length;
    const completedEvents = events.filter((e) => e.status === "COMPLETED").length;

    const totalGuests = guests.length;
    const confirmedGuests = guests.filter((g) => g.rsvpStatus === "CONFIRMED").length;
    const pendingGuests = guests.filter((g) => g.rsvpStatus === "PENDING").length;
    const vipGuests = guests.filter((g) => g.isVip).length;

    const totalCheckins = checkins.length;
    const globalCheckinRate = confirmedGuests > 0 ? Math.round((totalCheckins / confirmedGuests) * 100) : 0;

    // Simulated business revenue volume (FCFA)
    const estimatedVolumeFcfa = publishedEvents * 15000 + completedEvents * 35000;

    // Breakdown by event type
    const eventsByType = {
      WEDDING: events.filter((e) => e.type === "WEDDING").length,
      BIRTHDAY: events.filter((e) => e.type === "BIRTHDAY").length,
      DOT: events.filter((e) => e.type === "DOT").length,
      CORPORATE: events.filter((e) => e.type === "CORPORATE").length,
      OTHER: events.filter((e) => !["WEDDING", "BIRTHDAY", "DOT", "CORPORATE"].includes(e.type)).length,
    };

    // Global unified audit & activity stream
    const userActivities = users.map((u) => ({
      id: "act_usr_" + u.id,
      type: "USER_SIGNUP" as const,
      title: "Nouvel organisateur inscrit",
      description: `${u.name || "Organisateur"} (${u.email})`,
      timestamp: u.createdAt,
      avatar: u.avatar,
      badge: u.role,
    }));

    const eventActivities = events.map((e) => ({
      id: "act_evt_" + e.id,
      type: "EVENT_CREATED" as const,
      title: "Événement créé",
      description: `${e.name} — ${e.venue || "Lieu à confirmer"}`,
      timestamp: e.createdAt,
      badge: e.status,
    }));

    const checkinActivities = checkins.map((c) => {
      const g = guests.find((guest) => guest.id === c.guestId);
      const e = events.find((evt) => evt.id === c.eventId);
      return {
        id: "act_chk_" + c.id,
        type: "CHECKIN_SUCCESS" as const,
        title: "Check-in QR code scanné",
        description: `${g ? `${g.firstName} ${g.lastName}` : "Invité"} sur « ${e?.name || "Événement"} »`,
        timestamp: c.checkedInAt,
        badge: "VÉRIFIÉ",
      };
    });

    const recentActivity = [...userActivities, ...eventActivities, ...checkinActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15);

    return {
      totalUsers,
      totalEvents,
      publishedEvents,
      draftEvents,
      completedEvents,
      totalGuests,
      confirmedGuests,
      pendingGuests,
      vipGuests,
      totalCheckins,
      globalCheckinRate,
      estimatedVolumeFcfa,
      eventsByType,
      recentActivity,
    };
  }
}

// Global singleton
declare global {
  // eslint-disable-next-line no-var
  var __memoryStore: MemoryStore | undefined;
}

export const store = globalThis.__memoryStore ?? new MemoryStore();
if (process.env.NODE_ENV !== "production") {
  globalThis.__memoryStore = store;
}
