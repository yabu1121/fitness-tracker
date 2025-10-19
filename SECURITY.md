# 🔒 セキュリティガイド

## 実装済みのセキュリティ対策

### ✅ 認証・認可
- **NextAuth.js v5**: 業界標準の認証ライブラリ
- **パスワードハッシュ化**: bcryptjs (12 rounds)
- **セッション管理**: JWT based sessions
- **ミドルウェア保護**: 全ページに認証チェック

### ✅ データベース
- **Prisma ORM**: SQLインジェクション対策
- **カスケード削除**: データの整合性保持
- **ユーザー分離**: 各ユーザーは自分のデータのみアクセス可能

### ✅ API セキュリティ
- **認証チェック**: 全APIルートで `auth()` を使用
- **ユーザー検証**: リクエストごとにユーザーを確認
- **CSRF保護**: NextAuth.js組み込み

---

## ⚠️ 本番環境で必須の設定

### 1. 強力な NEXTAUTH_SECRET

```bash
# 生成コマンド
openssl rand -base64 32
```

❌ **ダメな例**: 
- `"secret"`
- `"password123"`
- `"your-secret-key-here"`

✅ **良い例**: 
- `"K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols="`

### 2. HTTPS の使用

- Vercel は自動的に HTTPS を提供
- カスタムドメインでも自動 SSL 証明書

### 3. 環境変数の管理

- `.env` ファイルは **絶対に** コミットしない
- Vercel の環境変数機能を使用
- 開発/本番で異なる値を使用

---

## 🛡️ 推奨する追加対策

### すぐに実装できるもの

1. **レート制限**
   ```typescript
   // API routeでの例
   const MAX_REQUESTS = 100
   const WINDOW_MS = 15 * 60 * 1000 // 15分
   ```

2. **入力バリデーション強化**
   ```typescript
   // Zodスキーマの追加
   const signupSchema = z.object({
     email: z.string().email(),
     password: z.string().min(8),
     name: z.string().min(2).max(50)
   })
   ```

3. **メール認証**
   - NextAuth.js の Email Provider を追加
   - アカウント確認フロー

### 中長期的な改善

4. **2要素認証（2FA）**
   - TOTP（Time-based One-Time Password）
   - SMS認証

5. **監査ログ**
   - ユーザーアクションの記録
   - 不正アクセスの検知

6. **セキュリティヘッダー**
   ```typescript
   // next.config.ts
   headers: async () => ([{
     source: '/(.*)',
     headers: [
       { key: 'X-Frame-Options', value: 'DENY' },
       { key: 'X-Content-Type-Options', value: 'nosniff' },
       { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }
     ]
   }])
   ```

---

## 🚨 脆弱性の報告

セキュリティ上の問題を発見した場合：

1. **公開しない**: GitHub Issueではなく、直接連絡
2. **詳細を提供**: 再現手順、影響範囲など
3. **修正を待つ**: 公開前に修正する時間を与える

---

## 📋 定期的なセキュリティチェック

### 月次
- [ ] 依存関係の更新（`npm audit`）
- [ ] セキュリティパッチの適用
- [ ] アクセスログの確認

### 四半期
- [ ] パスワードポリシーの見直し
- [ ] 認証フローのテスト
- [ ] データベースのバックアップ確認

---

## 🔐 ベストプラクティス

### DO（推奨）
- ✅ 環境変数で機密情報を管理
- ✅ HTTPS を使用
- ✅ 定期的にパッケージを更新
- ✅ エラーメッセージは一般的に（詳細を漏らさない）
- ✅ ログアウト機能を実装

### DON'T（禁止）
- ❌ パスワードを平文で保存
- ❌ 機密情報をコミット
- ❌ SQL文を直接実行
- ❌ エラーで内部情報を表示
- ❌ 古い依存関係を放置

---

## 📚 参考リソース

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Prisma Security](https://www.prisma.io/docs/guides/security)
- [NextAuth.js Security](https://next-auth.js.org/security)

---

**セキュリティは継続的なプロセスです。常に最新情報をチェックしましょう！** 🔒

