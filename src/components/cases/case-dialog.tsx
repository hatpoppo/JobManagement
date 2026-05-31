"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CaseForm } from "@/components/cases/case-form";
import { type InsertCase } from "@/lib/validations/cases";
import { type cases } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";

type Case = InferSelectModel<typeof cases>;

interface CaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editTarget?: Case;
  onSubmit: (data: InsertCase) => Promise<void>;
}

export function CaseDialog({ open, onOpenChange, editTarget, onSubmit }: CaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editTarget ? "案件を編集" : "案件を追加"}</DialogTitle>
        </DialogHeader>
        <CaseForm
          defaultValues={editTarget}
          onSubmit={async (data) => {
            await onSubmit(data);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
