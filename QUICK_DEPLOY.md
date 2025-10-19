# ⚡ クイックデプロイガイド（5分で公開）

## 最速でVercelに公開する手順

### 前提条件
- GitHubアカウント
- Vercelアカウント（無料）

---

## 🚀 手順

### 1️⃣ schema.prismaを変更（30秒）

`prisma/schema.prisma` の8-10行目を変更：

```prisma
datasource db {
  provider = "postgresql"  // "sqlite" から変更
  url      = env("DATABASE_URL")
}
```

### 2️⃣ GitHubにプッシュ（1分）

```bash
cd fitness-tracker
git init
git add .
git commit -m "🚀 Initial deployment"
git branch -M main

# GitHubで新しいリポジトリを作成後
git remote add origin https://github.com/あなたのユーザー名/fitness-tracker.git
git push -u origin main
```

### 3️⃣ Vercelでデプロイ（2分）

1. [vercel.com/new](https://vercel.com/new) にアクセス
2. GitHubリポジトリを選択
3. **何も変更せず** "Deploy" をクリック
4. ⏳ ビルドを待つ...

### 4️⃣ データベースを設定（1分）

デプロイ完了後：

1. Vercel Dashboard → あなたのプロジェクト
2. Storage タブ → "Create Database"
3. "Postgres" を選択
4. データベース名を入力 → Create
5. 自動的に `DATABASE_URL` が設定される ✨

### 5️⃣ 環境変数を追加（30秒）

1. Settings タブ → Environment Variables
2. 以下を追加：

```
NEXTAUTH_SECRET
値: （下のコマンドで生成）

NEXTAUTH_URL
値: https://your-app.vercel.app（自動的に設定される場合もあり）
```

**NEXTAUTH_SECRETの生成:**
```bash
# ターミナルで実行
openssl rand -base64 32
```

または
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 6️⃣ 再デプロイ（30秒）

1. Deployments タブ
2. 最新のデプロイの "..." メニュー
3. "Redeploy" をクリック

### 7️⃣ データベースにシードデータを投入（1分）

ローカルで本番DBに接続：

```bash
# Vercelから DATABASE_URL をコピー
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
```

---

## ✅ 完了！

アプリが公開されました！🎉

### 確認事項
- [ ] アプリにアクセスできる
- [ ] 新規登録ができる
- [ ] ログインできる
- [ ] トレーニング記録ができる

---

## 🎯 公開後にやること

### すぐに
1. 新規アカウントを作成してテスト
2. 数回トレーニングを記録
3. 全機能が動作するか確認

### 後で
1. カスタムドメインの設定
2. セキュリティ対策の追加
3. パフォーマンス最適化
4. 機能追加

---

## 🐛 よくある問題

### ビルドエラー
```
Error: Prisma Client could not be generated
```
**解決**: `postinstall` スクリプトが package.json にあるか確認

### 認証エラー
```
Error: [next-auth][error][NO_SECRET]
```
**解決**: `NEXTAUTH_SECRET` が設定されているか確認

### データベース接続エラー
```
Error: Can't reach database server
```
**解決**: 
1. Vercel Postgres が作成されているか確認
2. `DATABASE_URL` が正しく設定されているか確認

---

## 🎊 おめでとうございます！

あなたのフィットネストラッカーが全世界に公開されました！

URLを友達にシェアして、フィードバックをもらいましょう！💪

---

**デプロイURL**: `https://your-app.vercel.app`

**所要時間**: 約5分 ⚡

