import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const exerciseId = searchParams.get("exerciseId")

    if (!exerciseId) {
      return NextResponse.json({ error: "Exercise ID required" }, { status: 400 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get last workout set for this exercise
    const lastSet = await prisma.workoutSet.findFirst({
      where: {
        exerciseId,
        workout: {
          userId: user.id
        }
      },
      orderBy: {
        workout: {
          date: 'desc'
        }
      },
      select: {
        weight: true,
        reps: true
      }
    })

    if (!lastSet) {
      return NextResponse.json({ weight: null, reps: null })
    }

    return NextResponse.json(lastSet)
  } catch (error) {
    console.error("Failed to fetch last set:", error)
    return NextResponse.json(
      { error: "前回の記録の取得に失敗しました" },
      { status: 500 }
    )
  }
}
