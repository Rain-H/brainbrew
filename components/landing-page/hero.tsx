"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles } from "lucide-react"

interface HeroProps {
  onUrlSubmit?: (url: string) => void
}

export default function Hero({ onUrlSubmit }: HeroProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    try {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)?([da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
      if (!urlPattern.test(url)) {
        alert("Please enter a valid URL address")
        return
      }

      // Add protocol if missing
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`

      if (onUrlSubmit) {
        onUrlSubmit(formattedUrl)
      }
    } catch (error) {
      console.error("URL processing error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-background dark:to-pink-950/20">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Discover Creative Inspiration
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Enter URL
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Find Ad Creatives
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Paste any website link and we'll analyze it to show you related advertising creative cases, helping you gain
            design inspiration and marketing insights
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white dark:bg-card rounded-2xl shadow-lg border">
            <Input
              type="text"
              placeholder="Enter website URL, e.g.: apple.com or https://www.nike.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
            />
            <Button
              type="submit"
              disabled={!url.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Find Creatives
                </div>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-8">
          <p className="text-sm text-muted-foreground mb-3">Try these popular websites:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["https://socialbeta.com/", "https://www.digitaling.com/", "https://www.adquan.com/", "https://www.woshipm.com/"].map((example) => (
              <button
                key={example}
                onClick={() => setUrl(example)}
                className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
