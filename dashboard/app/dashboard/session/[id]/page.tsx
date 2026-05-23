import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Youtube, Globe, MessageSquare, Clock } from 'lucide-react'
import { SessionTabs } from '@/components/session/session-tabs'
import type { SessionWithOutput } from '@/lib/types'

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
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: session } = await supabase
    .from('sessions')
    .select(`
      *,
      study_outputs (*)
    `)
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!session) {
    notFound()
  }

  const typedSession = session as SessionWithOutput
  const studyOutput = typedSession.study_outputs?.[0]
  const Icon = sourceIcons[typedSession.source_type]

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground hover:text-foreground">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="mb-8 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold leading-tight">{typedSession.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded border border-border px-1.5 py-0.5 font-medium">
              {sourceLabels[typedSession.source_type]}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(typedSession.created_at)}
            </span>
            {typedSession.source_data && (
              <span className="max-w-xs truncate opacity-60">{typedSession.source_data}</span>
            )}
          </div>
        </div>
      </div>

      {studyOutput ? (
        <SessionTabs studyOutput={studyOutput} />
      ) : (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
          No study materials generated yet.
        </div>
      )}
    </div>
  )
}
