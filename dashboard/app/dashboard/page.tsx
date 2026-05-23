import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
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
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Sessions</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/new">
            <Plus className="h-4 w-4" />
            New session
          </Link>
        </Button>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="mb-1 text-sm font-medium">No sessions yet</p>
          <p className="mb-4 text-sm text-muted-foreground">Create your first study session to get started</p>
          <Button asChild size="sm">
            <Link href="/dashboard/new">
              <Plus className="h-4 w-4" />
              New session
            </Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {sessions.map((session: Session) => {
            const Icon = sourceIcons[session.source_type]
            return (
              <Link
                key={session.id}
                href={`/dashboard/session/${session.id}`}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/40 first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{session.title}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatDate(session.created_at)}
                  </p>
                </div>
                <span className="shrink-0 rounded border border-border px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                  {sourceLabels[session.source_type]}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
