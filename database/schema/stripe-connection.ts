import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const stripeConnectionsTable = sqliteTable("stripe_connections", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
  stripeAccountId: text("stripe_account_id").notNull(),
});
