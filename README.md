# 🏋️‍♂️ フィットネストラッカー

Next.js 14 + Prisma + NextAuth.js v5 で構築されたモダンなトレーニング記録・進捗管理アプリ

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/fitness-tracker)

## 🌟 デモ

- **デザイン**: サイバーパンク風ダークテーマ
- **レスポンシブ**: PC / タブレット / スマホ対応
- **高速**: Next.js 14 App Router + Turbopack

---

## 🚀 主な機能

- **認証システム**: NextAuth.js v5 による安全なログイン・新規登録
- **トレーニング記録**: 種目選択からセット入力まで直感的な記録フロー
- **進捗可視化**: Recharts による美しいグラフで成長を確認
- **カレンダー表示**: 過去のトレーニング履歴をカレンダーで確認
- **プロフィール管理**: 目標設定や個人情報の管理
- **AI モチベーション**: ルールベースの励ましメッセージシステム

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + React 19
- **スタイリング**: Tailwind CSS + shadcn/ui
- **データベース**: Prisma + PostgreSQL
- **認証**: NextAuth.js v5
- **グラフ**: Recharts
- **フォーム**: React Hook Form + Zod
- **日付処理**: date-fns

## 📦 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルを作成し、以下の内容を設定してください：

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fitness_tracker?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. データベースのセットアップ

```bash
# Prisma クライアントの生成
npm run db:generate

# データベースにスキーマをプッシュ
npm run db:push

# 初期データ（種目）の投入
npm run db:seed
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは [http://localhost:3000](http://localhost:3000) で起動します。

## 🗄️ データベーススキーマ

### 主要なモデル

- **User**: ユーザー情報（身長、体重、目標など）
- **Exercise**: 種目マスタ（ベンチプレス、スクワットなど）
- **Workout**: トレーニングセッション
- **WorkoutSet**: セット詳細（重量、回数、RPE）
- **BodyWeight**: 体重記録
- **Achievement**: 達成バッジ

## 🎨 UI/UX の特徴

- **シンプル・直感的**: 記録がストレスなく1分以内に完了
- **見やすい**: 数字が大きく、タップしやすいボタン
- **モチベーション重視**: 達成感を視覚的に表現

## 🤖 AI 機能

ルールベースのモチベーションメッセージシステムを実装：

- 週の目標達成状況に応じたメッセージ
- トレーニング完了時の励まし
- 進捗に応じた個別アドバイス
- 時間帯に応じた挨拶

## 📱 画面フロー

```
1. ログイン
   ↓
2. ホーム（励ましメッセージ + 今週の進捗）
   ↓
3a. 新規記録 → 種目選択 → セット入力 → 完了（フィードバック）
3b. カレンダー → 過去の記録確認
3c. グラフ → 進捗確認
3d. プロフィール → 設定変更
```

## 🚀 デプロイ

詳細な手順は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### クイックデプロイ（Vercel）

1. **リポジトリをプッシュ**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Vercelでインポート**
   - [Vercel Dashboard](https://vercel.com/dashboard) でリポジトリを選択

3. **環境変数を設定**
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=（openssl rand -base64 32で生成）
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

4. **データベースをセットアップ**
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

5. **デプロイ完了！** 🎉

### 重要な注意事項

⚠️ **本番環境では必ず以下を変更してください：**

1. `schema.prisma` のプロバイダーを `postgresql` に変更
2. `NEXTAUTH_SECRET` を強力なランダム文字列に変更
3. 本番用のPostgreSQLデータベースを使用
4. テスト用スクリプト（`create-test-user.ts`）を削除

詳細は [PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md) を参照

## 📈 今後の拡張予定

- [ ] OpenAI API による高度なAI機能
- [ ] ソーシャル機能（友達との進捗共有）
- [ ] トレーニングプランの自動生成
- [ ] 栄養管理機能
- [ ] モバイルアプリ（React Native）

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

## 📄 ライセンス

MIT License

---

**Happy Training! 💪**