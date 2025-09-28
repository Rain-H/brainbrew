import { NextRequest } from "next/server"

export const runtime = "nodejs"

// Simple in-memory rate limiter (best-effort; suitable for demo/first version)
type RateRecord = { tokens: number; updatedAtMs: number }
const RATE_LIMIT_CAPACITY = 20 // max requests per window
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const rateStore = new Map<string, RateRecord>()

function getClientKey(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for") || ""
  const ip = forwardedFor.split(",")[0]?.trim() || req.ip || "unknown"
  const userId = req.headers.get("x-user-id") || "anon"
  return `${ip}:${userId}`
}

function takeToken(key: string): boolean {
  const now = Date.now()
  const record = rateStore.get(key) || { tokens: RATE_LIMIT_CAPACITY, updatedAtMs: now }
  const elapsed = now - record.updatedAtMs
  // Refill tokens linearly over the window
  if (elapsed > 0) {
    const refill = (elapsed / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_CAPACITY
    record.tokens = Math.min(RATE_LIMIT_CAPACITY, record.tokens + refill)
    record.updatedAtMs = now
  }

  if (record.tokens >= 1) {
    record.tokens -= 1
    rateStore.set(key, record)
    return true
  }
  rateStore.set(key, record)
  return false
}

export async function POST(req: NextRequest) {
  const key = getClientKey(req)
  if (!takeToken(key)) {
    return new Response(JSON.stringify({ error: "Too Many Requests" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    })
  }

  const { url } = await req.json().catch(() => ({ url: "" }))
  if (!url || typeof url !== "string") {
    return new Response(JSON.stringify({ error: "Missing 'url' in body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    })
  }

  const apiKey = process.env.DIFY_API_KEY
  const baseUrl = process.env.DIFY_API_BASE || process.env.DIFY_BASE_URL || "https://udify.app"
  const workflowId = process.env.DIFY_WORKFLOW_ID

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Server not configured: missing DIFY_API_KEY" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    })
  }

  // Build endpoint: prefer workflow ID style if provided, otherwise generic run
  const endpoint = workflowId
    ? `${baseUrl.replace(/\/$/, "")}/v1/workflows/${workflowId}/run`
    : `${baseUrl.replace(/\/$/, "")}/v1/workflows/run`

  // Compose Dify request for streaming mode
  // Send both lowercase and uppercase keys for compatibility with workflow form fields
  const body = {
    inputs: { url, URL: url },
    response_mode: "streaming",
    user: key,
  }

  let difyResp: Response
  try {
    difyResp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Upstream request failed", detail: String(err) }), {
      status: 502,
      headers: { "content-type": "application/json" },
    })
  }

  if (!difyResp.ok || !difyResp.body) {
    const text = await difyResp.text().catch(() => "")
    return new Response(
      JSON.stringify({ error: "Upstream error", status: difyResp.status, detail: text || "" }),
      { status: 502, headers: { "content-type": "application/json" } },
    )
  }

  // Proxy the SSE stream as-is
  const headers = new Headers()
  headers.set("content-type", "text/event-stream; charset=utf-8")
  headers.set("cache-control", "no-cache, no-transform")
  headers.set("connection", "keep-alive")
  headers.set("x-accel-buffering", "no")

  return new Response(difyResp.body, { status: 200, headers })
}


