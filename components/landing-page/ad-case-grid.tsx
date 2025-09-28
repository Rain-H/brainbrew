"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, ImageIcon } from "lucide-react"
import Image from "next/image"

interface AdCase {
  id: string
  title: string
  description: string
  thumbnail?: string
  source: string
  originalUrl: string
  createdAt: string
}

interface AdCaseGridProps {
  searchUrl?: string
}

// Mock data for demonstration
const mockAdCases: AdCase[] = [
  {
    id: "1",
    title: "Nike Air Max Creative Ad - Breaking Boundaries",
    description:
      "Nike's latest Air Max series advertisement showcases the power of athletic breakthrough through dynamic visual effects and creative presentation.",
    thumbnail: "/nike-air-max-creative-advertisement.jpg",
    source: "Creative Portal",
    originalUrl: "https://example.com/nike-ad",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Apple iPhone 15 Emotional Marketing Case",
    description:
      "Apple showcases iPhone 15's camera capabilities through heartwarming family stories, creating strong emotional resonance.",
    thumbnail: "/apple-iphone-emotional-marketing.jpg",
    source: "Ad Creative Network",
    originalUrl: "https://example.com/apple-ad",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Coca-Cola Summer Refresh Creative Campaign",
    description:
      "Coca-Cola's summer marketing campaign attracts young consumers through refreshing visual design and interactive elements.",
    source: "Marketing Case Library",
    originalUrl: "https://example.com/coca-cola-ad",
    createdAt: "2024-01-13",
  },
  {
    id: "4",
    title: "Tesla Model Y Futuristic Ad Design",
    description:
      "Tesla Model Y's futuristic advertisement highlights the product's innovative features through minimalist design language.",
    thumbnail: "/tesla-model-y-futuristic-advertisement.jpg",
    source: "Auto Ad Network",
    originalUrl: "https://example.com/tesla-ad",
    createdAt: "2024-01-12",
  },
  {
    id: "5",
    title: "Starbucks Holiday Limited Marketing Campaign",
    description:
      "Starbucks holiday season marketing campaign creates festive atmosphere through warm tones and holiday elements.",
    thumbnail: "/starbucks-holiday-marketing-campaign.jpg",
    source: "Brand Marketing",
    originalUrl: "https://example.com/starbucks-ad",
    createdAt: "2024-01-11",
  },
  {
    id: "6",
    title: "Xiaomi Phone Youth-Oriented Ad Strategy",
    description:
      "Xiaomi's advertising strategy targeting young users attracts the target audience through trendy elements and youthful language.",
    source: "Digital Marketing",
    originalUrl: "https://example.com/xiaomi-ad",
    createdAt: "2024-01-10",
  },
]

export default function AdCaseGrid({ searchUrl }: AdCaseGridProps) {
  const [adCases, setAdCases] = useState<AdCase[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      console.log(`[v0] Loading ad cases for URL: ${searchUrl}`)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Filter cases based on search URL (mock logic)
      let filteredCases = mockAdCases
      if (searchUrl) {
        const domain = searchUrl.toLowerCase()
        if (domain.includes("apple")) {
          filteredCases = mockAdCases.filter(
            (c) => c.title.toLowerCase().includes("apple") || c.title.toLowerCase().includes("iphone"),
          )
        } else if (domain.includes("nike")) {
          filteredCases = mockAdCases.filter((c) => c.title.toLowerCase().includes("nike"))
        } else if (domain.includes("tesla")) {
          filteredCases = mockAdCases.filter((c) => c.title.toLowerCase().includes("tesla"))
        } else {
          // Show all cases for other URLs
          filteredCases = mockAdCases
        }
      }

      setAdCases(filteredCases.slice(0, 4))
      setLoading(false)
    }

    loadInitialData()
  }, [searchUrl])

  const loadMore = async () => {
    setLoadingMore(true)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setAdCases((prev) => [...prev, ...mockAdCases.slice(4)])
    setLoadingMore(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
            Analyzing website and searching for related creatives...
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-48 bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adCases.map((adCase) => (
          <Card key={adCase.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative h-48 bg-muted">
              {adCase.thumbnail ? (
                <Image
                  src={adCase.thumbnail || "/placeholder.svg"}
                  alt={adCase.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{adCase.title}</h3>

              <p className="text-sm text-muted-foreground mb-2">Source: {adCase.source}</p>

              {adCase.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{adCase.description}</p>
              )}

              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => window.open(adCase.originalUrl, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Original
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {adCases.length < mockAdCases.length && (
        <div className="flex justify-center">
          <Button onClick={loadMore} disabled={loadingMore} variant="outline" size="lg">
            {loadingMore ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {adCases.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No creative cases found related to this website. Please try a different URL.
          </p>
        </div>
      )}
    </div>
  )
}
