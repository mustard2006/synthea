import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Youtube, Globe, MessageSquare, Clock } from 'lucide-react'
import type { Session } from '@/lib/types'

const sourceIcons = {
  pdf: FileText,
  youtube: Youtube,
  article: Globe,
  text: MessageSquare,
} as const

const sourceLabels = {
  pdf: 'PDF',
  youtube: 'YouTube',
  article: 'Article',
  text: 'Text',
} as const

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
  
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Study Sessions</h1>
          <p className="text-muted-foreground">Create and manage your study materials</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus className="h-4 w-4" />
            New Session
          </Link>
        </Button>
      </div>

      {!sessions || sessions.length === 0 ? (
        <Card className="py-16 text-center">
          <CardContent>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No sessions yet</h3>
            <p className="mb-4 text-muted-foreground">
              Create your first study session to get started
            </p>
            <Button asChild>
              <Link href="/dashboard/new">
                <Plus className="h-4 w-4" />
                Create session
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session: Session) => {
            const Icon = sourceIcons[session.source_type]
            return (
              <Link key={session.id} href={`/dashboard/session/${session.id}`}>
                <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/30">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {sourceLabels[session.source_type]}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg">{session.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(session.created_at)}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
