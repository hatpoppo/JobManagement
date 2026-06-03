"use server";

import { db } from "@/db";
import { cases, userGroups } from "@/db/schema";
import { insertCaseSchema, type InsertCase } from "@/lib/validations/cases";
import { createClient } from "@/lib/supabase/server";
import { eq, and } from "drizzle-orm";

async function getGroupId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("認証が必要です");
  const [membership] = await db.select().from(userGroups).where(eq(userGroups.userId, user.id));
  if (!membership) throw new Error("グループが必要です");
  return membership.groupId;
}

export async function createCase(data: InsertCase) {
  const groupId = await getGroupId();
  const parsed = insertCaseSchema.parse(data);
  const [created] = await db.insert(cases).values({ ...parsed, groupId }).returning();
  return created;
}

export async function updateCase(id: string, data: InsertCase) {
  const groupId = await getGroupId();
  const parsed = insertCaseSchema.parse(data);
  const [updated] = await db
    .update(cases)
    .set({ ...parsed, updatedAt: new Date() })
    .where(and(eq(cases.id, id), eq(cases.groupId, groupId)))
    .returning();
  return updated;
}

export async function deleteCase(id: string) {
  const groupId = await getGroupId();
  await db.delete(cases).where(and(eq(cases.id, id), eq(cases.groupId, groupId)));
}
