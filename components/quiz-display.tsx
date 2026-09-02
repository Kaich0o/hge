'use client'

import { useState } from 'react'
import { Check, RotateCcw, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { QuizQuestion } from '@/hooks/useQuizStore'

type Props = { questions: QuizQuestion[] }

export function QuizDisplay({ questions }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({})

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <Sparkles className="size-8 text-primary" />
        <h2 className="text-xl font-semibold">Your quiz is waiting</h2>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">Switch to Build quiz to add your first HGE CELE term and its choices.</p>
      </div>
    )
  }

  const answeredCount = Object.keys(answers).length
  const score = questions.filter((question) => answers[question.id] === question.correctId).length
  const isComplete = answeredCount === questions.length

  function reset() {
    setAnswers({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-6">
      {isComplete && (
        <div className="flex flex-col gap-4 rounded-2xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">Quiz complete</p>
            <p className="mt-1 text-3xl font-bold">{score} <span className="text-lg font-normal opacity-70">/ {questions.length} correct</span></p>
          </div>
          <Button onClick={reset} variant="secondary" className="rounded-xl"><RotateCcw data-icon="inline-start" />Retake quiz</Button>
        </div>
      )}
      {questions.map((question, index) => {
        const selected = answers[question.id]
        const hasAnswered = Boolean(selected)
        return (
          <section key={question.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">What does this mean?</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{question.term}</h2>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
                    const isCorrect = option.id === question.correctId
                    const isSelected = selected === option.id
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${hasAnswered && isCorrect ? 'border-primary bg-primary/10' : hasAnswered && isSelected ? 'border-destructive bg-destructive/10' : isSelected ? 'border-primary bg-primary/5 ring-4 ring-ring/10' : 'border-input hover:border-primary/50 hover:bg-accent'}`}
                      >
                        <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${hasAnswered && isCorrect ? 'bg-primary text-primary-foreground' : hasAnswered && isSelected ? 'bg-destructive text-destructive-foreground' : 'bg-secondary text-muted-foreground'}`}>
                          {hasAnswered && isCorrect ? <Check aria-hidden="true" /> : hasAnswered && isSelected ? <X aria-hidden="true" /> : String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="font-medium">{option.text}</span>
                      </button>
                    )
                  })}
                </div>
                {hasAnswered && <p className="text-sm font-medium text-muted-foreground">{selected === question.correctId ? 'Correct answer.' : `Correct answer: ${question.options.find((option) => option.id === question.correctId)?.text}`}</p>}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
