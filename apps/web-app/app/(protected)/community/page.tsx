"use client"

import { useEffect, useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { apiClient } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Flame, Users, MapPin } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  points: number
  streak: number
  region?: string
}

interface UserStats {
  points: number
  streak: number
  globalRank: number
  badges: Array<{ id: string; name: string; icon: string }>
}

export default function CommunityPage() {
  const { user, token } = useAuthStore()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return
      
      try {
        // Fetch Leaderboard
        // Note: api-gateway maps /api/users -> user-service
        // user-service maps /community -> communityRoutes
        // So path is /api/users/community/leaderboard
        const lbResponse = await apiClient.get<{ leaderboard: LeaderboardEntry[] }>(
          '/users/community/leaderboard?limit=10'
        )
        setLeaderboard(lbResponse.leaderboard)

        // Fetch User Stats
        const statsResponse = await apiClient.get<UserStats>(
          `/users/community/stats/${user.userId}`
        )
        setUserStats(statsResponse)
      } catch (error) {
        console.error("Failed to fetch community data", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user])

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Community Hub</h2>
          <p className="text-muted-foreground">
            Compete, share, and grow with the Bharat Low Oil community.
          </p>
        </div>
        {userStats && (
          <div className="flex gap-4">
            <Card className="p-4 flex items-center gap-3 bg-primary/5 border-primary/20">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Global Rank</p>
                <p className="text-xl font-bold">#{userStats.globalRank}</p>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3 bg-orange-500/5 border-orange-500/20">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Streak</p>
                <p className="text-xl font-bold">{userStats.streak} Days</p>
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Leaderboard Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-primary" />
              Leaderboard
            </CardTitle>
            <CardDescription>Top performers in oil reduction this month</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="global" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="global">Global</TabsTrigger>
                <TabsTrigger value="friends">Friends</TabsTrigger>
                <TabsTrigger value="regional">Regional</TabsTrigger>
              </TabsList>
              
              <TabsContent value="global" className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : (
                  leaderboard.map((entry) => (
                    <div 
                      key={entry.userId} 
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        entry.userId === user?.userId ? 'bg-primary/10 border-primary/50' : 'bg-card'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`
                          flex items-center justify-center w-8 h-8 rounded-full font-bold
                          ${entry.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                            entry.rank === 2 ? 'bg-gray-100 text-gray-700' :
                            entry.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-secondary text-muted-foreground'}
                        `}>
                          {entry.rank}
                        </div>
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.name}`} />
                          <AvatarFallback>{entry.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{entry.name}</p>
                          {entry.region && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {entry.region}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{entry.points} pts</p>
                        <p className="text-xs text-muted-foreground">{entry.streak} day streak</p>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
              <TabsContent value="friends">
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Connect with friends to see their progress!</p>
                </div>
              </TabsContent>
              <TabsContent value="regional">
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>Regional leaderboards coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Challenges & Badges */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Challenges</CardTitle>
              <CardDescription>Join to earn bonus points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-green-700 dark:text-green-400">Zero Fry Week</h4>
                  <Badge variant="secondary" className="bg-white/50">3 Days Left</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Avoid all fried foods for 7 days.
                </p>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[60%]" />
                </div>
                <p className="text-xs text-right mt-1 text-muted-foreground">4/7 Days</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {userStats?.badges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center text-center gap-2">
                    <div className="text-3xl bg-secondary p-2 rounded-full">{badge.icon}</div>
                    <span className="text-xs font-medium">{badge.name}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center text-center gap-2 opacity-50">
                  <div className="text-3xl bg-secondary p-2 rounded-full">🔒</div>
                  <span className="text-xs font-medium">Locked</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
