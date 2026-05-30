import { pgTable, uuid, text, date, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const phaseEnum = pgEnum("phase", [
  "new",
  "negotiating",
  "proposed",
  "won",
  "lost",
]);

export const cases = pgTable("cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phase: phaseEnum("phase").notNull().default("new"),
  deadline: date("deadline"),
  assignee: text("assignee"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
