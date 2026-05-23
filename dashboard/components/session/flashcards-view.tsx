'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react'
import type { Flashcard } from '@/lib/types'

interface FlashcardsViewProps {
  flashcards: Flashcard[]
}

export function FlashcardsView({ flashcards }: FlashcardsViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cards, setCards] = useState(flashcards)

  if (!cards || cards.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No flashcards available
        </CardContent>
      </Card>
    )
  }

  const currentCard = cards[currentIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const handleShuffle = () => {
    setCards([...cards].sort(() => Math.random() - 0.5))
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const handleReset = () => {
    setCards(flashcards)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleShuffle} title="Shuffle">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset} title="Reset">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Perspective must sit on a plain div, not on the rotating element */}
      <div className="w-full max-w-2xl" style={{ perspective: '1200px' }}>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative h-64 w-full cursor-pointer sm:h-72"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front face */}
          <Card
            className="absolute inset-0 flex items-center justify-center p-6"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <CardContent className="flex flex-col items-center justify-center p-0 text-center">
              <span className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Question
              </span>
              <p className="text-lg font-medium leading-relaxed sm:text-xl">{currentCard.front}</p>
              <span className="mt-6 text-xs text-muted-foreground/60">tap to flip</span>
            </CardContent>
          </Card>

          {/* Back face — pre-rotated 180° so it faces away until the button flips */}
          <Card
            className="absolute inset-0 flex items-center justify-center border-primary/20 bg-primary/5 p-6"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-0 text-center">
              <span className="mb-3 text-xs font-medium uppercase tracking-widest text-primary/70">
                Answer
              </span>
              <p className="text-lg leading-relaxed sm:text-xl">{currentCard.back}</p>
              <span className="mt-6 text-xs text-muted-foreground/60">tap to flip back</span>
            </CardContent>
          </Card>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={handlePrev} disabled={cards.length <= 1}>
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <Button onClick={handleNext} disabled={cards.length <= 1}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentIndex(index); setIsFlipped(false) }}
            className={`h-1.5 w-1.5 rounded-full transition-colors ${
              index === currentIndex ? 'bg-foreground' : 'bg-border hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
