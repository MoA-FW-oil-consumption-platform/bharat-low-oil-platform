"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Star, CheckCircle2, UtensilsCrossed } from "lucide-react"

interface Partner {
  restaurantId: string
  restaurantName: string
  isCertified: boolean
  certificationLevel: string
  address: string
}

export default function DiningPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async (query = "") => {
    setIsLoading(true)
    try {
      // api-gateway maps /api/partnerships -> partnership-service
      // partnership-service maps /api/partner -> partnerRoutes
      // So path is /api/partnerships/api/partner/search
      const response = await apiClient.get<{ results: Partner[] }>(
        `/partnerships/api/partner/search?query=${query}`
      )
      setPartners(response.results)
    } catch (error) {
      console.error("Failed to fetch partners", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPartners(searchQuery)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dining & Retail</h2>
          <p className="text-muted-foreground">
            Find certified low-oil restaurants and grocery partners near you.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search for restaurants, cafes, or stores..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Loading partners...
          </div>
        ) : partners.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <UtensilsCrossed className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>No partners found matching your search.</p>
          </div>
        ) : (
          partners.map((partner) => (
            <Card key={partner.restaurantId} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-secondary/30 flex items-center justify-center">
                <UtensilsCrossed className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{partner.restaurantName}</CardTitle>
                  {partner.isCertified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {partner.certificationLevel}
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {partner.address}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-foreground">4.5</span>
                    <span>(120+)</span>
                  </div>
                  <div>•</div>
                  <div>Low Oil Menu Available</div>
                </div>
                <Button className="w-full mt-4" variant="outline">View Menu</Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
