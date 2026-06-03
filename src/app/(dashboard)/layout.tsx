import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/login/actions";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { userGroups, groups } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const membership = user
    ? await db
        .select({ group: groups })
        .from(userGroups)
        .innerJoin(groups, eq(userGroups.groupId, groups.id))
        .where(eq(userGroups.userId, user.id))
        .then((rows) => rows[0])
    : null;

  if (!membership) redirect("/setup");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div>
          <span className="font-semibold text-sm">{membership.group.name}</span>
          <span className="ml-2 text-xs text-muted-foreground hidden sm:inline">
            招待コード: <span className="font-mono">{membership.group.inviteCode}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">ログアウト</Button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
