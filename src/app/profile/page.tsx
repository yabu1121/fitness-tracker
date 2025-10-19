"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Target, Settings, LogOut, Save } from "lucide-react"
import Link from "next/link"

interface UserProfile {
  id: string
  name: string
  email: string
  height?: number
  gender?: string
  birthDate?: string
  goalWeight?: number
  goalDate?: string
  goalPurpose?: string
  weeklyGoal?: number
  defaultUnit: string
}

interface Stats {
  totalWorkouts: number
  workoutsThisWeek: number
  streakDays: number
  achievementRate: number
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile>({
    id: "",
    name: "",
    email: "",
    defaultUnit: "kg"
  })
  const [stats, setStats] = useState<Stats>({
    totalWorkouts: 0,
    workoutsThisWeek: 0,
    streakDays: 0,
    achievementRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchProfile()
    fetchStats()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/workouts")
      if (response.ok) {
        const workouts = await response.json()

        // Total workouts
        const totalWorkouts = workouts.length

        // This week's workouts
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)

        const weekWorkouts = workouts.filter((w: any) =>
          new Date(w.date) >= startOfWeek
        )
        const workoutsThisWeek = weekWorkouts.length

        // Calculate streak days
        let streakDays = 0
        const sortedWorkouts = [...workouts].sort((a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )

        if (sortedWorkouts.length > 0) {
          let currentDate = new Date()
          currentDate.setHours(0, 0, 0, 0)

          for (const workout of sortedWorkouts) {
            const workoutDate = new Date(workout.date)
            workoutDate.setHours(0, 0, 0, 0)

            const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))

            if (diffDays <= streakDays + 1) {
              streakDays++
              currentDate = workoutDate
            } else {
              break
            }
          }
        }

        // Achievement rate (weekly goal)
        const weeklyGoal = profile.weeklyGoal || 3
        const achievementRate = weeklyGoal > 0
          ? Math.round((workoutsThisWeek / weeklyGoal) * 100)
          : 0

        setStats({
          totalWorkouts,
          workoutsThisWeek,
          streakDays,
          achievementRate
        })
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        setMessage("プロフィールが更新されました")
      } else {
        setMessage("プロフィールの更新に失敗しました")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      setMessage("プロフィールの更新に失敗しました")
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>プロフィールを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="glass-morphism border-b border-cyan-500/20 relative z-10 neon-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center h-14 sm:h-16">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-cyan-400 hover:bg-cyan-500/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <h1 className="text-base sm:text-xl font-bold text-cyan-400 neon-text ml-2 sm:ml-4">PROFILE</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Profile Settings */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Basic Information */}
            <Card className="glass-morphism border-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-cyan-400">
                  <User className="h-5 w-5 mr-2" />
                  基本情報
                </CardTitle>
                <CardDescription className="text-cyan-200/50">アカウントの基本情報を設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-cyan-300">お名前</Label>
                    <Input
                      id="name"
                      value={profile.name || ""}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="お名前を入力"
                      className="bg-gray-900/50 border-cyan-500/30 text-cyan-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-cyan-300">メールアドレス</Label>
                    <Input
                      id="email"
                      value={profile.email || ""}
                      disabled
                      className="bg-gray-800/50 border-cyan-500/20 text-cyan-400/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="height" className="text-cyan-300">身長 (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={profile.height || ""}
                      onChange={(e) => handleChange('height', parseFloat(e.target.value) || undefined)}
                      placeholder="170"
                      className="bg-gray-900/50 border-cyan-500/30 text-cyan-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender" className="text-cyan-300">性別</Label>
                    <Select value={profile.gender || ""} onValueChange={(value) => handleChange('gender', value)}>
                      <SelectTrigger className="bg-gray-900/50 border-cyan-500/30 text-cyan-300">
                        <SelectValue placeholder="性別を選択" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-cyan-500/30">
                        <SelectItem value="male" className="text-cyan-300">男性</SelectItem>
                        <SelectItem value="female" className="text-cyan-300">女性</SelectItem>
                        <SelectItem value="other" className="text-cyan-300">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="birthDate" className="text-cyan-300">生年月日</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profile.birthDate || ""}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    className="bg-gray-900/50 border-cyan-500/30 text-cyan-300"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card className="glass-morphism border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-400">
                  <Target className="h-5 w-5 mr-2" />
                  目標設定
                </CardTitle>
                <CardDescription className="text-purple-200/50">トレーニングの目標を設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goalWeight" className="text-purple-300">目標体重 (kg)</Label>
                    <Input
                      id="goalWeight"
                      type="number"
                      step="0.1"
                      value={profile.goalWeight || ""}
                      onChange={(e) => handleChange('goalWeight', parseFloat(e.target.value) || undefined)}
                      placeholder="65.0"
                      className="bg-gray-900/50 border-purple-500/30 text-purple-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goalDate" className="text-purple-300">目標達成日</Label>
                    <Input
                      id="goalDate"
                      type="date"
                      value={profile.goalDate || ""}
                      onChange={(e) => handleChange('goalDate', e.target.value)}
                      className="bg-gray-900/50 border-purple-500/30 text-purple-300"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="goalPurpose" className="text-purple-300">目標の目的</Label>
                  <Select value={profile.goalPurpose || ""} onValueChange={(value) => handleChange('goalPurpose', value)}>
                    <SelectTrigger className="bg-gray-900/50 border-purple-500/30 text-purple-300">
                      <SelectValue placeholder="目的を選択" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-purple-500/30">
                      <SelectItem value="muscle_gain" className="text-purple-300">筋肥大</SelectItem>
                      <SelectItem value="weight_loss" className="text-purple-300">ダイエット</SelectItem>
                      <SelectItem value="health" className="text-purple-300">健康維持</SelectItem>
                      <SelectItem value="strength" className="text-purple-300">筋力向上</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weeklyGoal" className="text-purple-300">週の目標回数</Label>
                    <Input
                      id="weeklyGoal"
                      type="number"
                      min="1"
                      max="7"
                      value={profile.weeklyGoal || ""}
                      onChange={(e) => handleChange('weeklyGoal', parseInt(e.target.value) || undefined)}
                      placeholder="3"
                      className="bg-gray-900/50 border-purple-500/30 text-purple-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultUnit" className="text-purple-300">デフォルト単位</Label>
                    <Select value={profile.defaultUnit} onValueChange={(value) => handleChange('defaultUnit', value)}>
                      <SelectTrigger className="bg-gray-900/50 border-purple-500/30 text-purple-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-purple-500/30">
                        <SelectItem value="kg" className="text-purple-300">kg</SelectItem>
                        <SelectItem value="lbs" className="text-purple-300">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="min-w-[120px] bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 neon-glow"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </>
                )}
              </Button>
            </div>

            {message && (
              <div className={`p-4 rounded-lg border ${message.includes('失敗')
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-green-500/10 border-green-500/30 text-green-300'
                }`}>
                {message}
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div>
            <Card className="glass-morphism border-orange-500/20">
              <CardHeader>
                <CardTitle className="flex items-center text-orange-400">
                  <Settings className="h-5 w-5 mr-2" />
                  アカウント
                </CardTitle>
                <CardDescription className="text-orange-200/50">アカウントの管理</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-cyan-300/70">
                  <p className="font-medium text-cyan-300">アカウント情報</p>
                  <p className="mt-1">登録日: {new Date().toLocaleDateString('ja-JP')}</p>
                  <p>メール: {profile.email}</p>
                </div>

                <Button
                  variant="outline"
                  className="w-full justify-start bg-gray-900/50 border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-400"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  ログアウト
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6 glass-morphism border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">統計情報</CardTitle>
                <CardDescription className="text-cyan-200/50">あなたの活動状況</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-cyan-300/70">総トレーニング回数</span>
                  <span className="font-semibold text-cyan-300">{stats.totalWorkouts}回</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cyan-300/70">今週のトレーニング</span>
                  <span className="font-semibold text-purple-300">{stats.workoutsThisWeek}回</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cyan-300/70">継続日数</span>
                  <span className="font-semibold text-pink-300">{stats.streakDays}日</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-cyan-300/70">目標達成率</span>
                  <span className={`font-semibold ${stats.achievementRate >= 100 ? 'text-green-400' : stats.achievementRate >= 70 ? 'text-yellow-400' : 'text-orange-400'}`}>
                    {stats.achievementRate}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
