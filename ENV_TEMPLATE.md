# 環境変数の設定

## 開発環境（.env）

```env
# Database - SQLite for development
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## 本番環境（Vercel環境変数）

```env
# Database - PostgreSQL
DATABASE_URL="postgresql://username:password@host:5432/database?schema=public"

# NextAuth.js - 必ず変更してください！
# 生成コマンド: openssl rand -base64 32
NEXTAUTH_SECRET="your-production-secret-key-here-change-this"

# 本番URL
NEXTAUTH_URL="https://your-app.vercel.app"
```

## セキュリティ重要事項

⚠️ **本番環境では必ず以下を変更してください：**

1. `NEXTAUTH_SECRET` - ランダムな文字列に変更
2. `DATABASE_URL` - PostgreSQLの接続情報
3. `NEXTAUTH_URL` - 実際のドメインに変更

