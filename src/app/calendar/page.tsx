"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Dumbbell, Clock, Weight, Trash2, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import { ja } from "date-fns/locale"

interface Workout {
  id: string
  date: string
  startTime?: string
  endTime?: string
  totalVolume?: number
  memo?: string
  sets: {
    id: string
    exercise: {
      name: string
      category: string
    }
    weight: number
    reps: number
    rpe?: number
  }[]
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

const categoryColors: Record<string, string> = {
  chest: "bg-red-100 text-red-800",
  back: "bg-blue-100 text-blue-800",
  legs: "bg-green-100 text-green-800",
  shoulders: "bg-yellow-100 text-yellow-800",
  arms: "bg-purple-100 text-purple-800",
  abs: "bg-orange-100 text-orange-800",
  full: "bg-gray-100 text-gray-800"
}

export default function CalendarPage() {
  const { data: session } = useSession()
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [expandedWorkout, setExpandedWorkout] = useState<string | null>(null)

  useEffect(() => {
    fetchWorkouts()
  }, [])

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

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter(workout =>
      isSameDay(new Date(workout.date), date)
    )
  }

  const getWorkoutStats = (workouts: Workout[]) => {
    const totalSets = workouts.reduce((sum, workout) => sum + workout.sets.length, 0)
    const totalVolume = workouts.reduce((sum, workout) => sum + (workout.totalVolume || 0), 0)
    const uniqueExercises = new Set(workouts.flatMap(workout =>
      workout.sets.map(set => set.exercise.name)
    )).size

    return { totalSets, totalVolume, uniqueExercises }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const deleteWorkout = async (workoutId: string) => {
    setDeletingId(workoutId)
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setWorkouts(workouts.filter(w => w.id !== workoutId))
        setShowDeleteConfirm(null)
      } else {
        alert('削除に失敗しました')
      }
    } catch (error) {
      console.error('Failed to delete workout:', error)
      alert('削除に失敗しました')
    } finally {
      setDeletingId(null)
    }
  }

  const selectedDateWorkouts = selectedDate ? getWorkoutsForDate(selectedDate) : []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>カレンダーを読み込み中...</p>
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
            <h1 className="text-base sm:text-xl font-bold text-cyan-400 neon-text ml-2 sm:ml-4">TRAINING CALENDAR</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="glass-morphism border-cyan-500/20">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-cyan-400">
                    {format(currentMonth, 'yyyy年M月', { locale: ja })}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="bg-gray-900/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      ←
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="bg-gray-900/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                    >
                      →
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                    <div key={day} className="text-center text-xs sm:text-sm font-medium text-cyan-400/70 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {daysInMonth.map(day => {
                    const dayWorkouts = getWorkoutsForDate(day)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const isCurrentMonth = isSameMonth(day, currentMonth)

                    return (
                      <div
                        key={day.toISOString()}
                        className={`
                          aspect-square p-1 sm:p-2 border rounded cursor-pointer transition-all
                          ${isCurrentMonth ? 'bg-gray-900/50 border-cyan-500/20 text-cyan-300' : 'bg-gray-900/20 text-cyan-300/30 border-cyan-500/10'}
                          ${isSelected ? 'bg-cyan-500/20 border-cyan-400 neon-glow' : ''}
                          ${dayWorkouts.length > 0 ? 'border-green-400/50 bg-green-500/10' : ''}
                          hover:bg-cyan-500/10 hover:border-cyan-400/50
                        `}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="text-xs sm:text-sm font-medium mb-0.5 sm:mb-1">
                          {format(day, 'd')}
                        </div>
                        {dayWorkouts.length > 0 && (
                          <div className="text-[10px] sm:text-xs text-green-400">
                            {dayWorkouts.length}回
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Date Details */}
          <div>
            <Card className="glass-morphism border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">
                  {selectedDate ? format(selectedDate, 'M月d日', { locale: ja }) : '日付を選択'}
                </CardTitle>
                <CardDescription className="text-purple-200/50">
                  {selectedDate ? 'その日のトレーニング詳細' : 'カレンダーから日付を選択してください'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateWorkouts.length === 0 ? (
                  <div className="text-center text-cyan-200/50 py-8">
                    {selectedDate ? 'この日はトレーニングがありません' : '日付を選択してください'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateWorkouts.map(workout => {
                      const stats = getWorkoutStats([workout])
                      const exerciseCategories = [...new Set(workout.sets.map(set => set.exercise.category))]

                      return (
                        <div key={workout.id} className="glass-morphism border-purple-500/20 rounded-lg p-3 sm:p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-purple-300 text-sm sm:text-base">トレーニング</h3>
                              {workout.startTime && (
                                <p className="text-xs sm:text-sm text-purple-200/50">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {format(new Date(workout.startTime), 'HH:mm')}
                                </p>
                              )}
                            </div>
                            <div className="text-right text-xs sm:text-sm">
                              <div className="flex items-center text-purple-200/70">
                                <Dumbbell className="h-3 w-3 mr-1" />
                                {stats.totalSets}セット
                              </div>
                              <div className="flex items-center text-purple-200/70">
                                <Weight className="h-3 w-3 mr-1" />
                                {stats.totalVolume.toLocaleString()}kg
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {exerciseCategories.map(category => (
                              <Badge
                                key={category}
                                className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300"
                              >
                                {categoryLabels[category]}
                              </Badge>
                            ))}
                          </div>

                          {workout.memo && (
                            <p className="text-xs sm:text-sm text-purple-200/60 bg-purple-500/5 p-2 rounded">
                              {workout.memo}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Workout History List */}
        <div className="mt-8">
          <Card className="glass-morphism border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-cyan-400">トレーニング履歴</CardTitle>
              <CardDescription className="text-cyan-200/50">全てのトレーニング記録 ({workouts.length}件)</CardDescription>
            </CardHeader>
            <CardContent>
              {workouts.length === 0 ? (
                <div className="text-center text-cyan-200/50 py-8">
                  まだトレーニング記録がありません
                </div>
              ) : (
                <div className="space-y-3">
                  {workouts.map(workout => {
                    const stats = getWorkoutStats([workout])
                    const exerciseCategories = [...new Set(workout.sets.map(set => set.exercise.category))]
                    const isExpanded = expandedWorkout === workout.id

                    // Group sets by exercise
                    const exerciseGroups = workout.sets.reduce((acc, set) => {
                      const exerciseName = set.exercise.name
                      if (!acc[exerciseName]) {
                        acc[exerciseName] = []
                      }
                      acc[exerciseName].push(set)
                      return acc
                    }, {} as Record<string, typeof workout.sets>)

                    return (
                      <div key={workout.id} className="glass-morphism border-cyan-500/20 rounded-lg p-3 sm:p-4 hover:border-cyan-400/40 transition-all">
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-cyan-300 font-semibold text-sm sm:text-base">
                                {format(new Date(workout.date), 'yyyy年M月d日(E)', { locale: ja })}
                              </div>
                              {workout.startTime && (
                                <div className="text-xs text-cyan-200/50">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {format(new Date(workout.startTime), 'HH:mm')}
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2">
                              {exerciseCategories.map(category => (
                                <Badge
                                  key={category}
                                  className="text-xs bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300"
                                >
                                  {categoryLabels[category]}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                              <div className="flex items-center text-cyan-200/70">
                                <Dumbbell className="h-3 w-3 mr-1" />
                                {stats.totalSets}セット
                              </div>
                              <div className="flex items-center text-cyan-200/70">
                                <Weight className="h-3 w-3 mr-1" />
                                {stats.totalVolume.toLocaleString()}kg
                              </div>
                              <div className="flex items-center text-cyan-200/70">
                                <Calendar className="h-3 w-3 mr-1" />
                                {stats.uniqueExercises}種目
                              </div>
                            </div>

                            {workout.memo && (
                              <p className="text-xs sm:text-sm text-cyan-200/60 bg-cyan-500/5 p-2 rounded mt-2">
                                {workout.memo}
                              </p>
                            )}

                            {/* Exercise Details */}
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-cyan-500/20">
                                <div className="space-y-3">
                                  {Object.entries(exerciseGroups).map(([exerciseName, sets]) => (
                                    <div key={exerciseName} className="bg-cyan-500/5 rounded-lg p-2 sm:p-3">
                                      <div className="font-semibold text-cyan-300 text-xs sm:text-sm mb-2">
                                        {exerciseName}
                                      </div>
                                      <div className="space-y-1">
                                        {sets.map((set, idx) => (
                                          <div key={set.id} className="flex items-center justify-between text-xs text-cyan-200/70">
                                            <span className="text-cyan-400/50">セット{idx + 1}</span>
                                            <div className="flex items-center gap-3">
                                              <span>{set.weight}kg</span>
                                              <span>×</span>
                                              <span>{set.reps}回</span>
                                              {set.rpe && (
                                                <span className="text-cyan-400/70">RPE: {set.rpe}</span>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Toggle Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedWorkout(isExpanded ? null : workout.id)}
                              className="mt-2 h-7 text-xs text-cyan-400 hover:bg-cyan-500/10 w-full"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-3 w-3 mr-1" />
                                  閉じる
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3 mr-1" />
                                  種目を見る
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="flex-shrink-0">
                            {showDeleteConfirm === workout.id ? (
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteWorkout(workout.id)}
                                  disabled={deletingId === workout.id}
                                  className="h-8 text-xs bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30"
                                >
                                  {deletingId === workout.id ? (
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-300" />
                                  ) : (
                                    <>
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      削除
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setShowDeleteConfirm(null)}
                                  className="h-8 text-xs bg-gray-800/50 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                                >
                                  キャンセル
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowDeleteConfirm(workout.id)}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
