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

export function SessionTabs({ studyOutput }: SessionTabsProps) {
  const [activeTab, setActiveTab] = useState('summary')

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6 grid w-full grid-cols-5">
        <TabsTrigger value="summary" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Summary</span>
        </TabsTrigger>
        <TabsTrigger value="concepts" className="flex items-center gap-2">
          <Tags className="h-4 w-4" />
          <span className="hidden sm:inline">Concepts</span>
        </TabsTrigger>
        <TabsTrigger value="flashcards" className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span className="hidden sm:inline">Flashcards</span>
        </TabsTrigger>
        <TabsTrigger value="quiz" className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Quiz</span>
        </TabsTrigger>
        <TabsTrigger value="mindmap" className="flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          <span className="hidden sm:inline">Mindmap</span>
        </TabsTrigger>
      </TabsList>

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
    </Tabs>
  )
}
