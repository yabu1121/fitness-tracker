import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workoutId = params.id

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify workout belongs to user
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      select: { userId: true }
    })

    if (!workout) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 })
    }

    if (workout.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete workout (sets will be cascade deleted)
    await prisma.workout.delete({
      where: { id: workoutId }
    })

    return NextResponse.json({ message: "Workout deleted successfully" })
  } catch (error) {
    console.error("Failed to delete workout:", error)
    return NextResponse.json(
      { error: "トレーニングの削除に失敗しました" },
      { status: 500 }
    )
  }
}

