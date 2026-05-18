import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateObject } from 'ai'
import { z } from 'zod'
import { getStudyModel } from '@/lib/study-model'
import {
  extractTextFromPDF,
  fetchArticleContent,
  fetchYouTubeTranscript,
} from '@/lib/extract'

const studyOutputSchema = z.object({
  summary: z.string().describe('A comprehensive 2-3 paragraph summary of the content'),
  key_concepts: z.array(
    z.object({
      term: z.string().describe('The key term or concept'),
      definition: z.string().describe('A clear, concise definition'),
    })
  ).describe('5-10 key concepts from the content'),
  flashcards: z.array(
    z.object({
      id: z.string(),
      front: z.string().describe('The question or prompt'),
      back: z.string().describe('The answer or explanation'),
    })
  ).describe('10-15 flashcards covering the main points'),
  quiz: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      options: z.array(z.string()).length(4).describe('Four answer options'),
      correctIndex: z.number().min(0).max(3).describe('Index of the correct answer (0-3)'),
      explanation: z.string().describe('Brief explanation of the correct answer'),
    })
  ).describe('5-10 multiple choice quiz questions'),
  mindmap: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      children: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          children: z.array(
            z.object({
              id: z.string(),
              label: z.string(),
            })
          ).optional(),
        })
      ).optional(),
    })
  ).describe('A hierarchical mindmap structure with main topics and subtopics'),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const sourceType = formData.get('sourceType') as string
    const title = formData.get('title') as string

    if (!sourceType || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let content: string
    let sourceData: string | null = null

    switch (sourceType) {
      case 'pdf': {
        const file = formData.get('file') as File
        if (!file) {
          return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }
        content = await extractTextFromPDF(file)
        sourceData = file.name
        break
      }
      case 'youtube': {
        const url = formData.get('url') as string
        if (!url) {
          return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
        }
        content = await fetchYouTubeTranscript(url)
        sourceData = url
        break
      }
      case 'article': {
        const url = formData.get('url') as string
        if (!url) {
          return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
        }
        content = await fetchArticleContent(url)
        sourceData = url
        break
      }
      case 'text': {
        const text = formData.get('text') as string
        if (!text) {
          return NextResponse.json({ error: 'No text provided' }, { status: 400 })
        }
        content = text.slice(0, 50000)
        break
      }
      default:
        return NextResponse.json({ error: 'Invalid source type' }, { status: 400 })
    }

    if (!content.trim()) {
      return NextResponse.json({ error: 'No extractable content found' }, { status: 400 })
    }

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        title,
        source_type: sourceType,
        source_data: sourceData,
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    const { object: studyOutput } = await generateObject({
      model: getStudyModel(),
      schema: studyOutputSchema,
      prompt: `You are an expert educator. Analyze the following content and generate comprehensive study materials including a summary, key concepts with definitions, flashcards, quiz questions, and a mindmap structure.

Content to analyze:
${content}

Generate engaging and educational study materials that will help a student learn and retain this information effectively.`,
    })

    const { error: outputError } = await supabase
      .from('study_outputs')
      .insert({
        session_id: session.id,
        summary: studyOutput.summary,
        key_concepts: studyOutput.key_concepts,
        flashcards: studyOutput.flashcards,
        quiz: studyOutput.quiz,
        mindmap: studyOutput.mindmap,
      })

    if (outputError) {
      console.error('Study output creation error:', outputError)
      await supabase.from('sessions').delete().eq('id', session.id)
      return NextResponse.json({ error: 'Failed to generate study materials' }, { status: 500 })
    }

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
