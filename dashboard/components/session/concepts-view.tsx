'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import type { KeyConcept } from '@/lib/types'

interface ConceptsViewProps {
  concepts: KeyConcept[]
}

const CATEGORY_COLORS = [
  { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30', bar: 'bg-blue-500/60' },
  { badge: 'bg-violet-500/15 text-violet-400 border-violet-500/30', bar: 'bg-violet-500/60' },
  { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', bar: 'bg-amber-500/60' },
  { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', bar: 'bg-emerald-500/60' },
  { badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30', bar: 'bg-rose-500/60' },
  { badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', bar: 'bg-cyan-500/60' },
]

function highlightText(text: string, query: string) {
  if (!query) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-amber-500/20 text-amber-300 not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  )
}

export function ConceptsView({ concepts }: ConceptsViewProps) {
  const [query, setQuery] = useState('')

  const hasCategorized = concepts.some((c) => c.category)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return concepts
    return concepts.filter(
      (c) => c.term.toLowerCase().includes(q) || c.definition.toLowerCase().includes(q),
    )
  }, [concepts, query])

  // Build category groups (preserving insertion order for consistent coloring)
  const categoryGroups = useMemo(() => {
    const map = new Map<string, KeyConcept[]>()
    const sorted = hasCategorized
      ? [...filtered].sort((a, b) => {
          const catCmp = (a.category ?? 'Other').localeCompare(b.category ?? 'Other')
          return catCmp !== 0 ? catCmp : a.term.localeCompare(b.term)
        })
      : [...filtered].sort((a, b) => a.term.localeCompare(b.term))

    for (const concept of sorted) {
      const key = concept.category ?? 'Other'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(concept)
    }
    return map
  }, [filtered, hasCategorized])

  const categoryKeys = Array.from(categoryGroups.keys())

  if (!concepts || concepts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-12 text-center text-muted-foreground">
        No concepts available
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search concepts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No concepts match &ldquo;{query}&rdquo;
        </p>
      )}

      {categoryKeys.map((cat, catIdx) => {
        const color = CATEGORY_COLORS[catIdx % CATEGORY_COLORS.length]
        const items = categoryGroups.get(cat)!
        return (
          <div key={cat}>
            <div className="mb-3 flex items-center gap-2">
              <span className={`rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${color.badge}`}>
                {cat}
              </span>
              <span className="text-xs text-muted-foreground/50">{items.length} term{items.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((concept, i) => (
                <div key={i} className="flex gap-0 overflow-hidden rounded-lg border border-border bg-card">
                  <div className={`w-1 shrink-0 ${color.bar}`} />
                  <div className="min-w-0 flex-1 p-3.5">
                    <p className="mb-1 text-sm font-semibold leading-tight">
                      {query ? highlightText(concept.term, query) : concept.term}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {query ? highlightText(concept.definition, query) : concept.definition}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
