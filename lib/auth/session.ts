import { cookies } from "next/headers";
import { store } from "@/lib/db/store";
import { User } from "@/types";
import { verifySessionToken, sanitizeUser } from "./security";

export interface SessionContext {
  user: User | null;
  isAuthenticated: boolean;
}

export const SESSION_COOKIE_NAME = "happy_session_user";

/**
 * Server-side session resolver abstraction.
 * Resolves session strictly from cryptographically signed HTTP-only cookie.
 * Never auto-logs into another user's account.
 */
export async function getCurrentSession(): Promise<SessionContext> {
  let token: string | null = null;
  try {
    const cookieStore = cookies();
    token = cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
  } catch {
    // Outside request context (e.g. static generation)
  }

  if (token) {
    const userId = verifySessionToken(token);
    if (userId) {
      const user = store.getUserById(userId);
      if (user) {
        return {
          user: sanitizeUser(user) as User,
          isAuthenticated: true,
        };
      }
    }
  }

  return {
    user: null,
    isAuthenticated: false,
  };
}

/**
 * Asserts event ownership or permission on the server.
 * Critical Security Rule #10: Never trust client parameters or URLs alone.
 * Prevents Insecure Direct Object References (IDOR).
 */
export async function assertEventAccess(
  userId: string,
  eventId: string,
  requiredRole?: string
): Promise<boolean> {
  if (!userId || !eventId) {
    throw new Error("UNAUTHORIZED_ACCESS: Identifiants manquants");
  }

  const event = store.getEventById(eventId);
  if (!event) {
    throw new Error("NOT_FOUND: Événement introuvable");
  }

  if (event.ownerId !== userId) {
    throw new Error("FORBIDDEN: Vous n'avez pas l'autorisation d'accéder à cet événement");
  }

  return true;
}

/**
 * Checks whether a given user has Administrator privileges.
 */
export function isAdminUser(user: User | null): boolean {
  if (!user) return false;
  return user.role === "ADMIN";
}

/**
 * Server-side guard to strictly enforce Administrator access.
 */
export async function assertAdminAccess(): Promise<User> {
  const session = await getCurrentSession();
  if (!session.isAuthenticated || !session.user) {
    throw new Error("UNAUTHORIZED: Session requise");
  }

  if (!isAdminUser(session.user)) {
    throw new Error("FORBIDDEN: Accès réservé aux administrateurs de la plateforme");
  }

  return session.user;
}

