# 📋 公開前チェックリスト

## 🔒 セキュリティ

- [ ] ✅ `.env` ファイルが `.gitignore` に含まれている
- [ ] ✅ `NEXTAUTH_SECRET` を本番用に変更（openssl rand -base64 32）
- [ ] ✅ テストユーザー作成スクリプト（`create-test-user.ts`）を削除または保護
- [ ] ⚠️ データベースURLに本番環境のPostgreSQLを使用
- [ ] ⚠️ コンソールログから機密情報を削除

## 🗄️ データベース

- [ ] ✅ Prismaスキーマを PostgreSQL 用に変更
- [ ] ⚠️ 本番データベースの作成（Vercel Postgres / Supabase / Neon）
- [ ] ⚠️ `prisma db push` または `prisma migrate deploy` を実行
- [ ] ⚠️ 種目の初期データ（seed.ts）を投入
- [ ] ⚠️ データベースのバックアップ設定

## 🌐 環境設定

- [ ] ✅ Vercelアカウントの作成
- [ ] ⚠️ 環境変数の設定（DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL）
- [ ] ⚠️ `NEXTAUTH_URL` を本番URLに変更
- [ ] ⚠️ ビルド設定の確認

## 🎨 UI/UX

- [ ] ✅ ダークテーマのデザイン統一
- [ ] ✅ モバイルレスポンシブ対応
- [ ] ✅ ローディング状態の実装
- [ ] ✅ エラーメッセージの表示

## 🧪 テスト

- [ ] ⚠️ ログイン/ログアウトの動作確認
- [ ] ⚠️ トレーニング記録の作成・編集・削除
- [ ] ⚠️ プロフィール更新の動作確認
- [ ] ⚠️ カレンダー表示の確認
- [ ] ⚠️ グラフ表示の確認
- [ ] ⚠️ モバイル表示の確認

## 📱 パフォーマンス

- [ ] ⚠️ 画像の最適化
- [ ] ⚠️ 不要なインポートの削除
- [ ] ⚠️ コード分割の確認
- [ ] ⚠️ Lighthouse スコアの確認

## 📝 ドキュメント

- [ ] ✅ README.md の更新
- [ ] ✅ デプロイガイドの作成
- [ ] ⚠️ ライセンスの追加
- [ ] ⚠️ コントリビューションガイドライン

---

## ⚠️ 注意事項

### 削除または保護すべきファイル

```bash
# これらのファイルは本番環境では不要
prisma/create-test-user.ts  # テストユーザー作成スクリプト
```

### 本番環境で必要な変更

1. **schema.prisma の変更**
   ```prisma
   datasource db {
     provider = "postgresql"  // sqlite → postgresql
     url      = env("DATABASE_URL")
   }
   ```

2. **package.json のスクリプト追加**
   ```json
   {
     "scripts": {
       "postinstall": "prisma generate",
       "build": "prisma generate && next build"
     }
   }
   ```

---

## 🚀 デプロイコマンド

### GitHub へのプッシュ

```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Vercel での自動デプロイ

- main ブランチにプッシュすると自動的にデプロイ
- プレビュー環境で確認
- 問題なければ本番環境に昇格

---

## ✅ デプロイ後の確認事項

- [ ] アプリが正常に起動する
- [ ] 新規登録ができる
- [ ] ログインができる
- [ ] トレーニング記録ができる
- [ ] データが保存される
- [ ] 全てのページが表示される
- [ ] モバイル表示が正常

---

## 📞 サポート

問題が発生した場合：

1. Vercel のログを確認
2. ブラウザのコンソールを確認
3. データベース接続を確認
4. 環境変数を再確認

---

**全てのチェックが完了したら、デプロイの準備完了です！** 🎉

