import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";
import { sql } from "drizzle-orm";

export const workshopsTable = sqliteTable("workshops", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  time: integer("time").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Workshop = typeof workshopsTable.$inferSelect;
