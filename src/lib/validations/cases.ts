import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { cases } from "@/db/schema";

export const insertCaseSchema = createInsertSchema(cases, {
  name: (s) => s.min(1, "案件名は必須です"),
});

export const updateCaseSchema = createUpdateSchema(cases, {
  name: (s) => s.min(1, "案件名は必須です"),
});

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type UpdateCase = z.infer<typeof updateCaseSchema>;
