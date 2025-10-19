import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { date, sets } = await request.json()

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate total volume
    const totalVolume = sets.reduce((sum: number, set: any) => {
      return sum + (set.weight * set.reps)
    }, 0)

    // Create workout
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        date: new Date(date),
        startTime: new Date(),
        endTime: new Date(),
        totalVolume,
        sets: {
          create: sets.map((set: any) => ({
            exerciseId: set.exerciseId,
            setNumber: set.setNumber,
            weight: set.weight,
            reps: set.reps,
            rpe: set.rpe,
            isCompleted: set.isCompleted,
            memo: set.memo,
          }))
        }
      },
      include: {
        sets: {
          include: {
            exercise: true
          }
        }
      }
    })

    return NextResponse.json(workout, { status: 201 })
  } catch (error) {
    console.error("Failed to create workout:", error)
    return NextResponse.json(
      { error: "トレーニングの保存に失敗しました" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "10")
    const offset = parseInt(searchParams.get("offset") || "0")

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: user.id },
      include: {
        sets: {
          include: {
            exercise: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset
    })

    return NextResponse.json(workouts)
  } catch (error) {
    console.error("Failed to fetch workouts:", error)
    return NextResponse.json(
      { error: "トレーニングの取得に失敗しました" },
      { status: 500 }
    )
  }
}
