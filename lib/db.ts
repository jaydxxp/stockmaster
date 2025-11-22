
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
 
const globalForDb = globalThis as unknown as {
  conn: ReturnType<typeof postgres> | undefined;
};

const connection =
  globalForDb.conn ??
  postgres(process.env.DATABASE_URL as string, {
    max: 1,  
  });

if (!globalForDb.conn) {
  globalForDb.conn = connection;
}

export const db = drizzle(connection, { schema });

export * from "@/db/schema";
