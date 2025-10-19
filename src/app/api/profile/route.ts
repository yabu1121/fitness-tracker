import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        height: true,
        gender: true,
        birthDate: true,
        goalWeight: true,
        goalDate: true,
        goalPurpose: true,
        weeklyGoal: true,
        defaultUnit: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to fetch profile:", error)
    return NextResponse.json(
      { error: "プロフィールの取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        height: data.height,
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        goalWeight: data.goalWeight,
        goalDate: data.goalDate ? new Date(data.goalDate) : null,
        goalPurpose: data.goalPurpose,
        weeklyGoal: data.weeklyGoal,
        defaultUnit: data.defaultUnit,
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Failed to update profile:", error)
    return NextResponse.json(
      { error: "プロフィールの更新に失敗しました" },
      { status: 500 }
    )
  }
}
