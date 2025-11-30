import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// Lazy initialization to avoid build-time errors
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getClient() {
  if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('TURSO_DATABASE_URL environment variable is not set');
  }

  return createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

export function getDb() {
  if (!dbInstance) {
    dbInstance = drizzle(getClient());
  }
  return dbInstance;
}

// For convenience - but this will throw if called during build without env vars
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>];
  },
});
