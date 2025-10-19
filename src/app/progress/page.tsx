"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, Calendar, Dumbbell, Target, Award } from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns"
import { ja } from "date-fns/locale"

interface Workout {
  id: string
  date: string
  totalVolume?: number
  sets: {
    exercise: {
      name: string
      category: string
    }
    weight: number
    reps: number
  }[]
}

interface WeeklyStats {
  date: string
  workouts: number
  totalVolume: number
  totalSets: number
}

interface CategoryStats {
  category: string
  count: number
  totalVolume: number
}

const categoryLabels: Record<string, string> = {
  chest: "胸",
  back: "背中",
  legs: "脚",
  shoulders: "肩",
  arms: "腕",
  abs: "腹筋",
  full: "全身"
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658']

export default function ProgressPage() {
  const { data: session } = useSession()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([])
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  useEffect(() => {
    fetchWorkouts()
  }, [])

  useEffect(() => {
    if (workouts.length > 0) {
      generateStats()
    }
  }, [workouts, timeRange])

  const fetchWorkouts = async () => {
    try {
      const response = await fetch("/api/workouts")
      if (response.ok) {
        const data = await response.json()
        setWorkouts(data)
      }
    } catch (error) {
      console.error("Failed to fetch workouts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateStats = () => {
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case 'week':
        startDate = startOfWeek(subDays(now, 7))
        break
      case 'month':
        startDate = subDays(now, 30)
        break
      case 'year':
        startDate = subDays(now, 365)
        break
    }

    const filteredWorkouts = workouts.filter(workout =>
      new Date(workout.date) >= startDate
    )

    // Generate weekly stats
    const weeklyData: WeeklyStats[] = []
    const days = eachDayOfInterval({ start: startDate, end: now })

    days.forEach(day => {
      const dayWorkouts = filteredWorkouts.filter(workout =>
        format(new Date(workout.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )

      const totalVolume = dayWorkouts.reduce((sum, workout) => sum + (workout.totalVolume || 0), 0)
      const totalSets = dayWorkouts.reduce((sum, workout) => sum + workout.sets.length, 0)

      weeklyData.push({
        date: format(day, 'M/d'),
        workouts: dayWorkouts.length,
        totalVolume,
        totalSets
      })
    })

    setWeeklyStats(weeklyData)

    // Generate category stats
    const categoryMap = new Map<string, CategoryStats>()

    filteredWorkouts.forEach(workout => {
      workout.sets.forEach(set => {
        const category = set.exercise.category
        const existing = categoryMap.get(category) || { category, count: 0, totalVolume: 0 }

        categoryMap.set(category, {
          category,
          count: existing.count + 1,
          totalVolume: existing.totalVolume + (set.weight * set.reps)
        })
      })
    })

    setCategoryStats(Array.from(categoryMap.values()).sort((a, b) => b.totalVolume - a.totalVolume))
  }

  const getTotalStats = () => {
    const totalWorkouts = workouts.length
    const totalVolume = workouts.reduce((sum, workout) => sum + (workout.totalVolume || 0), 0)
    const totalSets = workouts.reduce((sum, workout) => sum + workout.sets.length, 0)
    const uniqueExercises = new Set(workouts.flatMap(workout =>
      workout.sets.map(set => set.exercise.name)
    )).size

    return { totalWorkouts, totalVolume, totalSets, uniqueExercises }
  }

  const stats = getTotalStats()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>進捗データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-4">進捗グラフ</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              onClick={() => setTimeRange('week')}
            >
              1週間
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              onClick={() => setTimeRange('month')}
            >
              1ヶ月
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'outline'}
              onClick={() => setTimeRange('year')}
            >
              1年
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総トレーニング回数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
              <p className="text-xs text-gray-500">回</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総セット数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSets}</div>
              <p className="text-xs text-gray-500">セット</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">総重量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVolume.toLocaleString()}</div>
              <p className="text-xs text-gray-500">kg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">種目数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueExercises}</div>
              <p className="text-xs text-gray-500">種目</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Volume Trend */}
          <Card>
            <CardHeader>
              <CardTitle>総重量の推移</CardTitle>
              <CardDescription>日別の総重量を表示</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="totalVolume" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Workout Frequency */}
          <Card>
            <CardHeader>
              <CardTitle>トレーニング頻度</CardTitle>
              <CardDescription>日別のトレーニング回数</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="workouts" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>部位別トレーニング量</CardTitle>
              <CardDescription>総重量での部位別分布</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${categoryLabels[category]} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalVolume"
                  >
                    {categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>部位別セット数</CardTitle>
              <CardDescription>セット数での部位別分布</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryStats.map((stat, index) => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">
                        {categoryLabels[stat.category]}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{stat.count}セット</div>
                      <div className="text-xs text-gray-500">
                        {stat.totalVolume.toLocaleString()}kg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
