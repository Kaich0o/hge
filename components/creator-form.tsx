'use client'

import { useState } from 'react'
import { Check, Pencil, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { QuizQuestion } from '@/hooks/useQuizStore'
import { makeId } from '@/hooks/useQuizStore'

type Props = { questions: QuizQuestion[]; onAdd: (question: QuizQuestion) => void; onUpdate: (question: QuizQuestion) => void; questionCount: number }
const blankOptions = ['', '', '', '']

export function CreatorForm({ questions, onAdd, onUpdate, questionCount }: Props) {
  const [term, setTerm] = useState('')
  const [options, setOptions] = useState(blankOptions)
  const [correctIndex, setCorrectIndex] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)

  function reset() { setTerm(''); setOptions(blankOptions); setCorrectIndex(0); setEditingId(null) }
  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!term.trim() || options.some((option) => !option.trim())) return
    const mapped = options.map((text, index) => ({ id: `option-${index}`, text: text.trim() }))
    if (editingId) {
      const original = questions.find((question) => question.id === editingId)
      onUpdate({ id: editingId, term: term.trim(), options: mapped, correctId: `option-${correctIndex}`, createdAt: original?.createdAt ?? Date.now() })
    } else onAdd({ id: makeId(), term: term.trim(), options: mapped, correctId: `option-${correctIndex}`, createdAt: Date.now() })
    reset()
  }
  function edit(question: QuizQuestion) {
    setEditingId(question.id); setTerm(question.term); setOptions(question.options.map((option) => option.text)); setCorrectIndex(Math.max(0, question.options.findIndex((option) => option.id === question.correctId))); window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function updateOption(index: number, value: string) { setOptions((current) => current.map((option, i) => i === index ? value : option)) }

  return <div className="flex flex-col gap-10">
    <form onSubmit={submit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-3"><div className="flex items-center justify-between gap-4"><label htmlFor="term" className="text-sm font-semibold">{editingId ? 'Edit the term' : 'What is the term?'}</label><span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">{questionCount} saved</span></div><input id="term" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="e.g. Habeas Corpus" className="h-14 rounded-xl border border-input bg-background px-4 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-ring/10" /></div>
      <fieldset className="flex flex-col gap-4"><legend className="text-sm font-semibold">{editingId ? 'Update the four choices' : 'Add four choices'}</legend><div className="grid gap-3 sm:grid-cols-2">{options.map((option, index) => <div key={index} className={`flex items-center gap-3 rounded-xl border bg-background p-3 transition focus-within:border-primary ${correctIndex === index ? 'border-primary ring-4 ring-ring/10' : 'border-input'}`}><button type="button" aria-label={`Set choice ${index + 1} as correct`} onClick={() => setCorrectIndex(index)} className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${correctIndex === index ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-accent'}`}>{correctIndex === index ? <Check aria-hidden="true" /> : String.fromCharCode(65 + index)}</button><input value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Choice ${String.fromCharCode(65 + index)}`} aria-label={`Choice ${index + 1}`} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" /></div>)}</div><p className="text-xs text-muted-foreground">Click a letter to mark the correct answer.</p></fieldset>
      <div className="flex flex-col gap-3 sm:flex-row"><Button type="submit" size="lg" className="w-full rounded-xl sm:w-fit">{editingId ? <Check data-icon="inline-start" /> : <Plus data-icon="inline-start" />}{editingId ? 'Update term' : 'Save term'}</Button>{editingId && <Button type="button" size="lg" variant="outline" onClick={reset} className="w-full rounded-xl sm:w-fit"><X data-icon="inline-start" />Cancel</Button>}</div>
    </form>
    {questions.length > 0 && <section className="flex flex-col gap-3 border-t border-border pt-6"><div><h3 className="font-semibold">Saved questions</h3><p className="mt-1 text-sm text-muted-foreground">Edit a term, choice, or correct answer anytime.</p></div>{questions.map((question, index) => <div key={question.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-4"><div className="min-w-0"><p className="truncate font-medium">{index + 1}. {question.term}</p><p className="mt-1 truncate text-xs text-muted-foreground">Correct: {question.options.find((option) => option.id === question.correctId)?.text}</p></div><Button type="button" variant="outline" size="sm" onClick={() => edit(question)} className="shrink-0 rounded-lg"><Pencil data-icon="inline-start" />Edit</Button></div>)}</section>}
  </div>
}
