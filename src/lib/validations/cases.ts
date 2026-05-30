import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { cases } from "@/db/schema";

export const insertCaseSchema = createInsertSchema(cases, {
  name: (s) => s.min(1, "案件名は必須です"),
});

export const updateCaseSchema = createUpdateSchema(cases, {
  name: (s) => s.min(1, "案件名は必須です"),
});

export type InsertCase = typeof insertCaseSchema._type;
export type UpdateCase = typeof updateCaseSchema._type;
