"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, PlayCircle, FileText, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  completed: boolean
  modules: number
}

export default function LearningPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In a real scenario, this would fetch from the backend
        // const data = await apiClient.get("/learning/courses")
        // setCourses(data)
        
        // Mock data for now since learning service might not be ready
        setCourses([
          {
            id: "1",
            title: "Understanding Oil Types",
            description: "Learn about different types of cooking oils and their health impacts.",
            duration: "30 mins",
            level: "Beginner",
            completed: false,
            modules: 4
          },
          {
            id: "2",
            title: "Healthy Frying Techniques",
            description: "Master the art of frying with minimal oil absorption.",
            duration: "45 mins",
            level: "Intermediate",
            completed: false,
            modules: 6
          },
          {
            id: "3",
            title: "Heart Health & Nutrition",
            description: "Deep dive into cardiovascular health and dietary choices.",
            duration: "1 hour",
            level: "Advanced",
            completed: true,
            modules: 8
          }
        ])
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Learning Center</h1>
        <p className="text-muted-foreground">
          Expand your knowledge about healthy cooking and nutrition.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={course.completed ? "secondary" : "default"}>
                  {course.level}
                </Badge>
                {course.completed && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
              <CardTitle className="mt-2">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <PlayCircle className="h-4 w-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  {course.modules} Modules
                </div>
              </div>
              <Button className="w-full" variant={course.completed ? "outline" : "default"}>
                {course.completed ? "Review Course" : "Start Learning"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
