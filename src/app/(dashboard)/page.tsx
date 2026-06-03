import { redirect } from "next/navigation";
import { db } from "@/db";
import { cases, userGroups } from "@/db/schema";
import { CasesTable } from "@/components/cases/cases-table";
import { createClient } from "@/lib/supabase/server";
import { desc, eq } from "drizzle-orm";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [membership] = await db.select().from(userGroups).where(eq(userGroups.userId, user.id));
  if (!membership) redirect("/setup");

  const allCases = await db
    .select()
    .from(cases)
    .where(eq(cases.groupId, membership.groupId))
    .orderBy(desc(cases.createdAt));

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <CasesTable initialCases={allCases} />
    </main>
  );
}
