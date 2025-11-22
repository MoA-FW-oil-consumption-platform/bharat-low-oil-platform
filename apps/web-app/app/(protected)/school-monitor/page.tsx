"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/store/useAuthStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { School, AlertTriangle, CheckCircle2, FileText, Download } from "lucide-react"

interface ComplianceReport {
  institutionName: string
  month: string
  metrics: {
    totalMeals: number
    totalOilUsed: number
    avgOilPerMeal: number
    icmrLimit: number
    compliance: 'compliant' | 'non-compliant'
  }
  costAnalysis: {
    costPerMeal: number
    totalMonthlyCost: number
  }
  recommendations: string[]
}

export default function SchoolMonitorPage() {
  const { user, token } = useAuthStore()
  const [report, setReport] = useState<ComplianceReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  
  // Mock institution ID for demo if user doesn't have one
  // In a real app, we'd fetch the user's linked institution
  const institutionId = "inst_demo_123" 

  useEffect(() => {
    fetchReport()
  }, [selectedMonth])

  const fetchReport = async () => {
    setIsLoading(true)
    try {
      // api-gateway maps /api/institutional -> tracking-service
      // We use a try-catch block because the demo ID might not exist in the backend
      // In a real scenario, we would first check if the user is an admin of an institution
      
      // For demo purposes, if the API fails (likely 404), we'll show a mock state or empty state
      // But let's try to hit the endpoint
      
      const response = await apiClient.get<ComplianceReport>(
        `/institutional/${institutionId}/compliance?month=${selectedMonth}`
      )
      setReport(response)
    } catch (error) {
      console.error("Failed to fetch compliance report", error)
      // Fallback for demo if backend doesn't have data for this ID
      // setReport(null) 
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReport = async () => {
    try {
      // Fetch PDF as blob
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/institutional/${institutionId}/compliance/pdf?month=${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `compliance-report-${selectedMonth}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Download failed", error)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">School Monitor</h2>
          <p className="text-muted-foreground">
            Track Mid-Day Meal (MDM) compliance and oil usage in schools.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025-02">February 2025</SelectItem>
              <SelectItem value="2025-01">January 2025</SelectItem>
              <SelectItem value="2024-12">December 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {report ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Compliance Status Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                {report.institutionName}
              </CardTitle>
              <CardDescription>Compliance Report for {report.month}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-secondary/20 rounded-lg border">
                <div className="text-center md:text-left">
                  <p className="text-sm text-muted-foreground">Compliance Status</p>
                  <div className={`flex items-center gap-2 text-2xl font-bold ${
                    report.metrics.compliance === 'compliant' ? 'text-green-600' : 'text-destructive'
                  }`}>
                    {report.metrics.compliance === 'compliant' ? (
                      <><CheckCircle2 className="h-6 w-6" /> Compliant</>
                    ) : (
                      <><AlertTriangle className="h-6 w-6" /> Non-Compliant</>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-8 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Oil / Meal</p>
                    <p className="text-xl font-bold">{report.metrics.avgOilPerMeal} ml</p>
                    <p className="text-xs text-muted-foreground">Limit: {report.metrics.icmrLimit} ml</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Meals</p>
                    <p className="text-xl font-bold">{report.metrics.totalMeals}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cost per Meal (Oil)</span>
                <span className="font-bold">₹{report.costAnalysis.costPerMeal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Monthly Cost</span>
                <span className="font-bold">₹{report.costAnalysis.totalMonthlyCost}</span>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 text-sm rounded-md">
                Reducing oil usage by 5ml per meal can save approx ₹15,000 per month for this institution.
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-16 bg-secondary/20 rounded-lg border border-dashed">
          <School className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium">No Data Available</h3>
          <p className="text-muted-foreground max-w-md mx-auto mt-2">
            We couldn't find a compliance report for the selected month or you don't have access to any institution.
          </p>
          <Button className="mt-6" variant="outline">Link Institution</Button>
        </div>
      )}
    </div>
  )
}
