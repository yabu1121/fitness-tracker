"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, Plus, Dumbbell } from "lucide-react"
import Link from "next/link"

interface Exercise {
  id: string
  name: string
  nameEn?: string
  category: string
  description?: string
}

interface SelectedExercise {
  exercise: Exercise
  sets: number
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

export default function NewWorkoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchExercises()
  }, [])

  const fetchExercises = async () => {
    try {
      const response = await fetch("/api/exercises")
      if (response.ok) {
        const data = await response.json()
        setExercises(data)
      }
    } catch (error) {
      console.error("Failed to fetch exercises:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.nameEn?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addExercise = (exercise: Exercise) => {
    const existingIndex = selectedExercises.findIndex(se => se.exercise.id === exercise.id)

    if (existingIndex >= 0) {
      // Update existing exercise sets
      const updated = [...selectedExercises]
      updated[existingIndex].sets += 1
      setSelectedExercises(updated)
    } else {
      // Add new exercise
      setSelectedExercises([...selectedExercises, { exercise, sets: 1 }])
    }
  }

  const removeExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(se => se.exercise.id !== exerciseId))
  }

  const updateSets = (exerciseId: string, sets: number) => {
    if (sets <= 0) {
      removeExercise(exerciseId)
      return
    }

    const updated = selectedExercises.map(se =>
      se.exercise.id === exerciseId ? { ...se, sets } : se
    )
    setSelectedExercises(updated)
  }

  const startWorkout = () => {
    if (selectedExercises.length === 0) {
      alert("最低1つの種目を選択してください")
      return
    }

    // Store selected exercises in session storage for the next step
    sessionStorage.setItem("selectedExercises", JSON.stringify(selectedExercises))
    router.push("/workout/sets")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-12 w-12 animate-spin mx-auto mb-4" />
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
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 ml-4">新規トレーニング</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exercise Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>種目を選択</CardTitle>
                <CardDescription>トレーニングする種目を選んでください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="種目を検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    すべて
                  </Button>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <Button
                      key={key}
                      variant={selectedCategory === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(key)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {/* Exercise List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {filteredExercises.map((exercise) => (
                    <Card key={exercise.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold">{exercise.name}</h3>
                            {exercise.nameEn && (
                              <p className="text-sm text-gray-500">{exercise.nameEn}</p>
                            )}
                            <Badge variant="secondary" className="mt-1">
                              {categoryLabels[exercise.category]}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addExercise(exercise)}
                            className="ml-2"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Exercises */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>選択した種目</CardTitle>
                <CardDescription>{selectedExercises.length}個の種目</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedExercises.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    種目を選択してください
                  </p>
                ) : (
                  <>
                    {selectedExercises.map(({ exercise, sets }) => (
                      <div key={exercise.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{exercise.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[exercise.category]}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Label htmlFor={`sets-${exercise.id}`} className="text-sm">
                            セット数:
                          </Label>
                          <Input
                            id={`sets-${exercise.id}`}
                            type="number"
                            min="1"
                            max="20"
                            value={sets}
                            onChange={(e) => updateSets(exercise.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExercise(exercise.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      onClick={startWorkout}
                      className="w-full"
                      disabled={selectedExercises.length === 0}
                    >
                      セット入力に進む
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
