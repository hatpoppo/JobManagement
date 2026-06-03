"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGroup, joinGroup } from "@/app/actions/groups";

export default function SetupPage() {
  const [mode, setMode] = useState<"create" | "join">("create");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const result = mode === "create" ? await createGroup(formData) : await joinGroup(formData);
    if (result && "error" in result) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">グループ設定</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            案件を共有するグループを作成するか、招待コードで参加してください
          </p>
        </div>

        <div className="flex rounded-lg border overflow-hidden">
          <button
            type="button"
            onClick={() => { setMode("create"); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "create" ? "bg-primary text-primary-foreground" : "bg-white hover:bg-muted/50"}`}
          >
            グループを作成
          </button>
          <button
            type="button"
            onClick={() => { setMode("join"); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "join" ? "bg-primary text-primary-foreground" : "bg-white hover:bg-muted/50"}`}
          >
            招待コードで参加
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
          {mode === "create" ? (
            <div className="space-y-2">
              <Label htmlFor="name">グループ名</Label>
              <Input id="name" name="name" required placeholder="例: 営業チーム" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="inviteCode">招待コード</Label>
              <Input id="inviteCode" name="inviteCode" required placeholder="例: ABCD1234" className="uppercase" />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "処理中..." : mode === "create" ? "グループを作成" : "参加する"}
          </Button>
        </form>
      </div>
    </div>
  );
}
