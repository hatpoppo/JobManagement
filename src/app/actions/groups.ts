"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";
import { groups, userGroups } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("認証が必要です");
  return user;
}

function generateInviteCode(): string {
  return randomBytes(4).toString("hex").toUpperCase();
}

export async function createGroup(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  if (!name) return { error: "グループ名を入力してください" };

  const user = await getAuthUser();

  const existing = await db.select().from(userGroups).where(eq(userGroups.userId, user.id));
  if (existing.length > 0) return { error: "すでにグループに所属しています" };

  const inviteCode = generateInviteCode();
  const [group] = await db.insert(groups).values({ name, inviteCode }).returning();
  await db.insert(userGroups).values({ userId: user.id, groupId: group.id });

  redirect("/");
}

export async function joinGroup(formData: FormData) {
  const inviteCode = (formData.get("inviteCode") as string)?.trim().toUpperCase();
  if (!inviteCode) return { error: "招待コードを入力してください" };

  const user = await getAuthUser();

  const existing = await db.select().from(userGroups).where(eq(userGroups.userId, user.id));
  if (existing.length > 0) return { error: "すでにグループに所属しています" };

  const [group] = await db.select().from(groups).where(eq(groups.inviteCode, inviteCode));
  if (!group) return { error: "招待コードが正しくありません" };

  await db.insert(userGroups).values({ userId: user.id, groupId: group.id });

  redirect("/");
}
