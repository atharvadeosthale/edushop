import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/libsql";
import { upstashCache } from "drizzle-orm/cache/upstash";

export const db = drizzle({
  connection: {
    url: env.LIBSQL_URL,
    authToken: env.LIBSQL_TOKEN,
  },
  cache: upstashCache({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN,

    global: false,
  }),
});
