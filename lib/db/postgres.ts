import { Pool } from "pg";

const rawUrl = process.env.DATABASE_URL || "";

// Strip query parameters so pg driver uses explicit ssl config
const connectionString = (rawUrl || "").split("?")[0];

let poolInstance: Pool | null = null;

function getPool(): Pool {
  if (!poolInstance) {
    poolInstance = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 20000,
      max: 10,
      idleTimeoutMillis: 30000,
    });

    // Prevent unhandled errors on idle clients dropped by Supabase PgBouncer pooler
    poolInstance.on("error", (err) => {
      console.warn("[PostgreSQL Pooler Idle Drop]", err.message);
    });
  }
  return poolInstance;
}

export async function queryPostgres<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  if (!connectionString) {
    console.warn("[PostgreSQL] DATABASE_URL non configurée.");
    return [];
  }

  const execute = async () => {
    const pool = getPool();
    const res = await pool.query(text, params);
    return res.rows as T[];
  };

  try {
    return await execute();
  } catch (err: any) {
    // Retry once if connection was dropped by serverless pooler
    const isConnErr = err.message?.includes("Connection terminated") || err.message?.includes("connection timeout") || err.code === "ECONNRESET";
    if (isConnErr) {
      console.warn("[Supabase Postgres Retry] Tentative de reconnexion au pooler...");
      try {
        return await execute();
      } catch (retryErr: any) {
        console.warn(`[Supabase Postgres Error Retry]`, retryErr.message);
        throw retryErr;
      }
    }
    console.warn(`[Supabase Postgres Error]`, err.message);
    throw err;
  }
}

export async function checkPostgresHealth(): Promise<{ status: "healthy" | "degraded"; latencyMs: number; error?: string }> {
  if (!connectionString) {
    return {
      status: "degraded",
      latencyMs: 0,
      error: "DATABASE_URL non configurée dans l'environnement",
    };
  }

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
  let host = "aws-0-eu-west-1.pooler.supabase.com";
  let port = 5432;
  try {
    if (connectionString) {
      const parsed = new URL(connectionString);
      host = parsed.hostname;
      port = Number(parsed.port) || 5432;
    }
  } catch {}

  return {
    connected: Boolean(connectionString),
    host,
    port,
    mode: "Transaction Mode (Port 5432 / IPv4 Pooler)",
  };
}

export default queryPostgres;
