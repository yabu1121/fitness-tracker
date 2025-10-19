// ⚠️ 本番環境では削除または保護してください！
// このファイルは開発・テスト用です

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'test@example.com'
  const password = 'password123'
  const name = 'テストユーザー'

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    console.log('⚠️  このメールアドレスは既に登録されています')
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      weeklyGoal: 3,
      defaultUnit: 'kg'
    }
  })

  console.log('✅ テストユーザーが作成されました！')
  console.log('---')
  console.log('メールアドレス:', email)
  console.log('パスワード:', password)
  console.log('---')
  console.log('このアカウントでログインできます 🎉')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

