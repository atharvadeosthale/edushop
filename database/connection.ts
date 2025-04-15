import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection: {
    url: env.LIBSQL_URL,
    authToken: env.LIBSQL_TOKEN,
  },
});
