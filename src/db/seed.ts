import { db } from "./index";
import { groups, cases } from "./schema";
import { eq } from "drizzle-orm";

const DEV_INVITE_CODE = "DEV00001";

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

async function seed() {
  let [group] = await db.select().from(groups).where(eq(groups.inviteCode, DEV_INVITE_CODE));
  if (!group) {
    [group] = await db.insert(groups).values({ name: "開発チーム", inviteCode: DEV_INVITE_CODE }).returning();
    console.log(`グループ作成: ${group.name}`);
  } else {
    console.log(`グループ再利用: ${group.name}`);
  }

  await db.delete(cases).where(eq(cases.groupId, group.id));
  await db.insert(cases).values([
    { groupId: group.id, name: "株式会社ABC システム開発", phase: "negotiating", deadline: addDays(2),  assignee: "田中太郎" },
    { groupId: group.id, name: "DEF工業 保守契約更新",    phase: "proposed",    deadline: addDays(0),  assignee: "山田花子" },
    { groupId: group.id, name: "GHI商事 新規提案",        phase: "new",         deadline: addDays(10), assignee: "佐藤一郎" },
    { groupId: group.id, name: "JKL物産 受注済みPJ",      phase: "won",         deadline: addDays(-3), assignee: "鈴木次郎" },
    { groupId: group.id, name: "MNO運輸 失注案件",        phase: "lost",        deadline: null,        assignee: "高橋三郎" },
  ]);
  console.log("案件5件をシード完了");
  console.log(`\n招待コード: ${DEV_INVITE_CODE} でグループに参加してください`);
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
