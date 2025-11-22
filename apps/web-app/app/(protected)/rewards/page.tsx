"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Gift, Star, TrendingUp, Lock } from "lucide-react"

interface RewardData {
  userId: string
  totalPoints: number
  currentStreak: number
  longestStreak: number
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    earnedAt: string
  }>
  pointsHistory: Array<{
    points: number
    reason: string
    date: string
  }>
}

export default function RewardsPage() {
  const { user, token } = useAuthStore()
  const [rewardData, setRewardData] = useState<RewardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRewards = async () => {
      if (!user?.userId) return
      try {
        // api-gateway maps /api/rewards -> reward-service
        const response = await apiClient.get<{ reward: RewardData }>(
          `/rewards/${user.userId}`
        )
        setRewardData(response.reward)
      } catch (error) {
        console.error("Failed to fetch rewards", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRewards()
  }, [user])

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading rewards...</div>
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rewards & Achievements</h2>
          <p className="text-muted-foreground">
            Earn points for healthy habits and redeem them for exciting offers.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-lg text-primary">{rewardData?.totalPoints || 0} Points</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Keep up the streak to earn bonus points!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-lg flex items-center gap-4">
                <div className="p-3 bg-background rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{rewardData?.currentStreak || 0} Days</p>
                </div>
              </div>
              <div className="p-4 bg-secondary rounded-lg flex items-center gap-4">
                <div className="p-3 bg-background rounded-full">
                  <Award className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Longest Streak</p>
                  <p className="text-2xl font-bold">{rewardData?.longestStreak || 0} Days</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Level 5: Health Enthusiast</span>
                <span className="text-sm text-muted-foreground">1250 / 2000 XP</span>
              </div>
              <Progress value={62.5} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Redeem Section */}
        <Card className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Redeem Points
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Use your points for discounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">₹100 Grocery Coupon</span>
                <Badge variant="secondary">500 pts</Badge>
              </div>
              <p className="text-xs text-primary-foreground/70">Valid at partner stores</p>
              <Button variant="secondary" size="sm" className="w-full mt-2">Redeem</Button>
            </div>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">Free Health Checkup</span>
                <Badge variant="secondary">2000 pts</Badge>
              </div>
              <p className="text-xs text-primary-foreground/70">At Apollo Clinics</p>
              <Button variant="secondary" size="sm" className="w-full mt-2" disabled>Not enough points</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges & History */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList>
          <TabsTrigger value="badges">Badges Collection</TabsTrigger>
          <TabsTrigger value="history">Points History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="badges" className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {rewardData?.badges.map((badge) => (
              <Card key={badge.id} className="text-center p-4 hover:bg-secondary/50 transition-colors">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {new Date(badge.earnedAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
            {/* Placeholders for unearned badges */}
            <Card className="text-center p-4 opacity-50 border-dashed">
              <div className="text-4xl mb-2 grayscale">👑</div>
              <h4 className="font-semibold text-sm mb-1">Monthly Master</h4>
              <p className="text-xs text-muted-foreground">Log daily for 30 days</p>
              <div className="mt-2 flex justify-center">
                <Lock className="h-3 w-3" />
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {rewardData?.pointsHistory.slice().reverse().map((history, i) => (
                  <div key={i} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium capitalize">{history.reason.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(history.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-bold text-green-600">+{history.points} pts</span>
                  </div>
                ))}
                {(!rewardData?.pointsHistory || rewardData.pointsHistory.length === 0) && (
                  <div className="p-8 text-center text-muted-foreground">
                    No points history yet. Start logging to earn points!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
