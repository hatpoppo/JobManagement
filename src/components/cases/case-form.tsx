"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { insertCaseSchema, type InsertCase } from "@/lib/validations/cases";
import { type cases } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";

type Case = InferSelectModel<typeof cases>;

const PHASE_OPTIONS = [
  { value: "new", label: "新規" },
  { value: "negotiating", label: "商談中" },
  { value: "proposed", label: "提案" },
  { value: "won", label: "受注" },
  { value: "lost", label: "失注" },
] as const;

interface CaseFormProps {
  defaultValues?: Partial<Case>;
  onSubmit: (data: InsertCase) => Promise<void>;
  onCancel: () => void;
}

export function CaseForm({ defaultValues, onSubmit, onCancel }: CaseFormProps) {
  const form = useForm<InsertCase>({
    resolver: zodResolver(insertCaseSchema),
    defaultValues: {
      name: defaultValues?.name ?? "",
      phase: defaultValues?.phase ?? "new",
      deadline: defaultValues?.deadline ?? null,
      assignee: defaultValues?.assignee ?? "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>案件名</FormLabel>
              <FormControl>
                <Input placeholder="例: 株式会社○○ システム開発" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>フェーズ</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? "new"} items={PHASE_OPTIONS}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="フェーズを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PHASE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>期日</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>担当者</FormLabel>
              <FormControl>
                <Input
                  placeholder="例: 山田太郎"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
