import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { LanguageModel } from 'ai'

export function getGeminiStudyModel(): LanguageModel {
  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ??
    process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      'Missing GOOGLE_GENERATIVE_AI_API_KEY. Get a free key at https://aistudio.google.com/apikey',
    )
  }

  const modelId =
    process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'

  const google = createGoogleGenerativeAI({ apiKey })
  return google(modelId)
}
