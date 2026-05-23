'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SummaryView } from './summary-view'
import { ConceptsView } from './concepts-view'
import { FlashcardsView } from './flashcards-view'
import { QuizView } from './quiz-view'
import { MindmapView } from './mindmap-view'
import { FileText, Tags, Layers, HelpCircle, GitBranch } from 'lucide-react'
import type { StudyOutput } from '@/lib/types'

interface SessionTabsProps {
  studyOutput: StudyOutput
}

const tabs = [
  { value: 'summary', label: 'Summary', icon: FileText },
  { value: 'concepts', label: 'Concepts', icon: Tags },
  { value: 'flashcards', label: 'Flashcards', icon: Layers },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
  { value: 'mindmap', label: 'Mindmap', icon: GitBranch },
]

export function SessionTabs({ studyOutput }: SessionTabsProps) {
  const [activeTab, setActiveTab] = useState('summary')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="border-b border-border">
        <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 pb-3 pt-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="pt-6">
        <TabsContent value="summary">
          <SummaryView summary={studyOutput.summary} />
        </TabsContent>
        <TabsContent value="concepts">
          <ConceptsView concepts={studyOutput.key_concepts} />
        </TabsContent>
        <TabsContent value="flashcards">
          <FlashcardsView flashcards={studyOutput.flashcards} />
        </TabsContent>
        <TabsContent value="quiz">
          <QuizView questions={studyOutput.quiz} />
        </TabsContent>
        <TabsContent value="mindmap">
          <MindmapView nodes={studyOutput.mindmap} />
        </TabsContent>
      </div>
    </Tabs>
  )
}
