import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Don't throw at module load so build can complete when env is not available (e.g. CI).
// Validation happens when the client is first used.
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL)')
  return url
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  return key
}

let _client: SupabaseClient | null = null
function getBrowserClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(getSupabaseUrl(), getSupabaseAnonKey())
  }
  return _client
}

// Client-side Supabase client (for use in React components). Throws only when first used if env is missing.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getBrowserClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

const SERVER_FETCH_TIMEOUT_MS = 90_000  // 90s for Storage/DB when project is slow or waking
const SERVER_FETCH_MAX_RETRIES = 3
const SERVER_FETCH_RETRY_DELAY_MS = 3000

function isRetryable(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  const m = msg.toLowerCase()
  return m.includes('timed out') || m.includes('timeout') || m.includes('abort') || m.includes('econnreset') || m.includes('fetch failed') || m.includes('network')
}

/** Single attempt: fetch with timeout */
function fetchWithTimeout(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), SERVER_FETCH_TIMEOUT_MS)
  return fetch(input, { ...init, signal: init?.signal ?? controller.signal })
    .then((res) => {
      clearTimeout(id)
      return res
    })
    .catch((err) => {
      clearTimeout(id)
      throw err
    })
}

/** Server-side fetch with long timeout and retries to avoid "connection timed out" with Supabase */
async function serverFetchWithTimeout(input: RequestInfo | URL, init?: RequestInit, attempt = 1): Promise<Response> {
  try {
    return await fetchWithTimeout(input, init)
  } catch (err) {
    if (attempt < SERVER_FETCH_MAX_RETRIES && isRetryable(err)) {
      await new Promise((r) => setTimeout(r, SERVER_FETCH_RETRY_DELAY_MS))
      return serverFetchWithTimeout(input, init, attempt + 1)
    }
    throw err
  }
}

// Server-side client (for API routes)
// Uses service role key and a fetch with long timeout + retries to avoid DB/Storage timeouts
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }
  const supabaseUrl = getSupabaseUrl()
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: serverFetchWithTimeout as typeof fetch,
    },
  })
}
