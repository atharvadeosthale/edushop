import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/database/connection";
import {
  session,
  user,
  account,
  verification,
} from "@/database/schema/auth-schema";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  appName: "edushop",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
    },
  }),
  plugins: [nextCookies(), openAPI()],
});
