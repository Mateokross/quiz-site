import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

// Import quiz configs
import personalityQuizConfig from '../quiz-configs/personality-quiz.json'

const QUIZ_CONFIGS = {
  'personality-quiz': personalityQuizConfig,
}

export default function SharedResult() {
  const { quizId, resultCategory } = useParams()
  const navigate = useNavigate()
  const [quizConfig, setQuizConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Load quiz config
    const config = QUIZ_CONFIGS[quizId]
    if (config) {
      // Verify result category exists
      if (config.results && config.results[resultCategory]) {
        setQuizConfig(config)
        setLoading(false)
      } else {
        setError(`Result "${resultCategory}" not found for this quiz`)
        setLoading(false)
      }
    } else {
      setError(`Quiz "${quizId}" not found`)
      setLoading(false)
    }
  }, [quizId, resultCategory])

  // Update Open Graph meta tags for Facebook sharing
  useEffect(() => {
    if (!quizConfig || !resultCategory) return

    const result = quizConfig.results[resultCategory]
    const shareUrl = `${window.location.origin}/share/${quizId}/${resultCategory}`
    const shareTitle = `I got ${result?.title || 'Unknown'}! ${quizConfig.title}`
    const shareDescription = result?.description || ''

    // Helper function to update or create meta tags
    const updateMetaTag = (property, content) => {
      let element = document.querySelector(`meta[property="${property}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Set Open Graph meta tags
    updateMetaTag('og:title', shareTitle)
    updateMetaTag('og:description', shareDescription)
    updateMetaTag('og:url', shareUrl)
    updateMetaTag('og:type', 'website')

    // Update page title
    document.title = `${result?.title || 'Unknown'} - ${quizConfig.title}`

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      const ogTags = document.querySelectorAll('meta[property^="og:"]')
      ogTags.forEach(tag => tag.remove())
    }
  }, [quizConfig, resultCategory, quizId])

  const handleTakeQuiz = () => {
    navigate(`/quiz/${quizId}`)
  }

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
          <h1 className="text-2xl font-bold mb-4">Result Not Found</h1>
          <p className="text-gray-600">{error || 'The requested result could not be loaded.'}</p>
        </div>
      </div>
    )
  }

  const result = quizConfig.results[resultCategory]
  const primaryColor = quizConfig.theme?.primaryColor || '#000000'
  const backgroundColor = quizConfig.theme?.backgroundColor || '#FFFFFF'

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 py-16"
      style={{ backgroundColor }}
    >
      <div className="max-w-2xl mx-auto w-full text-center">
        <div 
          className="mb-8 animate-fade-in"
          style={{ animation: 'fadeIn 0.6s ease-in' }}
        >
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            {result?.title || 'Unknown'}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {result?.description || 'No description available.'}
          </p>
        </div>

        <div className="mt-8">
          <h2 
            className="text-lg md:text-xl font-semibold mb-4"
            style={{ color: primaryColor }}
          >
            Want to find out your result?
          </h2>
          <button
            onClick={handleTakeQuiz}
            className="px-8 py-3 rounded-lg font-semibold text-lg transition-opacity hover:opacity-90 focus:outline-none"
            style={{
              backgroundColor: primaryColor,
              color: backgroundColor,
            }}
            aria-label="Take the quiz yourself"
          >
            Take the quiz yourself
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in;
        }
      `}</style>
    </div>
  )
}
