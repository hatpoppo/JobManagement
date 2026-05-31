"use server";

import { db } from "@/db";
import { cases } from "@/db/schema";
import { insertCaseSchema, type InsertCase } from "@/lib/validations/cases";
import { eq } from "drizzle-orm";

export async function createCase(data: InsertCase) {
  const parsed = insertCaseSchema.parse(data);
  const [created] = await db.insert(cases).values(parsed).returning();
  return created;
}

export async function updateCase(id: string, data: InsertCase) {
  const parsed = insertCaseSchema.parse(data);
  const [updated] = await db
    .update(cases)
    .set({ ...parsed, updatedAt: new Date() })
    .where(eq(cases.id, id))
    .returning();
  return updated;
}

export async function deleteCase(id: string) {
  await db.delete(cases).where(eq(cases.id, id));
}
