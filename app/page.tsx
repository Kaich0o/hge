'use client'

import { useState } from 'react'
import { BookOpen, ClipboardList, Eye, LockKeyhole, PenLine, RotateCcw, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreatorForm } from '@/components/creator-form'
import { QuizDisplay } from '@/components/quiz-display'
import { useQuizStore } from '@/hooks/useQuizStore'

export default function Home() {
  const { questions, setQuestions, hydrated } = useQuizStore()
  const [mode, setMode] = useState<'quiz' | 'build'>('quiz')
  const [ownerMode, setOwnerMode] = useState(false)

  function requestOwnerAccess() {
    const password = window.prompt('Enter the owner password to open Build quiz:')
    if (password === 'karuanjeru') {
      setOwnerMode(true)
      setMode('build')
    } else if (password !== null) {
      window.alert('That password is incorrect.')
    }
  }

  function switchToClassmateView() {
    setOwnerMode(false)
    setMode('quiz')
  }

  if (!hydrated) return <main className="min-h-screen bg-background" />

  return <main className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border bg-card/80 backdrop-blur-sm"><div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><BookOpen aria-hidden="true" /></div><div><p className="text-base font-bold tracking-tight">HGE CELE</p><p className="text-xs text-muted-foreground">Terms review room</p></div></div><div className="flex items-center gap-2"><div className="flex items-center gap-2 rounded-xl bg-secondary p-1"><button type="button" onClick={() => setMode('quiz')} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'quiz' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><ClipboardList aria-hidden="true" />Quiz</button>{ownerMode && <button type="button" onClick={() => setMode('build')} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === 'build' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><PenLine aria-hidden="true" />Build quiz</button>}</div><button type="button" onClick={ownerMode ? switchToClassmateView : requestOwnerAccess} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-accent">{ownerMode ? <Eye aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}{ownerMode ? 'Classmate view' : 'Owner access'}</button></div></div></header>
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-16">
      <section className="max-w-3xl"><p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-primary">Study smarter together</p><h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">Know the term.<br /><span className="text-muted-foreground">Choose the answer.</span></h1><p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">A simple practice room for your HGE CELE exam terms. Add questions, test yourself, and reveal what you know.</p></section>
      {mode === 'build' ? <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"><section className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"><div className="mb-8 flex items-start gap-4"><div className="flex size-11 items-center justify-center rounded-xl bg-secondary"><PenLine aria-hidden="true" className="text-primary" /></div><div><h2 className="text-xl font-semibold">Add a new term</h2><p className="mt-1 text-sm text-muted-foreground">Write the answer choices and mark the correct one.</p></div></div><CreatorForm questions={questions} onAdd={(question) => setQuestions((current) => [...current, question])} onUpdate={(updatedQuestion) => setQuestions((current) => current.map((question) => question.id === updatedQuestion.id ? updatedQuestion : question))} questionCount={questions.length} /></section><section className="flex flex-col gap-4 rounded-2xl border border-border bg-secondary/50 p-6 sm:p-8"><div><p className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground">Your study set</p><p className="mt-2 text-5xl font-bold tracking-tight">{questions.length}</p><p className="mt-1 text-sm text-muted-foreground">{questions.length === 1 ? 'term ready to review' : 'terms ready to review'}</p></div><div className="mt-auto flex flex-col gap-3"><Button variant="outline" onClick={() => setMode('quiz')} className="w-full rounded-xl bg-background">Open quiz <ClipboardList data-icon="inline-end" /></Button>{questions.length > 0 && <Button variant="ghost" onClick={() => { if (window.confirm('Clear all saved terms?')) setQuestions([]) }} className="w-full rounded-xl text-destructive hover:text-destructive"><Trash2 data-icon="inline-start" />Clear all terms</Button>}</div></section></div> : <QuizDisplay questions={questions} />}
    </div>
    <footer className="mx-auto flex max-w-6xl items-center gap-2 px-5 pb-10 text-xs text-muted-foreground sm:px-8"><RotateCcw className="size-3" aria-hidden="true" />Progress is saved in this browser.</footer>
  </main>
}
