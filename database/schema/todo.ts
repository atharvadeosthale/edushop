import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const todosTable = sqliteTable("todos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
});

export type Todo = typeof todosTable.$inferSelect;
