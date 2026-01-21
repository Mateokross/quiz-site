import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useQuiz } from '../hooks/useQuiz'
import Question from './Question'
import Results from './Results'
import LoadingSpinner from './LoadingSpinner'
import ResultReady from './ResultReady'
import AdTopBanner from './ads/AdTopBanner'
import AdBottomBanner from './ads/AdBottomBanner'
import AdSidebar from './ads/AdSidebar'
import AdInContent from './ads/AdInContent'
import AdInterstitial from './ads/AdInterstitial'
import { useAdManager } from '../hooks/useAdManager'
import { AD_CONFIG } from '../constants/adConfig'

// Import quiz configs
import personalityQuizConfig from '../quiz-configs/personality-quiz.json'
import presidentsQuizConfig from '../quiz-configs/presidents.json'

const QUIZ_CONFIGS = {
  'personality-quiz': personalityQuizConfig,
  'presidents': presidentsQuizConfig,
}

export default function Quiz() {
  const { quizId } = useParams()
  const [quizConfig, setQuizConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [adHeight, setAdHeight] = useState(90) // Default to 90px (typical banner height)
  const { refreshAllSlots } = useAdManager()
  const prevIsCompleteRef = useRef(false)

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

  // Refresh ads when quiz is reset (when isComplete goes from true to false)
  useEffect(() => {
    if (prevIsCompleteRef.current && !isComplete && currentQuestionIndex === 0) {
      // Quiz was reset - refresh all ads
      const timer = setTimeout(() => {
        refreshAllSlots()
      }, 100)
      return () => clearTimeout(timer)
    }
    prevIsCompleteRef.current = isComplete
  }, [isComplete, currentQuestionIndex, refreshAllSlots])

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
    // Update document title with quiz name
    if (quizConfig?.title) {
      document.title = quizConfig.title
    }
    
    // Cleanup: reset to default title when component unmounts
    return () => {
      document.title = 'quizzs'
    }
  }, [quizConfig])

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

  const accentColor = quizConfig.theme?.accentColor || '#000000'
  const backgroundColor = quizConfig.theme?.backgroundColor || '#FFFFFF'
  const progressColor = quizConfig.theme?.progressColor || '#3B82F6' // Default blue
  const navbarBackgroundColor = quizConfig.theme?.navbarBackgroundColor || '#FFFFFF'
  const navbarTitleColor = quizConfig.theme?.navbarTitleColor || accentColor
  const selectedButtonColor = quizConfig.theme?.selectedButtonColor || accentColor

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
        accentColor={accentColor}
        backgroundColor={backgroundColor}
      />
    )
  }

  // Show result ready screen
  if (isComplete && resultRevealState === 'ready-to-reveal') {
    return (
      <ResultReady
        onContinue={revealResult}
        accentColor={accentColor}
        backgroundColor={backgroundColor}
        progressColor={progressColor}
        selectedButtonColor={selectedButtonColor}
      />
    )
  }

  // Show loading spinner during result reveal
  if (isComplete && resultRevealState === 'loading') {
    return (
      <LoadingSpinner 
        accentColor={accentColor}
        backgroundColor={backgroundColor}
        progressColor={progressColor}
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

  // Calculate navbar total height: ad height + navbar content
  const navbarTotalHeight = adHeight + AD_CONFIG.NAVBAR_CONTENT_HEIGHT

  return (
    <div style={{ backgroundColor }}>
      {/* Interstitial ad */}
      <AdInterstitial />
      
      {/* Sidebars - Desktop only */}
      <AdSidebar position="left" navbarTopOffset={navbarTotalHeight} />
      <AdSidebar position="right" navbarTopOffset={navbarTotalHeight} />

      {/* Navbar with integrated ad */}
      <div 
        className="sticky top-0 z-20 backdrop-blur-sm"
        style={{ 
          backgroundColor: navbarBackgroundColor === '#FFFFFF' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : navbarBackgroundColor 
        }}
      >
        {/* Top banner inside navbar */}
        <AdTopBanner 
          backgroundColor={navbarBackgroundColor === '#FFFFFF' 
            ? 'rgba(255, 255, 255, 0.9)' 
            : navbarBackgroundColor}
          onHeightChange={setAdHeight}
        />
        
        {/* Navbar content */}
        <div className="p-4">
          <h1 className="text-lg font-semibold text-center" style={{ color: navbarTitleColor }}>
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

      {/* Questions with in-content ads between them */}
      <div className="w-full md:min-w-[480px] lg:min-w-[600px] xl:min-w-[680px] 2xl:min-w-[800px] xl:px-[300px]">
        {quizConfig.questions.map((question, index) => {
          const selectedAnswerIndex = answers[question.id]

          return (
            <div key={question.id}>
              {/* In-content ad before each question (except first) */}
              {index > 0 && <AdInContent index={index} />}
              
              <Question
                question={question}
                selectedAnswerIndex={selectedAnswerIndex}
                onSelectAnswer={selectAnswer}
                accentColor={accentColor}
                backgroundColor={backgroundColor}
                selectedButtonColor={selectedButtonColor}
              />
            </div>
          )
        })}
      </div>

      {/* Bottom banner - fixed at bottom */}
      <AdBottomBanner />
    </div>
  )
}
