'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, RotateCcw, ChevronRight } from 'lucide-react'
import type { QuizQuestion } from '@/lib/types'

interface QuizViewProps {
  questions: QuizQuestion[]
}

type AnswerState = {
  [questionId: string]: {
    selectedIndex: number
    isCorrect: boolean
  }
}

export function QuizView({ questions }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerState>({})
  const [showResults, setShowResults] = useState(false)

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No quiz questions available
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentIndex]
  const currentAnswer = answers[currentQuestion.id]
  const totalAnswered = Object.keys(answers).length
  const correctAnswers = Object.values(answers).filter((a) => a.isCorrect).length

  const handleSelectAnswer = (optionIndex: number) => {
    if (currentAnswer) return // Already answered

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selectedIndex: optionIndex,
        isCorrect: optionIndex === currentQuestion.correctIndex,
      },
    }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setAnswers({})
    setCurrentIndex(0)
    setShowResults(false)
  }

  if (showResults) {
    const percentage = Math.round((correctAnswers / questions.length) * 100)
    
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <CardDescription>Here are your results</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="flex flex-col items-center">
            <div
              className={`text-5xl font-bold ${
                percentage >= 70 ? 'text-success' : percentage >= 50 ? 'text-yellow-500' : 'text-destructive'
              }`}
            >
              {percentage}%
            </div>
            <p className="mt-2 text-muted-foreground">
              {correctAnswers} out of {questions.length} correct
            </p>
          </div>

          <div className="w-full space-y-3">
            {questions.map((question, index) => {
              const answer = answers[question.id]
              return (
                <div
                  key={question.id}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    answer?.isCorrect ? 'border-success/50 bg-success/5' : 'border-destructive/50 bg-destructive/5'
                  }`}
                >
                  {answer?.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-destructive" />
                  )}
                  <span className="text-sm">
                    <span className="font-medium">Q{index + 1}:</span> {question.question}
                  </span>
                </div>
              )
            })}
          </div>

          <Button onClick={handleReset} className="mt-4">
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-sm text-muted-foreground">
          {totalAnswered} answered
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = currentAnswer?.selectedIndex === index
            const isCorrect = index === currentQuestion.correctIndex
            const showFeedback = currentAnswer !== undefined

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                disabled={currentAnswer !== undefined}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                  showFeedback
                    ? isCorrect
                      ? 'border-success bg-success/10 text-success'
                      : isSelected
                        ? 'border-destructive bg-destructive/10 text-destructive'
                        : 'border-border opacity-50'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                    showFeedback && isCorrect
                      ? 'border-success bg-success text-success-foreground'
                      : showFeedback && isSelected
                        ? 'border-destructive bg-destructive text-destructive-foreground'
                        : 'border-muted-foreground/50'
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showFeedback && isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                {showFeedback && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </button>
            )
          })}

          {currentAnswer && currentQuestion.explanation && (
            <div className="mt-4 rounded-lg bg-muted/50 p-4">
              <p className="text-sm font-medium">Explanation:</p>
              <p className="mt-1 text-sm text-muted-foreground">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!currentAnswer}>
          {currentIndex < questions.length - 1 ? (
            <>
              Next Question
              <ChevronRight className="h-4 w-4" />
            </>
          ) : (
            'See Results'
          )}
        </Button>
      </div>
    </div>
  )
}
