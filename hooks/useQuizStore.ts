'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'hge-cele-questions'

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

function formatQuestion(question: {
  id: string
  term: string
  options: QuizOption[]
  correct_id: string
  created_at: number
}): QuizQuestion {
  return {
    id: question.id,
    term: question.term,
    options: question.options,
    correctId: question.correct_id,
    createdAt: question.created_at,
  }
}

export function useQuizStore() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [hydrated, setHydrated] = useState(false)

  async function loadQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading questions:', error)
      return
    }

    setQuestions((data ?? []).map(formatQuestion))
  }

  useEffect(() => {
    async function initialize() {
      await loadQuestions()
      setHydrated(true)
    }

    initialize()
  }, [])

  async function addQuestion(question: QuizQuestion) {
    const { error } = await supabase
      .from('questions')
      .insert({
        id: question.id,
        term: question.term,
        options: question.options,
        correct_id: question.correctId,
        created_at: question.createdAt,
      })

    if (error) {
      console.error('Error adding question:', error)
      throw error
    }

    await loadQuestions()
  }

  async function updateQuestion(question: QuizQuestion) {
    const { error } = await supabase
      .from('questions')
      .update({
        term: question.term,
        options: question.options,
        correct_id: question.correctId,
      })
      .eq('id', question.id)

    if (error) {
      console.error('Error updating question:', error)
      throw error
    }

    await loadQuestions()
  }

  async function clearQuestions() {
    const { error } = await supabase
      .from('questions')
      .delete()
      .neq('id', '')

    if (error) {
      console.error('Error clearing questions:', error)
      throw error
    }

    await loadQuestions()
  }

  // ONE-TIME: Transfer old localStorage questions to Supabase
  async function migrateLocalQuestions() {
    const saved = window.localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      return {
        success: true,
        migrated: 0,
        message: 'No old local questions were found.',
      }
    }

    let oldQuestions: QuizQuestion[]

    try {
      oldQuestions = JSON.parse(saved)
    } catch {
      throw new Error('Could not read the old questions from localStorage.')
    }

    if (!Array.isArray(oldQuestions) || oldQuestions.length === 0) {
      return {
        success: true,
        migrated: 0,
        message: 'No old local questions were found.',
      }
    }

    // upsert prevents duplicate IDs from causing an error
    const rows = oldQuestions.map((question) => ({
      id: question.id,
      term: question.term,
      options: question.options,
      correct_id: question.correctId,
      created_at: question.createdAt,
    }))

    const { error } = await supabase
      .from('questions')
      .upsert(rows, { onConflict: 'id' })

    if (error) {
      console.error('Error migrating questions:', error)
      throw error
    }

    await loadQuestions()

    return {
      success: true,
      migrated: oldQuestions.length,
      message: `Successfully transferred ${oldQuestions.length} question(s) to Supabase.`,
    }
  }

  return {
    questions,
    hydrated,
    loadQuestions,
    addQuestion,
    updateQuestion,
    clearQuestions,
    migrateLocalQuestions,
  }
}

export function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}