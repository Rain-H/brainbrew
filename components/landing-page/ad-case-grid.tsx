"use client"

import { useEffect, useRef, useState } from "react"

interface AdCaseGridProps {
  searchUrl?: string
}

// Note: Previously this component rendered mock cards. Those have been removed
// so the page only shows streaming results from the workflow.

export default function AdCaseGrid({ searchUrl }: AdCaseGridProps) {
  const [loading, setLoading] = useState(false)
  const [streamText, setStreamText] = useState("")
  const abortRef = useRef<AbortController | null>(null)

  // No initial mock data loading anymore

  useEffect(() => {
    if (!searchUrl) return

    // cancel any previous stream
    if (abortRef.current) {
      abortRef.current.abort()
      abortRef.current = null
    }

    const controller = new AbortController()
    abortRef.current = controller
    setStreamText("")

    async function run() {
      setLoading(true)
      try {
        const resp = await fetch("/api/workflow", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-user-id": getOrCreateUserId(),
          },
          body: JSON.stringify({ url: searchUrl }),
          signal: controller.signal,
        })
        if (!resp.ok || !resp.body) {
          const txt = await resp.text().catch(() => "")
          setStreamText((t) => t + (txt || "[Error: upstream failed]"))
          return
        }

        const reader = resp.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })

          // SSE events are separated by double newlines
          const chunks = buffer.split("\n\n")
          buffer = chunks.pop() || ""
          for (const chunk of chunks) {
            const lines = chunk.split("\n")
            for (const line of lines) {
              if (line.startsWith("data:")) {
                const payload = line.slice(5).trim()
                if (!payload || payload === "[DONE]") continue
                try {
                  const obj = JSON.parse(payload)
                  const delta =
                    obj.data?.answer ||
                    obj.data?.text ||
                    obj.data?.output_text ||
                    obj.answer ||
                    obj.delta ||
                    obj.output ||
                    ""
                  if (typeof delta === "string") {
                    setStreamText((t) => t + delta)
                  }
                } catch {
                  setStreamText((t) => t + payload)
                }
              }
            }
          }
        }
      } catch (e) {
        if ((e as any)?.name !== "AbortError") {
          setStreamText((t) => t + `\n[Stream error] ${String(e)}`)
        }
      } finally {
        setLoading(false)
      }
    }

    run()
    return () => controller.abort()
  }, [searchUrl])

  function getOrCreateUserId(): string {
    const KEY = "naodong_uid"
    try {
      const existing = localStorage.getItem(KEY)
      if (existing) return existing
      const value = crypto.randomUUID()
      localStorage.setItem(KEY, value)
      return value
    } catch {
      return "anon"
    }
  }

  // Remove mock grid; show only streaming area and a lightweight loading text

  return (
    <div className="space-y-4">
      {searchUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Streaming result</h3>
          <div className="whitespace-pre-wrap text-sm bg-muted/30 rounded-lg p-4 border min-h-24">
            {streamText || (loading ? "Fetching content, this may take 30–60s..." : "Waiting for response...")}
          </div>
        </div>
      )}
    </div>
  )
}
