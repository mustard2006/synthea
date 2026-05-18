export interface Session {
  id: string
  user_id: string
  title: string
  source_type: 'pdf' | 'youtube' | 'article' | 'text'
  source_data: string | null
  created_at: string
}

export interface KeyConcept {
  term: string
  definition: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string
}

export interface MindmapNode {
  id: string
  label: string
  children?: MindmapNode[]
}

export interface StudyOutput {
  id: string
  session_id: string
  summary: string | null
  key_concepts: KeyConcept[]
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
  mindmap: MindmapNode[]
  created_at: string
}

export interface SessionWithOutput extends Session {
  study_outputs: StudyOutput[]
}
