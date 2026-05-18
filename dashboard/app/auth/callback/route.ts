import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseEnv } from '@/lib/supabase/env'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  let next = searchParams.get('next') ?? '/dashboard'

  if (!next.startsWith('/')) {
    next = '/dashboard'
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error?error=missing_code`)
  }

  const { url, anonKey } = getSupabaseEnv()
  const successResponse = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        cookiesToSet.forEach(({ name, value, options }) => {
          successResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Auth callback exchangeCodeForSession:', error.message)
    return NextResponse.redirect(
      `${origin}/auth/error?error=${encodeURIComponent(error.message)}`,
    )
  }

  return successResponse
}
