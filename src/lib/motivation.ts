interface WorkoutStats {
  workoutsThisWeek: number
  weeklyGoal: number
  totalWorkouts: number
  lastWorkoutDate?: Date
  streakDays: number
  averageWorkoutsPerWeek: number
}

interface MotivationalMessage {
  message: string
  type: "encouragement" | "achievement" | "reminder" | "celebration"
  emoji: string
}

export class MotivationalMessageGenerator {
  private static readonly MESSAGE_TEMPLATES = {
    encouragement: [
      { message: "今日も素晴らしいトレーニングを！💪", emoji: "💪" },
      { message: "小さな一歩が大きな変化を生みます 🌟", emoji: "🌟" },
      { message: "継続は力なり！頑張りましょう 🚀", emoji: "🚀" },
      { message: "今日は新しい記録を目指してみませんか？ 📈", emoji: "📈" },
      { message: "あなたの努力は必ず実を結びます 🌱", emoji: "🌱" },
      { message: "一歩ずつ、着実に前進しましょう 👣", emoji: "👣" },
      { message: "今日のトレーニングで、より強くなりましょう 💎", emoji: "💎" },
      { message: "健康な体は最高の投資です 💰", emoji: "💰" },
    ],
    achievement: [
      { message: "週の目標を達成しました！おめでとうございます 🎉", emoji: "🎉" },
      { message: "素晴らしい継続力です！👏", emoji: "👏" },
      { message: "目標を超えるパフォーマンスです！🏆", emoji: "🏆" },
      { message: "あなたの努力が実を結んでいます！🌻", emoji: "🌻" },
      { message: "完璧な週でした！🎯", emoji: "🎯" },
    ],
    reminder: [
      { message: "週の目標まであと少し！頑張りましょう 💪", emoji: "💪" },
      { message: "目標達成まであと一歩です！🚀", emoji: "🚀" },
      { message: "今週も良いスタートを切りましょう！⭐", emoji: "⭐" },
      { message: "継続が成功の鍵です！🔑", emoji: "🔑" },
    ],
    celebration: [
      { message: "新しい記録達成！素晴らしいです！🎊", emoji: "🎊" },
      { message: "連続トレーニング記録更新！🔥", emoji: "🔥" },
      { message: "目標を大幅に上回りました！🌟", emoji: "🌟" },
      { message: "あなたは本当に素晴らしいです！✨", emoji: "✨" },
    ]
  }

  static generateMessage(stats: WorkoutStats): MotivationalMessage {
    const { workoutsThisWeek, weeklyGoal, totalWorkouts, streakDays, averageWorkoutsPerWeek } = stats

    // Celebration messages for exceptional performance
    if (workoutsThisWeek >= weeklyGoal * 1.5) {
      return this.getRandomMessage('celebration')
    }

    // Achievement messages for meeting goals
    if (workoutsThisWeek >= weeklyGoal) {
      return this.getRandomMessage('achievement')
    }

    // Reminder messages when close to goal
    if (workoutsThisWeek >= weeklyGoal * 0.7) {
      return this.getRandomMessage('reminder')
    }

    // Special messages for milestones
    if (totalWorkouts === 1) {
      return {
        message: "初回トレーニングおめでとう！素晴らしいスタートです！🎉",
        type: "celebration",
        emoji: "🎉"
      }
    }

    if (totalWorkouts === 10) {
      return {
        message: "10回目のトレーニング達成！継続の力が身についています！💪",
        type: "achievement",
        emoji: "💪"
      }
    }

    if (totalWorkouts === 50) {
      return {
        message: "50回達成！あなたは真のトレーニーです！🏆",
        type: "celebration",
        emoji: "🏆"
      }
    }

    if (streakDays >= 7) {
      return {
        message: `${streakDays}日連続！素晴らしい継続力です！🔥`,
        type: "achievement",
        emoji: "🔥"
      }
    }

    // Time-based messages
    const now = new Date()
    const hour = now.getHours()

    if (hour >= 5 && hour < 12) {
      return {
        message: "おはようございます！今日も素晴らしい一日を！☀️",
        type: "encouragement",
        emoji: "☀️"
      }
    }

    if (hour >= 12 && hour < 18) {
      return {
        message: "午後のトレーニングでエネルギーをチャージ！⚡",
        type: "encouragement",
        emoji: "⚡"
      }
    }

    if (hour >= 18 && hour < 22) {
      return {
        message: "夕方のトレーニングで一日を締めくくりましょう！🌅",
        type: "encouragement",
        emoji: "🌅"
      }
    }

    // Default encouragement message
    return this.getRandomMessage('encouragement')
  }

  private static getRandomMessage(type: keyof typeof MotivationalMessageGenerator.MESSAGE_TEMPLATES): MotivationalMessage {
    const templates = this.MESSAGE_TEMPLATES[type]
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]

    return {
      message: randomTemplate.message,
      type: type,
      emoji: randomTemplate.emoji
    }
  }

  static generateWorkoutCompletionMessage(workoutStats: {
    totalSets: number
    totalVolume: number
    duration: number
    exercises: string[]
  }): MotivationalMessage {
    const { totalSets, totalVolume, exercises } = workoutStats

    // High volume workout
    if (totalVolume > 3000) {
      return {
        message: `驚異的な${totalVolume.toLocaleString()}kg！あなたは本当に強いです！💪`,
        type: "celebration",
        emoji: "💪"
      }
    }

    // Many sets
    if (totalSets > 20) {
      return {
        message: `${totalSets}セット完走！素晴らしい持久力です！🏃‍♂️`,
        type: "achievement",
        emoji: "🏃‍♂️"
      }
    }

    // Variety of exercises
    if (exercises.length >= 5) {
      return {
        message: `${exercises.length}種目をこなしました！バランスの良いトレーニングです！⚖️`,
        type: "achievement",
        emoji: "⚖️"
      }
    }

    // Default completion message
    const messages = [
      "お疲れ様でした！素晴らしいトレーニングでした！👏",
      "完璧なセッションでした！🎯",
      "今日も一歩前進しました！🚀",
      "継続の力が身についています！💎",
      "あなたの努力が実を結んでいます！🌱"
    ]

    const randomMessage = messages[Math.floor(Math.random() * messages.length)]

    return {
      message: randomMessage,
      type: "achievement",
      emoji: "🎉"
    }
  }

  static generateProgressMessage(progress: {
    volumeIncrease: number
    strengthIncrease: number
    consistencyScore: number
  }): MotivationalMessage {
    const { volumeIncrease, strengthIncrease, consistencyScore } = progress

    // Significant progress
    if (volumeIncrease > 20 || strengthIncrease > 15) {
      return {
        message: "驚異的な進歩です！あなたの成長は止まりません！📈",
        type: "celebration",
        emoji: "📈"
      }
    }

    // Good consistency
    if (consistencyScore > 80) {
      return {
        message: "素晴らしい継続力！習慣化が成功しています！🎯",
        type: "achievement",
        emoji: "🎯"
      }
    }

    // Steady progress
    if (volumeIncrease > 5 || strengthIncrease > 3) {
      return {
        message: "着実な成長を感じます！この調子で頑張りましょう！🌱",
        type: "achievement",
        emoji: "🌱"
      }
    }

    // Default progress message
    return {
      message: "毎日の積み重ねが大きな変化を生みます！💪",
      type: "encouragement",
      emoji: "💪"
    }
  }
}
