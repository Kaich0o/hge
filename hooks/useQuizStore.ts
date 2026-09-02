'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export type QuizOption = {
  id: string
  text: string
}

export type QuizQuestion = {
  id: string
  term: string
  options: QuizOption[]
  correctId: string
  createdAt: number
}

export function useQuizStore() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load questions from Supabase
  useEffect(() => {
    async function loadQuestions() {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error loading questions:', error)
        setQuestions([])
      } else {
        const formattedQuestions: QuizQuestion[] = data.map((question) => ({
          id: question.id,
          term: question.term,
          options: question.options,
          correctId: question.correct_id,
          createdAt: question.created_at,
        }))

        setQuestions(formattedQuestions)
      }

      setHydrated(true)
    }

    loadQuestions()
  }, [])

  return {
    questions,
    setQuestions,
    hydrated,
  }
}

export function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
