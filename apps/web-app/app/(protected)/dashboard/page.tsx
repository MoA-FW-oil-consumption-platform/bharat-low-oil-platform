"use client"

import { useEffect, useState } from "react"
import { 
  TrendingDown, 
  Droplet, 
  Award, 
  Target, 
  Plus, 
  Utensils, 
  ScanLine,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/store/useAuthStore"

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [oilLevel, setOilLevel] = useState(0)
  const [rewards, setRewards] = useState({ points: 0, streak: 0, badges: [] })
  const [monthlyAvg, setMonthlyAvg] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const maxOil = 30 // ICMR recommended daily limit in ml

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Fetch daily logs
        const logsResponse = await apiClient.get<{ logs: any[] }>(
          `/tracking/logs/${user.userId}?startDate=${today.toISOString()}&endDate=${tomorrow.toISOString()}`
        );
        const total = logsResponse.logs.reduce((sum: any, log: any) => sum + log.amount, 0);
        setOilLevel(total);

        // Fetch rewards (points, streak)
        try {
          const rewardsResponse = await apiClient.get<{ points: number, streak: number, badges: any[] }>(
            `/rewards/${user.userId}`
          );
          setRewards(rewardsResponse);
        } catch (e) {
          console.error("Failed to fetch rewards", e);
        }

        // Fetch monthly average
        try {
          const monthlyResponse = await apiClient.get<{ average: number }>(
            `/tracking/usage/${user.userId}/monthly`
          );
          setMonthlyAvg(monthlyResponse.average);
        } catch (e) {
          console.error("Failed to fetch monthly stats", e);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false)
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {user?.fullName || "Health Enthusiast"}! Here's your daily summary.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Log Meal
          </Button>
        </div>
      </div>

      {/* Oil Meter Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Daily Oil Consumption</CardTitle>
            <CardDescription>
              You have consumed {oilLevel}ml of oil today. ICMR recommends &lt; {maxOil}ml.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Circular Progress Placeholder - implementing with CSS for now or just a big number */}
                <div className={`text-5xl font-bold ${oilLevel > maxOil ? 'text-destructive' : 'text-primary'}`}>
                  {oilLevel}
                  <span className="text-lg text-muted-foreground ml-1">ml</span>
                </div>
                <div className="absolute bottom-0 text-sm text-muted-foreground">
                  / {maxOil}ml Limit
                </div>
              </div>
              <Progress value={(oilLevel / maxOil) * 100} className="w-[60%] h-3" />
              <p className="text-sm text-muted-foreground text-center max-w-md">
                {oilLevel > maxOil 
                  ? "You've exceeded the daily recommended limit. Try to avoid fried foods for the rest of the day."
                  : "Great job! You are within the healthy limits. Keep it up!"}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>
              Your health journey at a glance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Reward Points</p>
                <p className="text-sm text-muted-foreground">{rewards.points} pts</p>
              </div>
              <div className="ml-auto font-medium text-primary">+50 today</div>
            </div>
            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10">
                <Target className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Current Streak</p>
                <p className="text-sm text-muted-foreground">{rewards.streak} Days</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10">
                <TrendingDown className="h-5 w-5 text-orange-500" />
              </div>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Monthly Avg</p>
                <p className="text-sm text-muted-foreground">{monthlyAvg}ml / day</p>
              </div>
              <div className="ml-auto font-medium text-green-500 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1" /> 12%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scan Food</CardTitle>
            <ScanLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Analyze oil content in real-time
            </div>
          </CardContent>
        </Card>
        <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Find Recipes</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Discover low-oil alternatives
            </div>
          </CardContent>
        </Card>
        <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Join challenges & leaderboards
            </div>
          </CardContent>
        </Card>
        <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Redeem points for discounts
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
