import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MindmapNode } from '@/lib/types'

interface MindmapViewProps {
  nodes: MindmapNode[]
}

function MindmapNodeItem({ node, level = 0 }: { node: MindmapNode; level?: number }) {
  const colors = [
    'bg-primary/10 border-primary/30 text-primary',
    'bg-accent/50 border-accent text-accent-foreground',
    'bg-muted border-border text-muted-foreground',
  ]

  const colorClass = colors[Math.min(level, colors.length - 1)]

  return (
    <div className="flex flex-col">
      <div
        className={`rounded-lg border px-3 py-2 text-sm font-medium ${colorClass}`}
        style={{ marginLeft: level * 24 }}
      >
        {node.label}
      </div>
      {node.children && node.children.length > 0 && (
        <div className="mt-2 flex flex-col gap-2">
          {node.children.map((child) => (
            <MindmapNodeItem key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function MindmapView({ nodes }: MindmapViewProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No mindmap available
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Concept Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {nodes.map((node) => (
            <MindmapNodeItem key={node.id} node={node} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
