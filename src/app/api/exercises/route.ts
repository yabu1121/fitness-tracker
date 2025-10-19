import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(exercises)
  } catch (error) {
    console.error("Failed to fetch exercises:", error)
    return NextResponse.json(
      { error: "種目の取得に失敗しました" },
      { status: 500 }
    )
  }
}
