import crypto from "crypto";
import { User } from "@/types";

const SCRYPT_KEYLEN = 64;
const DEFAULT_AUTH_SECRET = "happy-events-secure-vault-key-ci-2026-very-secret-phrase";

/**
 * Returns the secret key for signing session tokens.
 * Priority: NEXTAUTH_SECRET -> fallback string.
 */
function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    if ((process.env.NODE_ENV as string) === "production") {
      throw new Error("SECURITY_ERROR: Variable d'environnement NEXTAUTH_SECRET obligatoire en production");
    }
    return DEFAULT_AUTH_SECRET;
  }
  return secret;
}

/**
 * Cryptographically hashes a plain password using Node.js scrypt with a unique random 16-byte salt.
 * Output format: `salt:hexHash`
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== "string") {
    throw new Error("Mot de passe invalide pour le hachage");
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password.normalize("NFKC"), salt, SCRYPT_KEYLEN);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verifies a plain password against a stored `salt:hexHash` string using constant-time comparison.
 * Immune to timing attacks.
 */
export function verifyPassword(password: string, combinedHash?: string | null): boolean {
  if (!password || !combinedHash) return false;
  try {
    const parts = combinedHash.split(":");
    if (parts.length !== 2) return false;
    const [salt, hashHex] = parts;
    const keyBuffer = Buffer.from(hashHex, "hex");
    const derivedKey = crypto.scryptSync(password.normalize("NFKC"), salt, keyBuffer.length);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch {
    return false;
  }
}

/**
 * Creates a cryptographically signed session token: `userId:expiresAt:hmacSignature`.
 * Expires after 30 days.
 */
export function signSessionToken(userId: string): string {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
  const payload = `${userId}:${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", getAuthSecret())
    .update(payload)
    .digest("hex");
  return `${payload}:${signature}`;
}

/**
 * Verifies and decodes a signed session token.
 * Returns the `userId` if signature is valid and not expired, or `null` otherwise.
 */
export function verifySessionToken(token?: string | null): string | null {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(":");
    if (parts.length !== 3) return null;
    const [userId, expiresAtStr, signature] = parts;
    const expiresAt = Number(expiresAtStr);
    if (!userId || isNaN(expiresAt)) return null;

    // Check expiration
    if (Date.now() > expiresAt) return null;

    // Check HMAC signature
    const payload = `${userId}:${expiresAtStr}`;
    const expectedSignature = crypto
      .createHmac("sha256", getAuthSecret())
      .update(payload)
      .digest("hex");

    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    return userId;
  } catch {
    return null;
  }
}

/**
 * Strips sensitive fields (such as passwordHash) before sending user objects to clients.
 */
export function sanitizeUser<T extends { passwordHash?: string | null }>(
  user: T | null
): Omit<T, "passwordHash"> | null {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
