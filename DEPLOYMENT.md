# 🚀 デプロイガイド

このアプリをVercelで公開する手順です。

## ✅ 公開前のチェックリスト

### 必須項目
- [ ] `.env` ファイルが `.gitignore` に含まれている
- [ ] 機密情報（パスワード、APIキーなど）がコードに含まれていない
- [ ] データベースが本番用（PostgreSQL）に変更されている
- [ ] `NEXTAUTH_SECRET` が強力なランダム文字列になっている
- [ ] エラーハンドリングが適切に実装されている

### 推奨項目
- [ ] README.md が最新
- [ ] テストユーザー作成スクリプトを削除または保護
- [ ] 不要なコンソールログを削除
- [ ] パフォーマンスの最適化

---

## 📦 Vercelへのデプロイ手順

### 1. GitHubリポジトリの作成

```bash
cd fitness-tracker
git init
git add .
git commit -m "Initial commit: Fitness Tracker App"
git branch -M main
git remote add origin https://github.com/your-username/fitness-tracker.git
git push -u origin main
```

### 2. Vercelでプロジェクトをインポート

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. "Add New..." → "Project" をクリック
3. GitHubリポジトリをインポート
4. プロジェクト設定:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. 環境変数の設定

Vercelの設定画面で以下の環境変数を追加：

#### 必須の環境変数

```
DATABASE_URL=postgresql://...（PostgreSQLの接続文字列）
NEXTAUTH_SECRET=（強力なランダム文字列）
NEXTAUTH_URL=https://your-app.vercel.app
```

#### NEXTAUTH_SECRETの生成方法

```bash
# Linuxの場合
openssl rand -base64 32

# Node.jsの場合
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. データベースの設定

#### オプション1: Vercel Postgres（推奨）

1. Vercel Dashboardで "Storage" タブ
2. "Create Database" → "Postgres"
3. データベース名を入力して作成
4. 自動的に `DATABASE_URL` が設定される

#### オプション2: 外部PostgreSQL

- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

など、無料プランのあるサービスを利用

### 5. Prismaのマイグレーション

本番データベースにスキーマを適用：

```bash
# ローカルで本番DBに接続してマイグレーション
DATABASE_URL="postgresql://..." npx prisma db push

# 初期データ（種目）を投入
DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
```

または、Vercelのビルド時に自動実行する設定を追加：

`package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && prisma db push && next build",
    "postinstall": "prisma generate"
  }
}
```

### 6. デプロイ実行

1. Vercelで "Deploy" をクリック
2. ビルドが完了するまで待つ
3. デプロイされたURLにアクセス

---

## 🔒 セキュリティ対策

### 実装済み
- ✅ パスワードのハッシュ化（bcrypt）
- ✅ NextAuth.jsによる認証
- ✅ ミドルウェアによる保護されたルート
- ✅ API routeでのユーザー検証
- ✅ CSRF保護（NextAuth.js組み込み）

### 追加推奨事項
- [ ] レート制限の実装
- [ ] メール認証の追加
- [ ] パスワードリセット機能
- [ ] 2要素認証（2FA）
- [ ] セキュリティヘッダーの追加

---

## 🎯 本番環境での注意点

### 1. データベースのバックアップ
定期的にデータベースのバックアップを取る

### 2. エラーログの監視
Vercelのダッシュボードでエラーログを確認

### 3. パフォーマンス監視
- ページの読み込み速度
- APIレスポンスタイム
- データベースクエリの最適化

### 4. コスト管理
- Vercelの無料プランの制限を確認
- データベースの使用量を監視

---

## 📊 本番環境でのスキーマ変更

開発と違い、本番では慎重に：

```bash
# 1. マイグレーションファイルを作成
npx prisma migrate dev --name your_migration_name

# 2. 本番に適用
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

---

## 🐛 トラブルシューティング

### ビルドエラー
```bash
# 依存関係の確認
npm install

# Prismaクライアントの再生成
npx prisma generate
```

### 認証エラー
- `NEXTAUTH_URL` が正しいか確認
- `NEXTAUTH_SECRET` が設定されているか確認

### データベース接続エラー
- `DATABASE_URL` の形式が正しいか確認
- データベースが起動しているか確認

---

## 🌐 カスタムドメインの設定

Vercelでカスタムドメインを追加：

1. Vercel Dashboard → Settings → Domains
2. ドメインを追加
3. DNSレコードを設定
4. `NEXTAUTH_URL` を更新

---

## 📈 次のステップ

公開後に追加できる機能：

- [ ] Google Analytics
- [ ] Sentry（エラートラッキング）
- [ ] PWA化（モバイルアプリっぽく）
- [ ] OpenAI API統合
- [ ] ソーシャルログイン（Google, GitHub）
- [ ] 画像アップロード機能
- [ ] エクスポート機能（CSV, PDF）

---

**準備ができたら、デプロイしてみましょう！** 🚀

