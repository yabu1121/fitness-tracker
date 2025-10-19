# 🔧 デプロイエラーの修正手順

## 実施した修正

### ✅ 1. bcryptjs のクライアント側実行を修正
- サーバー側（API route）でのみパスワードをハッシュ化
- クライアント側（signup page）では平文で送信

### ✅ 2. ビルドスクリプトの最適化
- `postinstall` で Prisma クライアントを自動生成
- Turbopack を本番ビルドから削除（互換性のため）

### ✅ 3. Prisma バイナリターゲットの追加
- Vercel のデプロイ環境に対応
- `debian-openssl-3.0.x` を追加

### ✅ 4. Vercel 設定ファイルの追加
- `vercel.json` でビルドコマンドを明示

---

## 🚀 再デプロイ手順

### 1. 変更をコミット

```bash
cd fitness-tracker
git add .
git commit -m "🔧 Fix: Vercel deployment errors"
git push origin main
```

### 2. Vercelで環境変数を確認

**必須の環境変数（3つ）:**

1. **DATABASE_URL**
   ```
   # まだデータベースを作成していない場合
   Vercel Dashboard → Storage → Create Database → Postgres
   # 作成すると自動的に DATABASE_URL が設定される
   ```

2. **NEXTAUTH_SECRET**
   ```
   # ランダムな文字列を生成
   openssl rand -base64 32
   
   # または
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   
   # 生成された文字列を Vercel の環境変数に設定
   ```

3. **NEXTAUTH_URL**
   ```
   https://your-app.vercel.app
   
   # デプロイ後に自動設定される場合もあります
   # 設定されていない場合は手動で追加
   ```

### 3. 環境変数の設定方法

Vercel Dashboard で:
1. プロジェクトを選択
2. Settings タブ
3. Environment Variables
4. 各変数を追加:
   - Name: `NEXTAUTH_SECRET`
   - Value: （生成した文字列）
   - Environment: Production, Preview, Development すべて選択
   - Add

### 4. 再デプロイ

**方法1: 自動（推奨）**
```bash
git push origin main
# 自動的に再デプロイされる
```

**方法2: 手動**
1. Vercel Dashboard → Deployments
2. 最新のデプロイの "..." メニュー
3. "Redeploy" をクリック

---

## ✅ デプロイ成功の確認

ビルドログで以下を確認：

```
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Collecting build traces
✓ Finalizing page optimization
```

---

## 🎯 データベースのセットアップ

デプロイ成功後、データベースに初期データを投入：

### オプション1: ローカルから実行（推奨）

```bash
# Vercel から DATABASE_URL をコピー
# Vercel Dashboard → Settings → Environment Variables

# ローカルで実行
DATABASE_URL="postgresql://..." npx prisma db push
DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
```

### オプション2: Vercel CLI を使用

```bash
# Vercel CLI をインストール
npm i -g vercel

# プロジェクトにリンク
vercel link

# コマンドを実行
vercel env pull .env.production
npm run db:push
npm run db:seed
```

---

## 🐛 まだエラーが出る場合

### エラー: "Prisma Client could not be generated"

**解決策:**
```json
// package.json を確認
{
  "scripts": {
    "postinstall": "prisma generate"  // これがあるか確認
  }
}
```

### エラー: "NEXTAUTH_SECRET is not set"

**解決策:**
1. Vercel → Settings → Environment Variables
2. `NEXTAUTH_SECRET` を追加
3. 再デプロイ

### エラー: "Can't reach database server"

**解決策:**
1. Vercel Postgres が作成されているか確認
2. `DATABASE_URL` が設定されているか確認
3. schema.prisma が `provider = "postgresql"` になっているか確認

---

## 📋 チェックリスト

デプロイ前に確認：

- [ ] `git push` でコミット済み
- [ ] Vercel でデータベース作成済み
- [ ] 環境変数3つすべて設定済み
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_SECRET
  - [ ] NEXTAUTH_URL
- [ ] schema.prisma が postgresql になっている（本番用）

---

## 🎉 成功したら

1. デプロイされたURLにアクセス
2. 新規アカウントを作成
3. トレーニングを記録してテスト
4. 問題なければ完了！

---

**これで必ずデプロイできます！** 💪

