'use client'

import { useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { QuizQuestion } from '@/hooks/useQuizStore'
import { makeId } from '@/hooks/useQuizStore'

type Props = { onAdd: (question: QuizQuestion) => void; questionCount: number }

export function CreatorForm({ onAdd, questionCount }: Props) {
  const [term, setTerm] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!term.trim() || options.some((option) => !option.trim())) return
    onAdd({
      id: makeId(),
      term: term.trim(),
      options: options.map((text, index) => ({ id: `option-${index}`, text: text.trim() })),
      correctId: `option-${correctIndex}`,
      createdAt: Date.now(),
    })
    setTerm(''); setOptions(['', '', '', '']); setCorrectIndex(0)
  }

  function updateOption(index: number, value: string) {
    setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? value : option))
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="term" className="text-sm font-semibold">What is the term?</label>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{questionCount} saved</span>
        </div>
        <input id="term" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="e.g. Habeas Corpus" className="h-14 rounded-xl border border-input bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/10" />
      </div>
      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold">Add four choices</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option, index) => (
            <div key={index} className={`relative flex items-center gap-3 rounded-xl border bg-background p-3 transition focus-within:border-primary ${correctIndex === index ? 'border-primary ring-4 ring-ring/10' : 'border-input'}`}>
              <button type="button" aria-label={`Set choice ${index + 1} as correct`} onClick={() => setCorrectIndex(index)} className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition ${correctIndex === index ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-accent'}`}>{correctIndex === index ? <Check aria-hidden="true" /> : String.fromCharCode(65 + index)}</button>
              <input value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Choice ${String.fromCharCode(65 + index)}`} aria-label={`Choice ${index + 1}`} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Click a letter to mark the correct answer.</p>
      </fieldset>
      <Button type="submit" size="lg" className="w-full rounded-xl sm:w-fit"><Plus data-icon="inline-start" />Save term</Button>
    </form>
  )
}
