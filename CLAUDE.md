# 案件管理ダッシュボード

Excelやメモリベースでプロジェクトをひとつずつ管理するチームのための共有案件管理アプリ。

## 概要

- 対象: 複数人で案件を共有管理するチーム
- 目的: 全案件のフェーズ・期日・担当をひと画面で把握、期日アラートで抜け漏れを防ぐ
- スマホ対応必須

## 技術スタック

| 役割 | 技術 |
|---|---|
| フレームワーク | Next.js (App Router) |
| 言語 | TypeScript |
| UI | shadcn/ui |
| スタイリング | Tailwind CSS |
| フォーム | React Hook Form + Zod |
| ORM | Drizzle ORM |
| Zodスキーマ生成 | drizzle-zod（DBスキーマ → Zodスキーマ自動生成） |
| DB | Supabase (PostgreSQL) |
| 認証 | Supabase Auth（メール認証） |
| リアルタイム | Supabase Realtime |
| ホスティング | Vercel |
| パッケージマネージャ | npm |

## ディレクトリ構成（予定）

```
src/
  app/                  # Next.js App Router
    (auth)/             # 認証不要ページ（ログイン等）
    (dashboard)/        # 認証必須ページ
  components/
    ui/                 # shadcn/ui 自動生成コンポーネント
    cases/              # 案件関連コンポーネント
  db/
    schema.ts           # Drizzle スキーマ定義
    index.ts            # DB接続
  lib/
    validations/        # drizzle-zod 生成 + 追加バリデーション
    supabase/           # Supabase クライアント
  types/                # 共通型定義
```

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run lint         # Lint
npm run db:push      # Drizzle スキーマを DB に反映
npm run db:studio    # Drizzle Studio（DB GUI）
```

## 設計方針

### 型安全性
- DrizzleスキーマをSingle Source of Truthとする
- `drizzle-zod` でZodスキーマを自動生成し、フォームバリデーションに使用
- DBの型 → Zodスキーマ → React Hook Form の順で型を通す

### コンポーネント
- shadcn/ui のコンポーネントは `src/components/ui/` に置く（直接編集しない）
- 案件ドメインのコンポーネントは `src/components/cases/` に置く
- Server Component を基本とし、インタラクションが必要な箇所のみ `"use client"`

### スタイリング
- Tailwind CSS のユーティリティクラスを直接使用
- `cn()` ヘルパー（clsx + tailwind-merge）で条件付きクラスをまとめる

### 期日アラート
- 今日が期日: 赤（`text-red-600` / `bg-red-50`）
- 3日以内: 黄（`text-yellow-600` / `bg-yellow-50`）
- それ以外: 通常

## MVPスコープ

- [ ] 案件一覧テーブル（案件名・フェーズ・期日・担当者）
- [ ] フェーズ管理: 新規 → 商談中 → 提案 → 受注 / 失注
- [ ] 期日アラート（色分け）
- [ ] 案件の追加・編集・削除（モーダルフォーム）
- [ ] メール認証ログイン
- [ ] レスポンシブ対応（スマホ）
