import type { LanguageModel } from 'ai'
import { getAzureStudyModel } from '@/lib/azure-openai'
import { getGeminiStudyModel } from '@/lib/gemini'

export type AIProvider = 'gemini' | 'azure'

function resolveProvider(): AIProvider {
  const explicit = process.env.AI_PROVIDER?.toLowerCase()
  if (explicit === 'gemini' || explicit === 'azure') {
    return explicit
  }

  const hasGemini = Boolean(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY,
  )
  const hasAzure = Boolean(
    process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_API_KEY,
  )

  if (hasGemini && !hasAzure) return 'gemini'
  if (hasAzure && !hasGemini) return 'azure'
  if (hasGemini) return 'gemini'

  return 'azure'
}

/** Model used to generate summaries, flashcards, quiz, etc. */
export function getStudyModel(): LanguageModel {
  const provider = resolveProvider()

  if (provider === 'gemini') {
    return getGeminiStudyModel()
  }

  return getAzureStudyModel()
}
