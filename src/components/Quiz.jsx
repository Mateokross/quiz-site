import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuiz } from '../hooks/useQuiz'
import Question from './Question'
import Results from './Results'
import LoadingSpinner from './LoadingSpinner'
import ResultReady from './ResultReady'

// Import quiz configs
import personalityQuizConfig from '../quiz-configs/personality-quiz.json'

const QUIZ_CONFIGS = {
  'personality-quiz': personalityQuizConfig,
}

export default function Quiz() {
  const { quizId } = useParams()
  const [quizConfig, setQuizConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const {
    currentQuestionIndex,
    answers,
    isComplete,
    resultRevealState,
    result,
    selectAnswer,
    goToQuestion,
    revealResult,
    resetQuiz,
  } = useQuiz(quizConfig)

  useEffect(() => {
    // Load quiz config
    const config = QUIZ_CONFIGS[quizId]
    if (config) {
      setQuizConfig(config)
      setLoading(false)
    } else {
      setError(`Quiz "${quizId}" not found`)
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    // Scroll to current question on mount or question change
    if (quizConfig?.questions && quizConfig.questions[currentQuestionIndex]) {
      const timer = setTimeout(() => {
        const question = quizConfig.questions[currentQuestionIndex]
        const element = document.getElementById(`question-${question.id}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 400) // Increased delay to ensure DOM has updated
      return () => clearTimeout(timer)
    }
  }, [currentQuestionIndex, quizConfig])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !quizConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
          <p className="text-gray-600">{error || 'The requested quiz could not be loaded.'}</p>
        </div>
      </div>
    )
  }

  const primaryColor = quizConfig.theme?.primaryColor || '#000000'
  const backgroundColor = quizConfig.theme?.backgroundColor || '#FFFFFF'
  const progressColor = quizConfig.theme?.progressColor || '#3B82F6' // Default blue

  // Calculate progress percentage
  const answeredCount = Object.keys(answers).length
  const totalQuestions = quizConfig.questions?.length || 0
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

  // Show results if complete and revealed
  if (isComplete && resultRevealState === 'revealed' && result) {
    return (
      <Results
        resultCategory={result}
        quizConfig={quizConfig}
        onRestart={resetQuiz}
        primaryColor={primaryColor}
        backgroundColor={backgroundColor}
      />
    )
  }

  // Show result ready screen
  if (isComplete && resultRevealState === 'ready-to-reveal') {
    return (
      <ResultReady
        onContinue={revealResult}
        primaryColor={primaryColor}
        backgroundColor={backgroundColor}
      />
    )
  }

  // Show loading spinner during result reveal
  if (isComplete && resultRevealState === 'loading') {
    return (
      <LoadingSpinner 
        primaryColor={primaryColor}
        backgroundColor={backgroundColor}
      />
    )
  }

  // Show questions
  const currentQuestion = quizConfig.questions[currentQuestionIndex]
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-gray-600">Question not found.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor }}>
      <div className="sticky top-0 z-10 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-lg font-semibold text-center" style={{ color: primaryColor }}>
            {quizConfig.title}
          </h1>
        </div>
        {/* Progress Bar */}
        <div className="w-full relative">
          {/* Progress Percentage Text */}
          <div className="absolute top-0 right-4 -mt-5 text-xs text-gray-500">
            {progressPercentage}%
          </div>
          <div className="w-full h-1 bg-gray-200">
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
        </div>
      </div>

      {quizConfig.questions.map((question, index) => {
        const selectedAnswerIndex = answers[question.id]
        const isCurrentQuestion = index === currentQuestionIndex

        return (
          <Question
            key={question.id}
            question={question}
            selectedAnswerIndex={selectedAnswerIndex}
            onSelectAnswer={selectAnswer}
            primaryColor={primaryColor}
            backgroundColor={backgroundColor}
          />
        )
      })}
    </div>
  )
}
