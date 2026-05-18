import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SummaryViewProps {
  summary: string | null
}

export function SummaryView({ summary }: SummaryViewProps) {
  if (!summary) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No summary available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          {summary.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
