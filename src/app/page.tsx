import { db } from "@/db";
import { cases } from "@/db/schema";
import { CasesTable } from "@/components/cases/cases-table";
import { desc } from "drizzle-orm";

export default async function HomePage() {
  const allCases = await db.select().from(cases).orderBy(desc(cases.createdAt));

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <CasesTable initialCases={allCases} />
    </main>
  );
}
