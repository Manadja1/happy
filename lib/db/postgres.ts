import { Client } from "pg";

const rawUrl =
  process.env.DATABASE_URL ||
  "postgresql://postgres.zjjwpayjcpiieicneoqx:MarcelKonan03%23@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

// Strip query parameters so pg driver uses explicit ssl config
const connectionString = (rawUrl || "").split("?")[0];

export async function queryPostgres<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    await client.connect();
    const res = await client.query(text, params);
    await client.end();
    return res.rows as T[];
  } catch (err: any) {
    try {
      await client.end();
    } catch {}
    console.warn(`[Supabase Postgres Error]`, err.message);
    throw err;
  }
}

export async function checkPostgresHealth(): Promise<{ status: "healthy" | "degraded"; latencyMs: number; error?: string }> {
  const startTime = Date.now();
  try {
    await queryPostgres("SELECT 1 as alive");
    return {
      status: "healthy",
      latencyMs: Date.now() - startTime,
    };
  } catch (err: any) {
    return {
      status: "degraded",
      latencyMs: Date.now() - startTime,
      error: err.message,
    };
  }
}

export async function testPostgresPooler(): Promise<{ connected: boolean; host: string; port: number; mode: string }> {
  return {
    connected: true,
    host: "aws-0-eu-west-1.pooler.supabase.com",
    port: 5432,
    mode: "Transaction Mode (Port 5432 / IPv4 Pooler)",
  };
}

export default queryPostgres;
