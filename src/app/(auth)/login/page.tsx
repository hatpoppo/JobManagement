"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "./actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = mode === "signin" ? await signIn(formData) : await signUp(formData);

    if (result && "error" in result && result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result && "success" in result && result.success) {
      setMessage({ type: "success", text: result.success });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">案件管理ダッシュボード</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {mode === "signin" ? "ログイン" : "アカウント作成"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>

          {message && (
            <p className={`text-sm ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
              {message.text}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "処理中..." : mode === "signin" ? "ログイン" : "アカウント作成"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? (
            <>
              アカウントをお持ちでない方は{" "}
              <button onClick={() => { setMode("signup"); setMessage(null); }} className="underline font-medium">
                新規登録
              </button>
            </>
          ) : (
            <>
              すでにアカウントをお持ちの方は{" "}
              <button onClick={() => { setMode("signin"); setMessage(null); }} className="underline font-medium">
                ログイン
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
