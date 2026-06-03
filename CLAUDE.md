@AGENTS.md

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
| UI | shadcn/ui (Base UI ベース) |
| スタイリング | Tailwind CSS |
| フォーム | React Hook Form + Zod |
| ORM | Drizzle ORM |
| Zodスキーマ生成 | drizzle-zod（DBスキーマ → Zodスキーマ自動生成） |
| DB | Supabase (PostgreSQL) |
| 認証 | Supabase Auth（メール認証） |
| ホスティング | Vercel |
| パッケージマネージャ | npm |

## ディレクトリ構成

```
src/
  app/
    (auth)/             # 認証不要ページ
      login/            # ログイン
      setup/            # グループ作成・参加
    (dashboard)/        # 認証必須ページ
    actions/
      cases.ts          # 案件 Server Actions
      groups.ts         # グループ Server Actions
  components/
    ui/                 # shadcn/ui コンポーネント
    cases/              # 案件関連コンポーネント
  db/
    schema.ts           # Drizzle スキーマ（groups / user_groups / cases）
    index.ts            # DB接続
    seed.ts             # 開発用シーダー
  lib/
    validations/        # drizzle-zod 生成 + 追加バリデーション
    supabase/           # Supabase クライアント
  middleware.ts         # 認証ガード
```

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run lint         # Lint
npm run db:push      # Drizzle スキーマを DB に反映
npm run db:studio    # Drizzle Studio（DB GUI）
npm run db:seed      # 開発用テストデータ投入（招待コード: DEV00001）
```

## DBスキーマ

### groups
| 列 | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| name | text | グループ名 |
| invite_code | text | 招待コード（8文字英数字、ユニーク） |
| created_at | timestamp | |

### user_groups
| 列 | 型 | 備考 |
|---|---|---|
| user_id | uuid | Supabase auth.users の UUID（ユニーク） |
| group_id | uuid | FK → groups |
| joined_at | timestamp | |

### cases
| 列 | 型 | 備考 |
|---|---|---|
| id | uuid | PK |
| group_id | uuid | FK → groups |
| name | text | 案件名（必須） |
| phase | enum | new / negotiating / proposed / won / lost |
| deadline | date | 期日（任意） |
| assignee | text | 担当者名（任意） |
| created_at / updated_at | timestamp | |

## 設計方針

### 型安全性
- DrizzleスキーマをSingle Source of Truthとする
- `drizzle-zod` でZodスキーマを自動生成し、フォームバリデーションに使用
- `insertCaseSchema` / `updateCaseSchema` は `groupId` を `.omit()` で除外（Server Action側でセット）
- DBの型 → Zodスキーマ → React Hook Form の順で型を通す

### 認証・グループ
- Supabase Auth でメール認証
- ミドルウェアで未ログインを `/login` にリダイレクト
- ダッシュボードレイアウトでグループ未所属を `/setup` にリダイレクト
- 1ユーザー1グループのみ所属（user_groups.user_id にユニーク制約）
- 案件の閲覧・編集・削除はすべて同一グループ内に限定

### コンポーネント
- shadcn/ui のコンポーネントは `src/components/ui/` に置く
- 案件ドメインのコンポーネントは `src/components/cases/` に置く
- Server Component を基本とし、インタラクションが必要な箇所のみ `"use client"`

### スタイリング
- Tailwind CSS のユーティリティクラスを直接使用
- `cn()` ヘルパー（clsx + tailwind-merge）で条件付きクラスをまとめる

### 期日アラート
- 期限切れ・今日: 赤（`text-red-600` / `bg-red-50`）⚠️
- 3日以内: 黄（`text-yellow-600` / `bg-yellow-50`）!
- それ以外: 通常

### テーブルUI
- ヘッダーは `sticky top-0` で固定（テーブルコンテナ内スクロール）
- 操作列（編集・削除）は `sticky right-0` で右端固定（横スクロール時も表示）
- スマホ: 担当者列を非表示、案件名を `w-28 truncate`、タップで全文展開
- PCでは案件名を全幅表示

## MVPスコープ

- [x] 案件一覧テーブル（案件名・フェーズ・期日・担当者）
- [x] フェーズ管理: 新規 → 商談中 → 提案 → 受注 / 失注
- [x] 期日アラート（色分け + 背景色）
- [x] 案件の追加・編集・削除（モーダルフォーム）
- [x] メール認証ログイン
- [x] レスポンシブ対応（スマホ）
- [x] グループ機能（招待コードで参加、グループ内でのみ共有）
- [x] 開発用シーダー（npm run db:seed）
- [x] テーブルヘッダー固定・スマホ最適化
