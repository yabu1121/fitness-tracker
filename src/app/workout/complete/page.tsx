"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Home, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function WorkoutCompletePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">お疲れ様でした！</CardTitle>
            <CardDescription className="text-lg">
              トレーニングが完了しました
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">今日の成果</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-green-600">種目数:</span>
                  <span className="ml-2 font-semibold">3</span>
                </div>
                <div>
                  <span className="text-green-600">総セット数:</span>
                  <span className="ml-2 font-semibold">12</span>
                </div>
                <div>
                  <span className="text-green-600">総重量:</span>
                  <span className="ml-2 font-semibold">2,500kg</span>
                </div>
                <div>
                  <span className="text-green-600">トレーニング時間:</span>
                  <span className="ml-2 font-semibold">45分</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">次のアクション</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link href="/">
                  <Button variant="outline" className="w-full justify-start">
                    <Home className="h-4 w-4 mr-2" />
                    ホームに戻る
                  </Button>
                </Link>
                <Link href="/calendar">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    カレンダーで確認
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    進捗を確認
                  </Button>
                </Link>
              </div>
            </div>

            <div className="pt-4">
              <Badge variant="secondary" className="text-sm">
                🎉 継続は力なり！素晴らしい頑張りです！
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
