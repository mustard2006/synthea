import '@/lib/pdf-setup'
import * as cheerio from 'cheerio'
import { PDFParse } from 'pdf-parse'
import { YoutubeTranscript } from 'youtube-transcript'

const MAX_CONTENT_LENGTH = 50_000

function truncate(text: string): string {
  return text.length > MAX_CONTENT_LENGTH
    ? text.slice(0, MAX_CONTENT_LENGTH)
    : text
}

export async function extractTextFromPDF(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const parser = new PDFParse({ data: buffer })

  try {
    const result = await parser.getText()
    return truncate(result.text.trim())
  } finally {
    await parser.destroy()
  }
}

export async function fetchYouTubeTranscript(url: string): Promise<string> {
  const videoIdMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/,
  )
  const videoId = videoIdMatch?.[1]

  if (!videoId) {
    throw new Error('Invalid YouTube URL')
  }

  const segments = await YoutubeTranscript.fetchTranscript(videoId)
  const text = segments.map((segment) => segment.text).join(' ').trim()

  if (!text) {
    throw new Error('No transcript found for this video')
  }

  return truncate(text)
}

export async function fetchArticleContent(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; StudyDash/1.0)',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch article')
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  $('script, style, nav, footer, header, aside, noscript').remove()

  const mainText =
    $('article').text().trim() ||
    $('main').text().trim() ||
    $('[role="main"]').text().trim() ||
    $('body').text().trim()

  const text = mainText.replace(/\s+/g, ' ').trim()

  if (!text) {
    throw new Error('No readable content found in this URL')
  }

  return truncate(text)
}
