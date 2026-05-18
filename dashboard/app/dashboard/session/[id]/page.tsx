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
  pdf: 'PDF Document',
  youtube: 'YouTube Video',
  article: 'Web Article',
  text: 'Plain Text',
} as const

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
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
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Back to sessions
        </Link>
      </Button>

      <div className="mb-8">
        <div className="mb-4 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{typedSession.title}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                {sourceLabels[typedSession.source_type]}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(typedSession.created_at)}
              </span>
              {typedSession.source_data && (
                <span className="max-w-xs truncate">{typedSession.source_data}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {studyOutput ? (
        <SessionTabs studyOutput={studyOutput} />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No study materials generated yet.</p>
        </div>
      )}
    </div>
  )
}
