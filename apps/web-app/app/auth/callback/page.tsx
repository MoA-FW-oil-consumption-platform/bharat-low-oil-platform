"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { apiClient } from "@/lib/api-client"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase returns tokens in the hash fragment
        const hash = window.location.hash
        if (!hash) {
          throw new Error("No hash fragment found")
        }

        const params = new URLSearchParams(hash.substring(1)) // remove the #
        const accessToken = params.get("access_token")
        const refreshToken = params.get("refresh_token")

        if (!accessToken || !refreshToken) {
          throw new Error("Missing tokens in callback")
        }

        // Exchange Supabase tokens for our backend JWT
        const response = await apiClient.post<{ token: string, user: any }>('/auth/oauth/callback', {
          access_token: accessToken,
          refresh_token: refreshToken,
          platform: 'web'
        })

        // Update Store
        login(response.token, response.user)

        // Redirect to Dashboard
        router.push('/dashboard')
      } catch (err: any) {
        console.error("OAuth callback error:", err)
        setError(err.message || "Authentication failed")
        // Redirect to login after a delay
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleCallback()
  }, [router, login])

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="text-destructive mb-4">Authentication Failed</div>
        <div className="text-muted-foreground">{error}</div>
        <div className="text-sm text-muted-foreground mt-4">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <div className="text-muted-foreground">Completing sign in...</div>
    </div>
  )
}
