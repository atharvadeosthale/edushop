import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { sql } from "drizzle-orm";
export const stripeConnectionsTable = sqliteTable("stripe_connections", {
  id: integer("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
  stripeAccountId: text("stripe_account_id").notNull(),
  onboardingCompleted: integer("onboarding_completed", {
    mode: "boolean",
  })
    .notNull()
    .default(false),
});

export type StripeConnection = typeof stripeConnectionsTable.$inferSelect;
