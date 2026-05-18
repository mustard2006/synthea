'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Youtube, Globe, MessageSquare, Upload, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type SourceType = 'pdf' | 'youtube' | 'article' | 'text'

const sourceOptions = [
  { type: 'pdf' as SourceType, icon: FileText, label: 'PDF Document', description: 'Upload a PDF file' },
  { type: 'youtube' as SourceType, icon: Youtube, label: 'YouTube Video', description: 'Paste a video URL' },
  { type: 'article' as SourceType, icon: Globe, label: 'Web Article', description: 'Paste an article URL' },
  { type: 'text' as SourceType, icon: MessageSquare, label: 'Plain Text', description: 'Type or paste text' },
]

export default function NewSessionPage() {
  const [sourceType, setSourceType] = useState<SourceType | null>(null)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file')
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      setFile(selectedFile)
      setError(null)
      if (!title) {
        setTitle(selectedFile.name.replace('.pdf', ''))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!sourceType) {
      setError('Please select a source type')
      return
    }

    if (!title.trim()) {
      setError('Please enter a title')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('sourceType', sourceType)
      formData.append('title', title.trim())

      if (sourceType === 'pdf' && file) {
        formData.append('file', file)
      } else if (sourceType === 'youtube' || sourceType === 'article') {
        if (!url.trim()) {
          setError('Please enter a URL')
          setLoading(false)
          return
        }
        formData.append('url', url.trim())
      } else if (sourceType === 'text') {
        if (!text.trim()) {
          setError('Please enter some text')
          setLoading(false)
          return
        }
        formData.append('text', text.trim())
      }

      const response = await fetch('/api/sessions', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session')
      }

      router.push(`/dashboard/session/${data.sessionId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to sessions
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Session</h1>
        <p className="text-muted-foreground">Choose a source and generate study materials for a new session</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Source Type Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium">Content Source</label>
          <div className="grid gap-3 sm:grid-cols-2">
            {sourceOptions.map(({ type, icon: Icon, label, description }) => (
              <button
                key={type}
                type="button"
                onClick={() => setSourceType(type)}
                className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                  sourceType === type
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    sourceType === type ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Title Input */}
        {sourceType && (
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Session Title
            </label>
            <Input
              id="title"
              placeholder="e.g., Chapter 5: Machine Learning Basics"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        {/* Source-specific Input */}
        {sourceType === 'pdf' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload PDF</CardTitle>
              <CardDescription>Maximum file size: 10MB</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-primary/50 hover:bg-muted/30">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                  disabled={loading}
                />
                {file ? (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                  </>
                )}
              </label>
            </CardContent>
          </Card>
        )}

        {sourceType === 'youtube' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="youtube-url" className="text-sm font-medium">
              YouTube URL
            </label>
            <Input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        {sourceType === 'article' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="article-url" className="text-sm font-medium">
              Article URL
            </label>
            <Input
              id="article-url"
              type="url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
          </div>
        )}

        {sourceType === 'text' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="text-content" className="text-sm font-medium">
              Your Content
            </label>
            <Textarea
              id="text-content"
              placeholder="Paste or type your study content here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              rows={10}
              className="resize-none"
            />
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        {sourceType && (
          <Button type="submit" disabled={loading} size="lg">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Generate Study Materials'
            )}
          </Button>
        )}
      </form>
    </div>
  )
}
