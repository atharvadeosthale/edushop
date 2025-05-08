import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { sql } from "drizzle-orm";
import { workshopsTable } from "./workshop";

export const purchasesTable = sqliteTable("purchases", {
  id: integer("id").primaryKey().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  workshopId: integer("workshop_id")
    .notNull()
    .references(() => workshopsTable.id),
  purchaseSuccessful: integer("purchase_successful", {
    mode: "boolean",
  })
    .notNull()
    .default(false),
  stripeCheckoutId: text("stripe_checkout_id").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
