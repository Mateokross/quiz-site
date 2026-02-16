import { useEffect, useRef } from 'react'
import { trackMetaCustomEvent, META_EVENTS } from '../config/metaPixel'

/**
 * Hook to track Meta Pixel events in quizzes
 * Automatically tracks when user reaches the milestone question (4th or last)
 * 
 * @param {number} currentQuestionIndex - Current question index (0-based)
 * @param {number} totalQuestions - Total number of questions in the quiz
 * @param {Object} answers - Object containing user answers
 * @param {Object} quizConfig - Quiz configuration object
 */
export function useMetaPixel(currentQuestionIndex, totalQuestions, answers, quizConfig) {
  const milestoneTracked = useRef(false)

  useEffect(() => {
    // Don't track if already tracked
    if (milestoneTracked.current) return

    // Calculate milestone question index (4th question or last if less than 4)
    const milestoneIndex = Math.min(3, totalQuestions - 1) // 3 = 4th question (0-indexed)

    // Get number of answered questions
    const answeredCount = Object.keys(answers).length

    // Track when user answers the milestone question
    if (answeredCount > milestoneIndex) {
      console.log(`🎯 Quiz milestone reached: ${answeredCount} questions answered (milestone at ${milestoneIndex + 1})`)
      
      trackMetaCustomEvent(META_EVENTS.QUIZ_MILESTONE, {
        quiz_id: quizConfig?.id || 'unknown',
        quiz_title: quizConfig?.title || 'Unknown Quiz',
        milestone_question: milestoneIndex + 1,
        total_questions: totalQuestions,
        answered_count: answeredCount,
      })

      milestoneTracked.current = true
    }
  }, [currentQuestionIndex, totalQuestions, answers, quizConfig])

  return {
    milestoneTracked: milestoneTracked.current,
  }
}
