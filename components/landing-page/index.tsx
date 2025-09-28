"use client"

import { useState } from "react"
import Header from "./header"
import Hero from "./hero"
import AdCaseGrid from "./ad-case-grid"
import Footer from "./footer"
import type { LandingPageProps } from "./types"

// Export individual components for flexible usage
export { Header, Hero, AdCaseGrid, Footer }

export default function LandingPage({ showHeader = true, showFooter = true }: LandingPageProps) {
  const [showAdCases, setShowAdCases] = useState(false)
  const [searchUrl, setSearchUrl] = useState("")

  const handleUrlSubmit = (url: string) => {
    setSearchUrl(url)
    setShowAdCases(true)
    // Scroll to results section
    setTimeout(() => {
      const resultsSection = document.getElementById("results-section")
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  return (
    <main className="min-h-screen bg-background">
      {showHeader && <Header />}

      <Hero onUrlSubmit={handleUrlSubmit} />

      {showAdCases && (
        <div id="results-section" className="container mx-auto px-4 py-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Creative Inspiration Found for "{searchUrl}"</h2>
            <p className="text-muted-foreground">
              Here are advertising creative cases related to the website you entered
            </p>
          </div>
          <AdCaseGrid searchUrl={searchUrl} />
        </div>
      )}

      {showFooter && <Footer />}
    </main>
  )
}
