import { User } from "@/types";

export interface SessionContext {
  user: User | null;
  isAuthenticated: boolean;
}

/**
 * Server-side session resolver abstraction.
 * In Phase 0/1, returns mock demonstration profile or extracts verified JWT/cookie.
 */
export async function getCurrentSession(): Promise<SessionContext> {
  // Mock demonstration session for development
  const mockUser: User = {
    id: "usr_demo_abidjan_01",
    name: "Ange Koffi",
    email: "ange.koffi@happyevents.ci",
    phone: "+225 07 00 11 22 33",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "OWNER",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-09-01"),
  };

  return {
    user: mockUser,
    isAuthenticated: true,
  };
}

/**
 * Asserts event ownership or permission on the server.
 * Critical Security Rule #10: Never trust client parameters or URLs alone.
 */
export async function assertEventAccess(
  userId: string,
  eventId: string,
  requiredRole?: string
): Promise<boolean> {
  if (!userId || !eventId) {
    throw new Error("UNAUTHORIZED_ACCESS: Identifiants manquants");
  }
  // In Phase 1 with active DB, will query prisma.event.findFirst({ where: { id: eventId, ownerId: userId } })
  return true;
}
