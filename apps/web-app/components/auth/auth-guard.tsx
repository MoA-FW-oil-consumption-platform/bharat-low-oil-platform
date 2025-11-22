"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token } = useAuthStore()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Small delay to allow hydration of the store
    const checkAuth = () => {
      if (!isAuthenticated || !token) {
        router.push("/login")
      } else {
        setIsChecking(false)
      }
    }
    
    // We need to wait for hydration if using persist
    // But zustand persist usually hydrates synchronously if using localStorage
    // However, in Next.js SSR, we need to be careful.
    // Let's just check immediately in useEffect which runs on client
    checkAuth()
  }, [isAuthenticated, token, router])

  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
