import { createAzure } from '@ai-sdk/azure'
import type { LanguageModel } from 'ai'

function getAzureConfig() {
  const apiKey =
    process.env.AZURE_OPENAI_API_KEY ?? process.env.AZURE_API_KEY
  const resourceName =
    process.env.AZURE_OPENAI_RESOURCE_NAME ?? process.env.AZURE_RESOURCE_NAME
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/$/, '')
  const apiVersion =
    process.env.AZURE_OPENAI_API_VERSION ?? '2024-08-01-preview'

  if (!apiKey) {
    throw new Error(
      'Missing AZURE_OPENAI_API_KEY. Add it to .env.local (Azure Portal → your OpenAI resource → Keys and Endpoint).',
    )
  }

  if (endpoint) {
    return {
      baseURL: endpoint,
      apiKey,
      apiVersion,
      useDeploymentBasedUrls: true,
    } as const
  }

  if (!resourceName) {
    throw new Error(
      'Missing AZURE_OPENAI_RESOURCE_NAME or AZURE_OPENAI_ENDPOINT. Add one to .env.local.',
    )
  }

  return {
    resourceName,
    apiKey,
    apiVersion,
    useDeploymentBasedUrls: true,
  } as const
}

/** Azure OpenAI model for study material generation (deployment name from Azure Portal). */
export function getAzureStudyModel(): LanguageModel {
  const deployment =
    process.env.AZURE_OPENAI_DEPLOYMENT ??
    process.env.AZURE_OPENAI_DEPLOYMENT_NAME ??
    'gpt-4o-mini'

  const azure = createAzure(getAzureConfig())
  return azure(deployment)
}
