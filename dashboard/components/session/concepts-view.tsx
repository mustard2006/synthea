import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { KeyConcept } from '@/lib/types'

interface ConceptsViewProps {
  concepts: KeyConcept[]
}

export function ConceptsView({ concepts }: ConceptsViewProps) {
  if (!concepts || concepts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No concepts available
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Key Concepts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {concepts.map((concept, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {concept.term}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {concepts.map((concept, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{concept.term}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{concept.definition}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
