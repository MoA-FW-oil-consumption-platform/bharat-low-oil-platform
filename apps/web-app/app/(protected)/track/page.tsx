"use client"

import { useState, useEffect } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import { apiClient } from "@/lib/api-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, Trash2, Camera, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface OilLog {
  _id: string
  amount: number
  oilType: string
  date: string
  source: string
  notes?: string
}

export default function TrackPage() {
  const { user, token } = useAuthStore()
  const { toast } = useToast()
  const [logs, setLogs] = useState<OilLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzedData, setAnalyzedData] = useState<any>(null)
  
  // Form State
  const [amount, setAmount] = useState("")
  const [oilType, setOilType] = useState("sunflower")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchLogs()
  }, [user])

  const fetchLogs = async () => {
    if (!user?.userId) return
    try {
      const response = await apiClient.get<{ logs: OilLog[] }>(
        `/tracking/logs/${user.userId}?limit=10`
      )
      setLogs(response.logs)
    } catch (error) {
      console.error("Failed to fetch logs", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitting log...", { amount, oilType, date, notes, userId: user?.userId })
    
    if (!user?.userId) {
      console.error("No user ID found")
      toast({
        title: "Error",
        description: "User session not found. Please login again.",
        variant: "destructive",
      })
      return
    }

    if (!amount || Number(amount) <= 0) {
      console.error("Invalid amount")
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid oil amount greater than 0.",
        variant: "destructive",
      })
      return
    }

    if (!date) {
      toast({
        title: "Invalid Date",
        description: "Please select a date.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      console.log("Sending request to API...")
      await apiClient.post(
        '/tracking/logs',
        {
          userId: user.userId,
          amount: Number(amount),
          oilType,
          date: new Date(date).toISOString(),
          source: 'manual',
          notes
        }
      )
      console.log("Log created successfully")
      
      toast({
        title: "Success",
        description: "Oil consumption logged successfully!",
      })

      // Reset form and refresh logs
      setAmount("")
      setNotes("")
      fetchLogs()
    } catch (error) {
      console.error("Failed to create log", error)
      toast({
        title: "Error",
        description: "Failed to save log. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsAnalyzing(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const data = await apiClient.post<{ analysis: any }>(
        '/ai/recognition/food',
        formData
      )
      
      setAnalyzedData(data.analysis)
      
      // Pre-fill form with analyzed data
      if (data.analysis.estimated_oil_content) {
        const oilAmount = parseInt(data.analysis.estimated_oil_content.replace('ml', ''))
        setAmount(oilAmount.toString())
        setNotes(`AI Analysis: ${data.analysis.dish_name}`)
      }
    } catch (error) {
      console.error("Failed to analyze image", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDelete = async (logId: string) => {
    if (!confirm("Are you sure you want to delete this log?")) return
    
    try {
      await apiClient.delete(
        `/tracking/logs/${logId}`
      )
      setLogs(logs.filter(log => log._id !== logId))
    } catch (error) {
      console.error("Failed to delete log", error)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Track Consumption</h2>
        <p className="text-muted-foreground">
          Log your daily oil intake manually or scan your food.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Log</CardTitle>
            <CardDescription>Record your oil consumption details</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="manual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                <TabsTrigger value="scan">AI Scan</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="oilType">Oil Type</Label>
                    <Select value={oilType} onValueChange={setOilType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select oil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunflower">Sunflower Oil</SelectItem>
                        <SelectItem value="mustard">Mustard Oil</SelectItem>
                        <SelectItem value="groundnut">Groundnut Oil</SelectItem>
                        <SelectItem value="olive">Olive Oil</SelectItem>
                        <SelectItem value="coconut">Coconut Oil</SelectItem>
                        <SelectItem value="palm">Palm Oil</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (ml)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="e.g. 15" 
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input 
                      id="notes" 
                      placeholder="e.g. Lunch - Aloo Gobi" 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Plus className="mr-2 h-4 w-4" /> Add Log
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="scan">
                <div className="flex flex-col items-center justify-center space-y-4 py-8 border-2 border-dashed rounded-lg">
                  {isAnalyzing ? (
                    <div className="text-center space-y-2">
                      <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                      <p className="text-sm text-muted-foreground">Analyzing food image...</p>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 bg-secondary rounded-full">
                        <Camera className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Upload a photo of your meal</p>
                        <p className="text-xs text-muted-foreground mt-1">AI will estimate oil content</p>
                      </div>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        id="image-upload"
                        onChange={handleImageUpload}
                      />
                      <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                        <Upload className="mr-2 h-4 w-4" /> Select Image
                      </Button>
                    </>
                  )}
                  
                  {analyzedData && (
                    <div className="w-full px-4 mt-4 space-y-2 text-sm bg-secondary/20 p-3 rounded-md">
                      <p><strong>Dish:</strong> {analyzedData.dish_name}</p>
                      <p><strong>Est. Oil:</strong> {analyzedData.estimated_oil_content}</p>
                      <p className="text-xs text-muted-foreground">Switch to "Manual Entry" to save these details.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* History Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
            <CardDescription>Your latest consumption logs</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No logs found. Start tracking today!
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log._id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <p className="font-medium capitalize">{log.oilType} Oil</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.date).toLocaleDateString()} • {log.source}
                      </p>
                      {log.notes && <p className="text-xs text-muted-foreground italic">{log.notes}</p>}
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-primary">{log.amount}ml</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive/90"
                        onClick={() => handleDelete(log._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
