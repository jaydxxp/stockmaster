// drizzle.config.ts
import type { Config } from "drizzle-kit";

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error("DATABASE_URL is not set in environment variables");
}

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Use your Neon/Supabase connection string
    url: dbUrl,
  },
} satisfies Config;
