"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Trash2, Check, Search } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Exercise {
  id: string
  name: string
  nameEn?: string
  category: string
}

interface QuickSet {
  id: string
  exerciseId: string
  exerciseName: string
  weight: number
  reps: number
}

const categoryLabels: Record<string, string> = {
  chest: "胸", back: "背中", legs: "脚", shoulders: "肩",
  arms: "腕", abs: "腹筋", full: "全身"
}

export default function QuickWorkoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [sets, setSets] = useState<QuickSet[]>([])
  const [selectedExerciseId, setSelectedExerciseId] = useState("")
  const [quickWeight, setQuickWeight] = useState(20)
  const [quickReps, setQuickReps] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/exercises")
      if (response.ok) {
        const data = await response.json()
        setExercises(data)
        if (data.length > 0) {
          setSelectedExerciseId(data[0].id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch exercises:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || ex.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularExercises = exercises.filter(ex =>
    ['ベンチプレス', 'スクワット', 'デッドリフト', 'ショルダープレス', 'ラットプルダウン'].includes(ex.name)
  )

  // Auto-select first exercise when category changes
  useEffect(() => {
    if (filteredExercises.length > 0 && !filteredExercises.find(ex => ex.id === selectedExerciseId)) {
      setSelectedExerciseId(filteredExercises[0].id)
    }
  }, [selectedCategory, filteredExercises, selectedExerciseId])

  // Get exercise count by category
  const getCategoryCount = (category: string) => {
    if (category === "all") return exercises.length
    return exercises.filter(ex => ex.category === category).length
  }

  const addSet = () => {
    if (!selectedExerciseId) return

    const exercise = exercises.find(ex => ex.id === selectedExerciseId)
    if (!exercise) return

    const newSet: QuickSet = {
      id: Date.now().toString(),
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      weight: quickWeight,
      reps: quickReps
    }

    setSets([...sets, newSet])

    // オートインクリメント（次のセットの重量を自動で調整）
    if (sets.filter(s => s.exerciseId === selectedExerciseId).length >= 2) {
      setQuickWeight(prev => prev - 2.5) // 重量を少し下げる
    }
  }

  const removeSet = (id: string) => {
    setSets(sets.filter(set => set.id !== id))
  }

  const updateSet = (id: string, field: 'weight' | 'reps', value: number) => {
    setSets(sets.map(set =>
      set.id === id ? { ...set, [field]: value } : set
    ))
  }

  const saveWorkout = async () => {
    if (sets.length === 0) {
      alert("最低1セット追加してください")
      return
    }

    setIsSaving(true)
    try {
      // セット番号を種目ごとに割り当て
      const exerciseSetCount: Record<string, number> = {}
      const workoutSets = sets.map(set => {
        if (!exerciseSetCount[set.exerciseId]) {
          exerciseSetCount[set.exerciseId] = 0
        }
        exerciseSetCount[set.exerciseId]++

        return {
          exerciseId: set.exerciseId,
          setNumber: exerciseSetCount[set.exerciseId],
          weight: set.weight,
          reps: set.reps,
          isCompleted: true
        }
      })

      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString(),
          sets: workoutSets
        })
      })

      if (response.ok) {
        router.push("/workout/complete")
      } else {
        alert("保存に失敗しました")
      }
    } catch (error) {
      console.error("Failed to save workout:", error)
      alert("保存に失敗しました")
    } finally {
      setIsSaving(false)
    }
  }

  const totalVolume = sets.reduce((sum, set) => sum + (set.weight * set.reps), 0)

  return (
    <div className="min-h-screen bg-[#0a0e1a] relative overflow-hidden pb-24">
      {/* Animated Grid Background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="glass-morphism border-b border-cyan-500/20 sticky top-0 z-20 neon-border">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="h-8 text-cyan-400 hover:bg-cyan-500/10">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">戻る</span>
                </Button>
              </Link>
              <h1 className="text-base sm:text-lg font-bold ml-2 sm:ml-4 text-cyan-400 neon-text">QUICK LOG</h1>
            </div>
            <Badge className="text-xs sm:text-sm bg-cyan-500/20 border-cyan-500/30 text-cyan-300">
              {sets.length}セット
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-3 sm:space-y-6 relative z-10">
        {/* Quick Add Section */}
        <Card className="glass-morphism border-cyan-500/30 neon-glow">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-base sm:text-lg text-cyan-400">セットを追加</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {/* Category Filter */}
            <div>
              <Label className="text-xs sm:text-sm mb-2 block text-cyan-300">
                部位を選択 
                <span className="text-cyan-400/50 ml-2">({filteredExercises.length}種目)</span>
              </Label>
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className={`text-xs h-9 flex flex-col items-center justify-center p-1 ${
                    selectedCategory === "all" 
                      ? "bg-cyan-500/30 border-cyan-400 text-cyan-300 neon-glow" 
                      : "bg-gray-900/50 border-cyan-500/30 text-cyan-400/70 hover:bg-cyan-500/10 hover:border-cyan-400/50"
                  }`}
                >
                  <span>すべて</span>
                  <span className="text-[10px] opacity-70">{getCategoryCount("all")}</span>
                </Button>
                <Button
                  variant={selectedCategory === "chest" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("chest")}
                  className={`text-xs h-9 flex flex-col items-center justify-center p-1 ${
                    selectedCategory === "chest" 
                      ? "bg-pink-500/30 border-pink-400 text-pink-300 neon-glow-pink" 
                      : "bg-gray-900/50 border-pink-500/30 text-pink-400/70 hover:bg-pink-500/10 hover:border-pink-400/50"
                  }`}
                >
                  <span>💪 胸</span>
                  <span className="text-[10px] opacity-70">{getCategoryCount("chest")}</span>
                </Button>
                <Button
                  variant={selectedCategory === "back" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("back")}
                  className={`text-xs h-9 flex flex-col items-center justify-center p-1 ${
                    selectedCategory === "back" 
                      ? "bg-blue-500/30 border-blue-400 text-blue-300" 
                      : "bg-gray-900/50 border-blue-500/30 text-blue-400/70 hover:bg-blue-500/10 hover:border-blue-400/50"
                  }`}
                >
                  <span>🦾 背中</span>
                  <span className="text-[10px] opacity-70">{getCategoryCount("back")}</span>
                </Button>
                <Button
                  variant={selectedCategory === "legs" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("legs")}
                  className={`text-xs h-9 flex flex-col items-center justify-center p-1 ${
                    selectedCategory === "legs" 
                      ? "bg-green-500/30 border-green-400 text-green-300" 
                      : "bg-gray-900/50 border-green-500/30 text-green-400/70 hover:bg-green-500/10 hover:border-green-400/50"
                  }`}
                >
                  <span>🦵 脚</span>
                  <span className="text-[10px] opacity-70">{getCategoryCount("legs")}</span>
                </Button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 mt-2">
                <Button
                  variant={selectedCategory === "shoulders" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("shoulders")}
                  className={`text-xs h-9 flex flex-col items-center justify-center p-1 ${
                    selectedCategory === "shoulders" 
                      ? "bg-yellow-500/30 border-yellow-400 text-yellow-300" 
                      : "bg-gray-900/50 border-yellow-500/30 text-yellow-400/70 hover:bg-yellow-500/10 hover:border-yellow-400/50"
                  }`}
                >
                  <span>🏋️ 肩</span>
                  <span className="text-[10px] opacity-70">{getCategoryCount("shoulders")}</span>
                </Button>
                <Button
                  variant={selectedCategory === "arms" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("arms")}
                  className={`text-xs h-9 flex flex-col items-center justify-center p-1 ${
                    selectedCategory === "arms" 
                      ? "bg-purple-500/30 border-purple-400 text-purple-300 neon-glow-purple" 
                      : "bg-gray-900/50 border-purple-500/30 text-purple-400/70 hover:bg-purple-500/10 hover:border-purple-400/50"
                  }`}
                >
                  <span>💪 腕</span>
                  <span className="text-[10px] opacity-70">{getCategoryCount("arms")}</span>
                </Button>
                <Button
                  variant={selectedCategory === "abs" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("abs")}
                  className={`text-xs h-9 flex flex-col items-center justify-center p-1 ${
                    selectedCategory === "abs" 
                      ? "bg-orange-500/30 border-orange-400 text-orange-300" 
                      : "bg-gray-900/50 border-orange-500/30 text-orange-400/70 hover:bg-orange-500/10 hover:border-orange-400/50"
                  }`}
                >
                  <span>🔥 腹筋</span>
                  <span className="text-[10px] opacity-70">{getCategoryCount("abs")}</span>
                </Button>
                <Button
                  variant={selectedCategory === "full" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("full")}
                  className={`text-xs h-9 flex flex-col items-center justify-center p-1 ${
                    selectedCategory === "full" 
                      ? "bg-cyan-500/30 border-cyan-400 text-cyan-300" 
                      : "bg-gray-900/50 border-cyan-500/30 text-cyan-400/70 hover:bg-cyan-500/10 hover:border-cyan-400/50"
                  }`}
                >
                  <span>⚡ 全身</span>
                  <span className="text-[10px] opacity-70">{getCategoryCount("full")}</span>
                </Button>
              </div>
            </div>

            {/* Popular Exercises - Mobile Optimized */}
            {selectedCategory === "all" && popularExercises.length > 0 && (
              <div>
                <Label className="text-xs sm:text-sm mb-2 block text-cyan-300">人気の種目</Label>
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                  {popularExercises.map(ex => (
                    <Button
                      key={ex.id}
                      variant={selectedExerciseId === ex.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedExerciseId(ex.id)}
                      className={`text-xs sm:text-sm h-8 sm:h-9 ${
                        selectedExerciseId === ex.id
                          ? "bg-purple-500/30 border-purple-400 text-purple-300 neon-glow-purple"
                          : "bg-gray-900/50 border-purple-500/30 text-purple-400/70 hover:bg-purple-500/10"
                      }`}
                    >
                      {ex.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Exercise Select - Compact */}
            <div>
              <Label className="text-xs sm:text-sm mb-2 block text-cyan-300">種目を選択</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-cyan-400/50" />
                <Input
                  placeholder="検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-sm mb-2 bg-gray-900/50 border-cyan-500/30 text-cyan-300 placeholder:text-cyan-400/30"
                />
              </div>
              <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
                <SelectTrigger className="h-9 text-sm bg-gray-900/50 border-cyan-500/30 text-cyan-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-cyan-500/30 max-h-60">
                  {filteredExercises.map(ex => (
                    <SelectItem key={ex.id} value={ex.id} className="text-cyan-300 hover:bg-cyan-500/10">
                      <span className="text-sm">{ex.name}</span>
                      <span className="text-cyan-400/50 text-xs ml-1 hidden sm:inline">({categoryLabels[ex.category]})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Weight and Reps - Mobile Optimized */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="weight" className="text-xs sm:text-sm mb-2 block text-pink-300">重量 (kg)</Label>
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickWeight(Math.max(0, quickWeight - 2.5))}
                    className="h-12 w-12 text-xl bg-gray-900/50 border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:border-pink-400"
                  >
                    −
                  </Button>
                  <Input
                    id="weight"
                    type="number"
                    step="0.5"
                    value={quickWeight}
                    onChange={(e) => setQuickWeight(parseFloat(e.target.value) || 0)}
                    className="text-center text-2xl font-bold h-12 w-24 bg-gray-900/50 border-pink-500/30 text-pink-300 neon-glow-pink"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickWeight(quickWeight + 2.5)}
                    className="h-12 w-12 text-xl bg-gray-900/50 border-pink-500/30 text-pink-400 hover:bg-pink-500/10 hover:border-pink-400"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="reps" className="text-xs sm:text-sm mb-2 block text-purple-300">回数</Label>
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickReps(Math.max(1, quickReps - 1))}
                    className="h-12 w-12 text-xl bg-gray-900/50 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400"
                  >
                    −
                  </Button>
                  <Input
                    id="reps"
                    type="number"
                    value={quickReps}
                    onChange={(e) => setQuickReps(parseInt(e.target.value) || 0)}
                    className="text-center text-2xl font-bold h-12 w-24 bg-gray-900/50 border-purple-500/30 text-purple-300 neon-glow-purple"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickReps(quickReps + 1)}
                    className="h-12 w-12 text-xl bg-gray-900/50 border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              onClick={addSet} 
              className="w-full h-12 text-base bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white border-0 neon-glow" 
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              セットを追加
            </Button>
          </CardContent>
        </Card>

        {/* Sets List - Mobile Optimized */}
        {sets.length > 0 && (
          <Card className="glass-morphism border-purple-500/20">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base sm:text-lg text-purple-400">記録 ({sets.length})</CardTitle>
                <div className="text-xs sm:text-sm">
                  <span className="text-purple-300/50 hidden sm:inline">総重量: </span>
                  <span className="font-bold text-pink-400">{totalVolume.toLocaleString()}kg</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {sets.map((set, index) => (
                <div key={set.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg hover:border-cyan-400/40 transition-all">
                  <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm neon-glow">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-xs sm:text-sm truncate text-cyan-300">{set.exerciseName}</div>
                    <div className="flex items-center space-x-2 sm:space-x-3 mt-1">
                      <div className="flex items-center space-x-1">
                        <Input
                          type="number"
                          step="0.5"
                          value={set.weight}
                          onChange={(e) => updateSet(set.id, 'weight', parseFloat(e.target.value) || 0)}
                          className="w-12 sm:w-14 h-7 sm:h-8 text-xs sm:text-sm text-center p-1 bg-gray-900/50 border-pink-500/30 text-pink-300"
                        />
                        <span className="text-xs text-pink-400/70">kg</span>
                      </div>
                      <span className="text-cyan-400/40 text-xs">×</span>
                      <div className="flex items-center space-x-1">
                        <Input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSet(set.id, 'reps', parseInt(e.target.value) || 0)}
                          className="w-10 sm:w-12 h-7 sm:h-8 text-xs sm:text-sm text-center p-1 bg-gray-900/50 border-purple-500/30 text-purple-300"
                        />
                        <span className="text-xs text-purple-400/70">回</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSet(set.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Save Button - Fixed at bottom */}
        {sets.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white border-t shadow-lg z-10">
            <div className="max-w-4xl mx-auto">
              <Button
                onClick={saveWorkout}
                disabled={isSaving}
                className="w-full h-12 sm:h-14 text-base sm:text-lg shadow-lg"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    完了 ({sets.length}セット・{totalVolume.toLocaleString()}kg)
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {sets.length === 0 && (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <p className="text-base sm:text-lg mb-2">まだセットが記録されていません</p>
            <p className="text-xs sm:text-sm">上のフォームからセットを追加してください</p>
          </div>
        )}
      </main>
    </div>
  )
}
