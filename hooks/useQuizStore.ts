'use client'

import { useEffect, useState } from 'react'

export type QuizOption = { id: string; text: string }
export type QuizQuestion = {
  id: string
  term: string
  options: QuizOption[]
  correctId: string
  createdAt: number
}

const STORAGE_KEY = 'hge-cele-questions'

export function useQuizStore() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) setQuestions(JSON.parse(saved))
    } catch {
      setQuestions([])
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(questions))
  }, [questions, hydrated])

  return { questions, setQuestions, hydrated }
}

export function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
