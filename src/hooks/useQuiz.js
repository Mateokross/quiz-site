import { useState, useEffect, useCallback } from 'react'
import { calculateResult } from '../utils/calculateResult'

export function useQuiz(quizConfig) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // questionId -> answerIndex
  const [scores, setScores] = useState({}) // category -> count
  const [isComplete, setIsComplete] = useState(false)
  const [resultRevealState, setResultRevealState] = useState('ready') // 'ready' | 'loading' | 'ready-to-reveal' | 'revealed'
  const [result, setResult] = useState(null)

  // Initialize scores object
  useEffect(() => {
    if (quizConfig?.results) {
      const initialScores = {}
      Object.keys(quizConfig.results).forEach(key => {
        initialScores[key] = 0
      })
      setScores(initialScores)
    }
  }, [quizConfig])

  // Recalculate scores when answers change
  useEffect(() => {
    if (!quizConfig?.questions) return

    const newScores = {}
    Object.keys(quizConfig.results || {}).forEach(key => {
      newScores[key] = 0
    })

    quizConfig.questions.forEach(question => {
      const answerIndex = answers[question.id]
      if (answerIndex !== undefined && question.answers[answerIndex]) {
        const resultCategory = question.answers[answerIndex].result
        if (newScores[resultCategory] !== undefined) {
          newScores[resultCategory]++
        }
      }
    })

    setScores(newScores)
  }, [answers, quizConfig])

  // Check if quiz is complete
  useEffect(() => {
    if (!quizConfig?.questions) return

    const allAnswered = quizConfig.questions.every(
      question => answers[question.id] !== undefined
    )

    if (allAnswered && !isComplete) {
      setIsComplete(true)
      triggerResultReveal()
    }
  }, [answers, quizConfig, isComplete])

  const selectAnswer = useCallback((questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }, [])

  const goToQuestion = useCallback((index, forceScroll = false) => {
    if (quizConfig?.questions && index >= 0 && index < quizConfig.questions.length) {
      const wasSameIndex = currentQuestionIndex === index
      setCurrentQuestionIndex(index)
      
      // Always scroll if forced, or if index changed, or if same index (user might have manually scrolled)
      if (forceScroll || wasSameIndex) {
        // Use requestAnimationFrame for more reliable timing
        requestAnimationFrame(() => {
          setTimeout(() => {
            const question = quizConfig.questions[index]
            // Target the question title, not the container
            const questionTitleElement = document.getElementById(`question-title-${question.id}`)
            if (questionTitleElement) {
              // Calculate navbar height dynamically
              const navbar = document.querySelector('[class*="sticky top-0"]')
              const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0
              // Add small offset for visual spacing
              const offset = navbarHeight + 16
              
              // Get the position of the question title
              const elementTop = questionTitleElement.getBoundingClientRect().top + window.pageYOffset
              
              // Scroll to position accounting for navbar height
              window.scrollTo({ 
                top: elementTop - offset, 
                behavior: 'smooth' 
              })
              
              // Focus the question title for accessibility
              questionTitleElement.focus({ preventScroll: true })
            }
          }, 100)
        })
      }
    }
  }, [quizConfig, currentQuestionIndex])

  const getNextUnansweredQuestion = useCallback(() => {
    if (!quizConfig?.questions) return null

    // Always find the FIRST unanswered question (earliest index)
    for (let i = 0; i < quizConfig.questions.length; i++) {
      if (answers[quizConfig.questions[i].id] === undefined) {
        return i
      }
    }

    return null // All questions answered
  }, [answers, quizConfig])

  const triggerResultReveal = useCallback(() => {
    // Add delay before showing loading screen (similar to question transition delay)
    setTimeout(() => {
      setResultRevealState('loading')
      
      // Calculate result
      const resultOrder = Object.keys(quizConfig?.results || {})
      const winningCategory = calculateResult(scores, resultOrder)
      setResult(winningCategory)

      // Show loading animation for 5 seconds, then show ready-to-reveal screen
      setTimeout(() => {
        setResultRevealState('ready-to-reveal')
      }, 5000)
    }, 1000) // Same delay as question transition
  }, [quizConfig, scores])

  const revealResult = useCallback(() => {
    setResultRevealState('revealed')
  }, [])

  const handleAnswerSelect = useCallback((questionId, answerIndex) => {
    // Update answers state
    const updatedAnswers = {
      ...answers,
      [questionId]: answerIndex
    }
    setAnswers(updatedAnswers)
    
    // Find next unanswered question using the updated answers
    if (!quizConfig?.questions) return
    
    let nextIndex = null
    // Always find the FIRST unanswered question (earliest index)
    for (let i = 0; i < quizConfig.questions.length; i++) {
      if (updatedAnswers[quizConfig.questions[i].id] === undefined) {
        nextIndex = i
        break
      }
    }
    
    if (nextIndex !== null) {
      setTimeout(() => {
        goToQuestion(nextIndex, true) // Force scroll to ensure it happens
      }, 300) // Small delay for visual feedback
    }
  }, [answers, quizConfig, goToQuestion])

  const resetQuiz = useCallback(() => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setIsComplete(false)
    setResultRevealState('ready')
    setResult(null)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return {
    currentQuestionIndex,
    answers,
    scores,
    isComplete,
    resultRevealState,
    result,
    selectAnswer: handleAnswerSelect,
    goToQuestion,
    getNextUnansweredQuestion,
    triggerResultReveal,
    revealResult,
    resetQuiz,
  }
}
