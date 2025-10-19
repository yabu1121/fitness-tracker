"use client"

import { useSession, signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Dumbbell, TrendingUp, User, LogOut } from "lucide-react"

interface WeeklyStats {
  workoutsThisWeek: number
  totalSets: number
  totalVolume: number
  weeklyGoal: number
}

interface UserProfile {
  name: string
  weeklyGoal: number
}

export default function HomePage() {
  const { data: session } = useSession()
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: "", weeklyGoal: 3 })
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    workoutsThisWeek: 0,
    totalSets: 0,
    totalVolume: 0,
    weeklyGoal: 3,
  })
  useEffect(() => {
    fetchUserProfile()
    fetchWeeklyStats()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setUserProfile({ name: data.name || "ゲスト", weeklyGoal: data.weeklyGoal || 3 })
        setWeeklyStats(prev => ({ ...prev, weeklyGoal: data.weeklyGoal || 3 }))
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    }
  }

  const fetchWeeklyStats = async () => {
    try {
      const response = await fetch("/api/workouts")
      if (response.ok) {
        const workouts = await response.json()

        // Calculate this week's stats
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)

        const weekWorkouts = workouts.filter((w: any) =>
          new Date(w.date) >= startOfWeek
        )

        const totalSets = weekWorkouts.reduce((sum: number, w: any) =>
          sum + w.sets.length, 0
        )
        const totalVolume = weekWorkouts.reduce((sum: number, w: any) =>
          sum + (w.totalVolume || 0), 0
        )

        setWeeklyStats(prev => ({
          ...prev,
          workoutsThisWeek: weekWorkouts.length,
          totalSets,
          totalVolume,
        }))
      }
    } catch (error) {
      console.error("Failed to fetch workouts:", error)
    }
  }

  const progressPercentage = weeklyStats.weeklyGoal > 0
    ? (weeklyStats.workoutsThisWeek / weeklyStats.weeklyGoal) * 100
    : 0

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="glass-morphism border-b border-cyan-500/20 relative z-10 neon-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 neon-glow" />
              <h1 className="text-base sm:text-xl font-bold text-cyan-400 neon-text">
                <span className="hidden sm:inline">FITNESS TRACKER</span>
                <span className="sm:hidden">HOME</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-cyan-200/70 hidden sm:inline">こんにちは、{userProfile.name || session?.user?.name}さん</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut()}
                className="h-8 bg-gray-900/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">ログアウト</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-8 relative z-10">

        {/* Weekly Progress */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-3 sm:mb-8">
          <Card className="glass-morphism border-cyan-500/20 hover:border-cyan-400/40 transition-all hover:neon-glow">
            <CardHeader className="pb-1 sm:pb-2 pt-2 sm:pt-6 px-2 sm:px-6">
              <CardTitle className="text-[10px] sm:text-sm font-medium text-cyan-400">今週</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2 sm:pb-6 px-2 sm:px-6">
              <div className="text-lg sm:text-2xl font-bold text-cyan-300">{weeklyStats.workoutsThisWeek}</div>
              <p className="text-[10px] sm:text-xs text-cyan-200/50">{weeklyStats.weeklyGoal}回目標</p>
              <Progress value={progressPercentage} className="mt-1 sm:mt-2 h-1 bg-gray-800" />
            </CardContent>
          </Card>

          <Card className="glass-morphism border-purple-500/20 hover:border-purple-400/40 transition-all hover:neon-glow-purple">
            <CardHeader className="pb-1 sm:pb-2 pt-2 sm:pt-6 px-2 sm:px-6">
              <CardTitle className="text-[10px] sm:text-sm font-medium text-purple-400">セット数</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2 sm:pb-6 px-2 sm:px-6">
              <div className="text-lg sm:text-2xl font-bold text-purple-300">{weeklyStats.totalSets}</div>
              <p className="text-[10px] sm:text-xs text-purple-200/50">セット</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-pink-500/20 hover:border-pink-400/40 transition-all hover:neon-glow-pink">
            <CardHeader className="pb-1 sm:pb-2 pt-2 sm:pt-6 px-2 sm:px-6">
              <CardTitle className="text-[10px] sm:text-sm font-medium text-pink-400">総重量</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2 sm:pb-6 px-2 sm:px-6">
              <div className="text-lg sm:text-2xl font-bold text-pink-300">{weeklyStats.totalVolume.toLocaleString()}</div>
              <p className="text-[10px] sm:text-xs text-pink-200/50">kg</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-green-500/20 hover:border-green-400/40 transition-all">
            <CardHeader className="pb-1 sm:pb-2 pt-2 sm:pt-6 px-2 sm:px-6">
              <CardTitle className="text-[10px] sm:text-sm font-medium text-green-400">進捗率</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-2 sm:pb-6 px-2 sm:px-6">
              <div className="text-lg sm:text-2xl font-bold text-green-300">{Math.round(progressPercentage)}%</div>
              <p className="text-[10px] sm:text-xs text-green-200/50">達成率</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-3 sm:mb-8">
          <Link href="/workout/quick">
            <Card className="glass-morphism border-cyan-500/40 hover:border-cyan-400 transition-all cursor-pointer group hover:neon-glow relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-2.5 sm:p-6 text-center relative z-10">
                <Dumbbell className="h-7 w-7 sm:h-12 sm:w-12 text-cyan-400 mx-auto mb-1 sm:mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs sm:text-lg font-semibold text-cyan-300">クイック記録 ⚡</h3>
                <p className="text-[10px] sm:text-sm text-cyan-200/50 hidden sm:block">1分で簡単に記録</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/calendar">
            <Card className="glass-morphism border-green-500/40 hover:border-green-400 transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-2.5 sm:p-6 text-center relative z-10">
                <Calendar className="h-7 w-7 sm:h-12 sm:w-12 text-green-400 mx-auto mb-1 sm:mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs sm:text-lg font-semibold text-green-300">カレンダー</h3>
                <p className="text-[10px] sm:text-sm text-green-200/50 hidden sm:block">過去の記録を確認</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/progress">
            <Card className="glass-morphism border-purple-500/40 hover:border-purple-400 transition-all cursor-pointer group hover:neon-glow-purple relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-2.5 sm:p-6 text-center relative z-10">
                <TrendingUp className="h-7 w-7 sm:h-12 sm:w-12 text-purple-400 mx-auto mb-1 sm:mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs sm:text-lg font-semibold text-purple-300">進捗グラフ</h3>
                <p className="text-[10px] sm:text-sm text-purple-200/50 hidden sm:block">成長を可視化</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="glass-morphism border-orange-500/40 hover:border-orange-400 transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="p-2.5 sm:p-6 text-center relative z-10">
                <User className="h-7 w-7 sm:h-12 sm:w-12 text-orange-400 mx-auto mb-1 sm:mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xs sm:text-lg font-semibold text-orange-300">プロフィール</h3>
                <p className="text-[10px] sm:text-sm text-orange-200/50 hidden sm:block">設定と目標管理</p>
              </CardContent>
            </Card>
          </Link>
        </div>

      </main>
    </div>
  )
}