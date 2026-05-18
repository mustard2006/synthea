import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { APP_NAME } from '@/lib/brand'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BrandMark } from '@/components/brand-mark'
import { FileText, Youtube, Globe, MessageSquare, Brain, Layers, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      redirect('/dashboard')
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <BrandMark />
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/sign-up">Create account</Link>
            </Button>
          </div>
        </div>
      </header>

      {!isSupabaseConfigured() && (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm">
          <p className="font-medium text-amber-900 dark:text-amber-100">
            Supabase is not configured.
          </p>
          <p className="mt-1 text-muted-foreground">
            Copy <code className="rounded bg-muted px-1">dashboard/.env.example</code> to{' '}
            <code className="rounded bg-muted px-1">dashboard/.env.local</code>, add your keys, then restart{' '}
            <code className="rounded bg-muted px-1">npm run dev</code>.
          </p>
        </div>
      )}

      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
        <p className="mb-4 text-sm font-medium text-muted-foreground">Personal study workspace</p>
        <h1 className="mb-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Turn any content into study materials
        </h1>
        <p className="mb-8 max-w-2xl text-pretty text-lg text-muted-foreground">
          Upload PDFs, paste YouTube links, or add articles. Get summaries, flashcards, quizzes, and concept maps in one place.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/auth/sign-up">
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">How it works</h2>
            <p className="text-muted-foreground">Three steps from source to review</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-card">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>1. Add your content</CardTitle>
                <CardDescription>
                  Upload PDFs, paste YouTube URLs, add article links, or type your own notes
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>2. Generate materials</CardTitle>
                <CardDescription>
                  Extract the text and build summaries, key concepts, and practice content
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>3. Review and practice</CardTitle>
                <CardDescription>
                  Use flashcards, quizzes, and concept maps to work through the material
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold">Supported content types</h2>
            <p className="text-muted-foreground">Learn from any source you prefer</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-card">
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-medium">PDF documents</p>
                  <p className="text-sm text-muted-foreground">Textbooks, papers, notes</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600/10">
                  <Youtube className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">YouTube videos</p>
                  <p className="text-sm text-muted-foreground">Lectures, tutorials</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <Globe className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Web articles</p>
                  <p className="text-sm text-muted-foreground">Blogs, news, docs</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="flex items-center gap-3 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Plain text</p>
                  <p className="text-sm text-muted-foreground">Your own notes</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t bg-primary py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="mb-3 text-3xl font-bold text-primary-foreground">Ready to start?</h2>
          <p className="mb-6 text-primary-foreground/80">
            Save sessions and pick up where you left off.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/auth/sign-up">
              Create account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <BrandMark nameClassName="font-semibold" />
            <p className="text-sm text-muted-foreground">
              {APP_NAME} — personal studying dashboard
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
