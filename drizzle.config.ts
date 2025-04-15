import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  dialect: "turso",
  schema: "./database/schema/",
  out: "./database/migrations",
  dbCredentials: {
    url: process.env.LIBSQL_URL!,
    authToken: process.env.LIBSQL_TOKEN!,
  },
});
