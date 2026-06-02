"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PhaseBadge } from "@/components/cases/phase-badge";
import { DeadlineCell } from "@/components/cases/deadline-cell";
import { CaseDialog } from "@/components/cases/case-dialog";
import { type InsertCase } from "@/lib/validations/cases";
import { type cases } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { createCase, updateCase, deleteCase } from "@/app/actions/cases";

type Case = InferSelectModel<typeof cases>;

export function CasesTable({ initialCases }: { initialCases: Case[] }) {
  const [caseList, setCaseList] = useState<Case[]>(initialCases);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Case | undefined>(undefined);

  const handleAdd = () => {
    setEditTarget(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (c: Case) => {
    setEditTarget(c);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この案件を削除しますか？")) return;
    await deleteCase(id);
    setCaseList((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = async (data: InsertCase) => {
    if (editTarget) {
      const updated = await updateCase(editTarget.id, data);
      setCaseList((prev) => prev.map((c) => (c.id === editTarget.id ? updated : c)));
    } else {
      const created = await createCase(data);
      setCaseList((prev) => [created, ...prev]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">案件一覧</h1>
        <Button onClick={handleAdd}>+ 案件を追加</Button>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>案件名</TableHead>
              <TableHead>フェーズ</TableHead>
              <TableHead>期日</TableHead>
              <TableHead>担当者</TableHead>
              <TableHead className="w-24 sticky right-0 bg-white border-l"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {caseList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  案件がありません
                </TableCell>
              </TableRow>
            ) : (
              caseList.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><PhaseBadge phase={c.phase} /></TableCell>
                  <TableCell><DeadlineCell deadline={c.deadline} /></TableCell>
                  <TableCell>{c.assignee ?? "-"}</TableCell>
                  <TableCell className="sticky right-0 bg-white border-l">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(c)}>編集</Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(c.id)}>削除</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CaseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editTarget={editTarget}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
