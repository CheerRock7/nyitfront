import "server-only";
import { Pool } from "pg";

// A single shared connection pool, created lazily on first use and reused across
// hot reloads in dev. Lazy creation matters so `next build` (which imports route
// modules to collect config) doesn't require DATABASE_URL to be set.
declare global {
  // eslint-disable-next-line no-var
  var __nyitPool: Pool | undefined;
}

function getPool(): Pool {
  if (global.__nyitPool) return global.__nyitPool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in (see DEPLOY.md).",
    );
  }

  const pool = new Pool({
    connectionString,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
  global.__nyitPool = pool;
  return pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const result = await getPool().query(text, params as never);
  return result.rows as T[];
}
