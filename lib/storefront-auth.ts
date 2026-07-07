import "server-only";
import { cookies } from "next/headers";
import { pbkdf2Sync, randomBytes, timingSafeEqual, createHash } from "node:crypto";
import { query } from "@/lib/db";

const SESSION_COOKIE = "nyit_session";
const SESSION_DAYS = 30;
const PASSWORD_ITERATIONS = 120_000;

export type StorefrontUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  role: "customer" | "admin";
};

type UserRow = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  address: string | null;
  role: "customer" | "admin";
  password_hash?: string;
};

export function normalizeIdentifier(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

export function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function toPublicUser(row: UserRow): StorefrontUser {
  return {
    id: String(row.id),
    name: row.name,
    username: row.username,
    email: row.email,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    role: row.role,
  };
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, 32, "sha256").toString("hex");
  return `pbkdf2_sha256$${PASSWORD_ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, iterationsText, salt, expectedHash] = storedHash.split("$");
  if (algorithm !== "pbkdf2_sha256" || !iterationsText || !salt || !expectedHash) return false;
  const iterations = Number(iterationsText);
  if (!Number.isInteger(iterations) || iterations < 1) return false;

  const actual = Buffer.from(pbkdf2Sync(password, salt, iterations, 32, "sha256").toString("hex"), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function findUserByIdentifier(identifier: string) {
  const normalized = normalizeIdentifier(identifier);
  if (!normalized) return null;
  const rows = await query<UserRow>(
    `SELECT id, name, username, email, phone, address, role, password_hash
       FROM storefront_users
      WHERE username_normalized = $1 OR email_normalized = $1
      LIMIT 1`,
    [normalized],
  );
  return rows[0] ?? null;
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await query(
    `INSERT INTO storefront_sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, $3)`,
    [tokenHash, userId, expiresAt.toISOString()],
  );

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await query("DELETE FROM storefront_sessions WHERE token_hash = $1", [hashToken(token)]);
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const rows = await query<UserRow>(
    `SELECT u.id, u.name, u.username, u.email, u.phone, u.address, u.role
       FROM storefront_sessions s
       JOIN storefront_users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > now()
      LIMIT 1`,
    [hashToken(token)],
  );

  if (!rows[0]) {
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return toPublicUser(rows[0]);
}

export async function requireAdminUser() {
  const user = await getSessionUser();
  return user?.role === "admin" ? user : null;
}
