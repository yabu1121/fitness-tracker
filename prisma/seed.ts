import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default exercises
  const exercises = [
    // Chest
    { name: 'ベンチプレス', nameEn: 'Bench Press', category: 'chest', description: '胸筋を鍛える基本的な種目' },
    { name: 'インクラインベンチプレス', nameEn: 'Incline Bench Press', category: 'chest', description: '上胸筋を重点的に鍛える' },
    { name: 'ディクラインベンチプレス', nameEn: 'Decline Bench Press', category: 'chest', description: '下胸筋を重点的に鍛える' },
    { name: 'ダンベルプレス', nameEn: 'Dumbbell Press', category: 'chest', description: '可動域が広く、バランスも鍛えられる' },
    { name: 'プッシュアップ', nameEn: 'Push-up', category: 'chest', description: '自重で胸筋を鍛える' },

    // Back
    { name: 'デッドリフト', nameEn: 'Deadlift', category: 'back', description: '全身の筋力を鍛える基本種目' },
    { name: 'ラットプルダウン', nameEn: 'Lat Pulldown', category: 'back', description: '広背筋を鍛える' },
    { name: 'ベントオーバーロー', nameEn: 'Bent-over Row', category: 'back', description: '背中の厚みを作る' },
    { name: 'プルアップ', nameEn: 'Pull-up', category: 'back', description: '自重で背筋を鍛える' },
    { name: 'シーテッドロー', nameEn: 'Seated Row', category: 'back', description: '背中の中央部を鍛える' },

    // Legs
    { name: 'スクワット', nameEn: 'Squat', category: 'legs', description: '脚の基本種目' },
    { name: 'レッグプレス', nameEn: 'Leg Press', category: 'legs', description: '脚の筋力を鍛える' },
    { name: 'ルーマニアンデッドリフト', nameEn: 'Romanian Deadlift', category: 'legs', description: 'ハムストリングスを鍛える' },
    { name: 'レッグカール', nameEn: 'Leg Curl', category: 'legs', description: 'ハムストリングスを集中して鍛える' },
    { name: 'レッグエクステンション', nameEn: 'Leg Extension', category: 'legs', description: '大腿四頭筋を集中して鍛える' },

    // Shoulders
    { name: 'ショルダープレス', nameEn: 'Shoulder Press', category: 'shoulders', description: '肩の基本種目' },
    { name: 'サイドレイズ', nameEn: 'Lateral Raise', category: 'shoulders', description: '肩の幅を作る' },
    { name: 'フロントレイズ', nameEn: 'Front Raise', category: 'shoulders', description: '前三角筋を鍛える' },
    { name: 'リアデルトフライ', nameEn: 'Rear Delt Fly', category: 'shoulders', description: '後三角筋を鍛える' },

    // Arms
    { name: 'バーベルカール', nameEn: 'Barbell Curl', category: 'arms', description: '上腕二頭筋の基本種目' },
    { name: 'ダンベルカール', nameEn: 'Dumbbell Curl', category: 'arms', description: '上腕二頭筋を鍛える' },
    { name: 'トライセップスプッシュダウン', nameEn: 'Triceps Pushdown', category: 'arms', description: '上腕三頭筋を鍛える' },
    { name: 'オーバーヘッドエクステンション', nameEn: 'Overhead Extension', category: 'arms', description: '上腕三頭筋を鍛える' },

    // Abs
    { name: 'クランチ', nameEn: 'Crunch', category: 'abs', description: '腹筋の基本種目' },
    { name: 'プランク', nameEn: 'Plank', category: 'abs', description: '体幹を鍛える' },
    { name: 'レッグレイズ', nameEn: 'Leg Raise', category: 'abs', description: '下腹部を鍛える' },
    { name: 'ロシアンツイスト', nameEn: 'Russian Twist', category: 'abs', description: '腹斜筋を鍛える' },

    // Full Body
    { name: 'バーピー', nameEn: 'Burpee', category: 'full', description: '全身を使った有酸素運動' },
    { name: 'マウンテンクライマー', nameEn: 'Mountain Climber', category: 'full', description: '全身の筋力と持久力を鍛える' },
    { name: 'ケトルベルスイング', nameEn: 'Kettlebell Swing', category: 'full', description: '全身の爆発力を鍛える' },
  ]

  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise,
    })
  }

  console.log('✅ Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
