import type { MindmapNode } from '@/lib/types'

interface MindmapViewProps {
  nodes: MindmapNode[]
}

const ACCENT_COLORS = [
  {
    card: 'border-blue-500/40 bg-blue-500/10',
    header: 'text-blue-300',
    dot: 'bg-blue-400/70',
    child: 'border-blue-500/20 bg-background/30',
    childText: 'text-blue-200/80',
    leaf: 'bg-blue-500/15 text-blue-300/80',
  },
  {
    card: 'border-violet-500/40 bg-violet-500/10',
    header: 'text-violet-300',
    dot: 'bg-violet-400/70',
    child: 'border-violet-500/20 bg-background/30',
    childText: 'text-violet-200/80',
    leaf: 'bg-violet-500/15 text-violet-300/80',
  },
  {
    card: 'border-amber-500/40 bg-amber-500/10',
    header: 'text-amber-300',
    dot: 'bg-amber-400/70',
    child: 'border-amber-500/20 bg-background/30',
    childText: 'text-amber-200/80',
    leaf: 'bg-amber-500/15 text-amber-300/80',
  },
  {
    card: 'border-emerald-500/40 bg-emerald-500/10',
    header: 'text-emerald-300',
    dot: 'bg-emerald-400/70',
    child: 'border-emerald-500/20 bg-background/30',
    childText: 'text-emerald-200/80',
    leaf: 'bg-emerald-500/15 text-emerald-300/80',
  },
  {
    card: 'border-rose-500/40 bg-rose-500/10',
    header: 'text-rose-300',
    dot: 'bg-rose-400/70',
    child: 'border-rose-500/20 bg-background/30',
    childText: 'text-rose-200/80',
    leaf: 'bg-rose-500/15 text-rose-300/80',
  },
  {
    card: 'border-cyan-500/40 bg-cyan-500/10',
    header: 'text-cyan-300',
    dot: 'bg-cyan-400/70',
    child: 'border-cyan-500/20 bg-background/30',
    childText: 'text-cyan-200/80',
    leaf: 'bg-cyan-500/15 text-cyan-300/80',
  },
]

export function MindmapView({ nodes }: MindmapViewProps) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
        No mindmap available
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {nodes.map((root, i) => {
        const c = ACCENT_COLORS[i % ACCENT_COLORS.length]
        return (
          <div key={root.id} className={`rounded-xl border p-5 ${c.card}`}>
            {/* Root label */}
            <p className={`mb-4 text-base font-bold leading-tight ${c.header}`}>
              {root.label}
            </p>

            {root.children && root.children.length > 0 && (
              <ul className="flex flex-col gap-2.5">
                {root.children.map((child) => (
                  <li key={child.id}>
                    <div className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 ${c.child}`}>
                      <span className={`mt-[5px] h-2 w-2 shrink-0 rounded-full ${c.dot}`} />
                      <div className="min-w-0 flex-1">
                        <span className={`text-sm font-medium leading-snug ${c.childText}`}>
                          {child.label}
                        </span>
                        {child.children && child.children.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {child.children.map((leaf) => (
                              <span
                                key={leaf.id}
                                className={`rounded-md px-2 py-0.5 text-xs font-medium ${c.leaf}`}
                              >
                                {leaf.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
