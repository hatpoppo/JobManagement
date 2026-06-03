import { pgTable, uuid, text, date, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const phaseEnum = pgEnum("phase", [
  "new",
  "negotiating",
  "proposed",
  "won",
  "lost",
]);

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userGroups = pgTable("user_groups", {
  userId: uuid("user_id").notNull().unique(),
  groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
});

export const cases = pgTable("cases", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").notNull().references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  phase: phaseEnum("phase").notNull().default("new"),
  deadline: date("deadline"),
  assignee: text("assignee"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
