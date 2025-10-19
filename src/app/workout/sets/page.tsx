"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Plus, Minus } from "lucide-react"
import Link from "next/link"

interface Exercise {
  id: string
  name: string
  nameEn?: string
  category: string
}

interface SelectedExercise {
  exercise: Exercise
  sets: number
}

interface WorkoutSet {
  exerciseId: string
  setNumber: number
  weight: number
  reps: number
  rpe?: number
  isCompleted: boolean
  memo?: string
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

export default function WorkoutSetsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([])
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedExercises")
    if (stored) {
      const exercises = JSON.parse(stored)
      setSelectedExercises(exercises)

      // Initialize workout sets
      const initialSets: WorkoutSet[] = []
      exercises.forEach(({ exercise, sets }: SelectedExercise) => {
        for (let i = 1; i <= sets; i++) {
          initialSets.push({
            exerciseId: exercise.id,
            setNumber: i,
            weight: 0,
            reps: 0,
            isCompleted: false,
          })
        }
      })
      setWorkoutSets(initialSets)
    } else {
      router.push("/workout/new")
    }
  }, [router])

  const currentExercise = selectedExercises[currentExerciseIndex]
  const currentExerciseSets = workoutSets.filter(
    set => set.exerciseId === currentExercise?.exercise.id
  )

  const updateSet = (setNumber: number, field: keyof WorkoutSet, value: any) => {
    setWorkoutSets(prev => prev.map(set =>
      set.exerciseId === currentExercise.exercise.id && set.setNumber === setNumber
        ? { ...set, [field]: value }
        : set
    ))
  }

  const toggleSetCompleted = (setNumber: number) => {
    updateSet(setNumber, 'isCompleted', !currentExerciseSets.find(s => s.setNumber === setNumber)?.isCompleted)
  }

  const nextExercise = () => {
    if (currentExerciseIndex < selectedExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    }
  }

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  const completeWorkout = async () => {
    if (!session?.user?.email) return

    setIsLoading(true)
    try {
      const completedSets = workoutSets.filter(set => set.isCompleted)

      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          sets: completedSets,
        }),
      })

      if (response.ok) {
        sessionStorage.removeItem("selectedExercises")
        router.push("/workout/complete")
      } else {
        alert("トレーニングの保存に失敗しました")
      }
    } catch (error) {
      console.error("Failed to save workout:", error)
      alert("トレーニングの保存に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  const allSetsCompleted = workoutSets.every(set => set.isCompleted)
  const completedSetsCount = workoutSets.filter(set => set.isCompleted).length

  if (!currentExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>種目を読み込み中...</p>
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
            <Link href="/workout/new">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-4">セット入力</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              {currentExerciseIndex + 1} / {selectedExercises.length} 種目
            </span>
            <span className="text-sm text-gray-600">
              {completedSetsCount} / {workoutSets.length} セット完了
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedSetsCount / workoutSets.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Exercise */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{currentExercise.exercise.name}</CardTitle>
                {currentExercise.exercise.nameEn && (
                  <p className="text-gray-600">{currentExercise.exercise.nameEn}</p>
                )}
                <Badge variant="secondary" className="mt-2">
                  {categoryLabels[currentExercise.exercise.category]}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={prevExercise}
                  disabled={currentExerciseIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={nextExercise}
                  disabled={currentExerciseIndex === selectedExercises.length - 1}
                >
                  →
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Sets Input */}
        <Card>
          <CardHeader>
            <CardTitle>セット入力</CardTitle>
            <CardDescription>
              重量、回数、RPE（主観的運動強度）を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentExerciseSets.map((set) => (
              <div key={set.setNumber} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <span className="text-lg font-semibold">セット {set.setNumber}</span>
                </div>

                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`weight-${set.setNumber}`}>重量 (kg)</Label>
                    <Input
                      id={`weight-${set.setNumber}`}
                      type="number"
                      min="0"
                      step="0.5"
                      value={set.weight || ""}
                      onChange={(e) => updateSet(set.setNumber, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`reps-${set.setNumber}`}>回数</Label>
                    <Input
                      id={`reps-${set.setNumber}`}
                      type="number"
                      min="0"
                      value={set.reps || ""}
                      onChange={(e) => updateSet(set.setNumber, 'reps', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`rpe-${set.setNumber}`}>RPE (1-10)</Label>
                    <Input
                      id={`rpe-${set.setNumber}`}
                      type="number"
                      min="1"
                      max="10"
                      value={set.rpe || ""}
                      onChange={(e) => updateSet(set.setNumber, 'rpe', parseInt(e.target.value) || undefined)}
                      placeholder="1-10"
                    />
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Button
                    variant={set.isCompleted ? "default" : "outline"}
                    onClick={() => toggleSetCompleted(set.setNumber)}
                    className="min-w-[100px]"
                  >
                    {set.isCompleted ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        完了
                      </>
                    ) : (
                      "未完了"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Complete Workout Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={completeWorkout}
            disabled={!allSetsCompleted || isLoading}
            size="lg"
            className="px-8"
          >
            {isLoading ? "保存中..." : "トレーニング完了"}
          </Button>
        </div>
      </main>
    </div>
  )
}
