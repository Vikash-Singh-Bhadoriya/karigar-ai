import { Pool, type PoolConfig } from 'pg';
import { config } from './env';

function safeDbConfig(): { host: string; port: number; database: string; hasUrl: boolean } {
  const url = config.databaseUrl;
  if (!url) return { host: '(not set)', port: 5432, database: '(not set)', hasUrl: false };
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parsed.port ? Number(parsed.port) : 5432,
      database: parsed.pathname.replace(/^\//, ''),
      hasUrl: true,
    };
  } catch {
    return { host: '(unparseable)', port: 5432, database: '(unparseable)', hasUrl: true };
  }
}

const dbInfo = safeDbConfig();

const poolOpts: PoolConfig = {
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 8000,
};

if (config.databaseUrl) {
  poolOpts.connectionString = config.databaseUrl;
}

if (dbInfo.hasUrl) {
  console.log(`[DB] Connecting → host=${dbInfo.host} port=${dbInfo.port} db=${dbInfo.database}`);
} else {
  console.warn('[DB] DATABASE_URL is not set in environment — DB queries will fail');
}

const pool = new Pool(poolOpts);

pool.on('error', (err) => {
  const code = (err as NodeJS.ErrnoException).code ?? 'UNKNOWN';
  console.error(`[DB] Pool error: code=${code} message=${err.message}`);
});

export { pool as db };

/** Quick health check — returns true if the DB is reachable. */
export async function isDatabaseReady(): Promise<boolean> {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code ?? 'UNKNOWN';
    console.error(`[DB] Health check failed: code=${code} message=${(err as Error).message}`);
    return false;
  }
}
