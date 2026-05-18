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
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
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
          Card {currentIndex + 1} of {cards.length}
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleShuffle} title="Shuffle cards">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset} title="Reset order">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="w-full max-w-2xl perspective-1000">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="group relative h-64 w-full cursor-pointer sm:h-80"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div
            className={`absolute inset-0 transition-transform duration-500 ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <Card
              className="absolute inset-0 flex items-center justify-center p-6 backface-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <CardContent className="flex flex-col items-center justify-center p-0 text-center">
                <span className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Question
                </span>
                <p className="text-lg font-medium leading-relaxed sm:text-xl">{currentCard.front}</p>
                <span className="mt-4 text-xs text-muted-foreground">Click to reveal answer</span>
              </CardContent>
            </Card>

            {/* Back */}
            <Card
              className="absolute inset-0 flex items-center justify-center bg-primary/5 p-6 [transform:rotateY(180deg)]"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <CardContent className="flex flex-col items-center justify-center p-0 text-center">
                <span className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">
                  Answer
                </span>
                <p className="text-lg leading-relaxed sm:text-xl">{currentCard.back}</p>
                <span className="mt-4 text-xs text-muted-foreground">Click to see question</span>
              </CardContent>
            </Card>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={handlePrev} disabled={cards.length <= 1}>
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext} disabled={cards.length <= 1}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress dots */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {cards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsFlipped(false)
            }}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-primary' : 'bg-muted hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
