import { useState } from 'react'
import { shareResult } from '../utils/shareResult'

export default function Results({ 
  resultCategory, 
  quizConfig, 
  onRestart,
  primaryColor = '#000000',
  backgroundColor = '#FFFFFF'
}) {
  const [showToast, setShowToast] = useState(false)

  const result = quizConfig?.results?.[resultCategory]
  const quizTitle = quizConfig?.title || 'Quiz'
  const quizId = quizConfig?.id || ''

  const handleShare = async () => {
    const success = await shareResult(result?.title || '', quizTitle, quizId)
    if (success && !navigator.share) {
      // Show toast for clipboard copy
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

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
            Your Result: {result?.title || 'Unknown'}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {result?.description || 'No description available.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <button
            onClick={onRestart}
            className={`
              px-6 py-3 rounded-lg font-semibold border-2 transition-all
              focus:outline-none
              min-h-[44px] min-w-[120px]
              hover:opacity-90 hover:shadow-md
            `}
            style={{
              borderColor: primaryColor,
              color: primaryColor,
              backgroundColor: backgroundColor,
            }}
            aria-label="Restart quiz"
          >
            Restart Quiz
          </button>

          <button
            onClick={handleShare}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              focus:outline-none
              min-h-[44px] min-w-[120px]
              hover:opacity-90 hover:shadow-md
            `}
            style={{
              backgroundColor: primaryColor,
              color: backgroundColor,
            }}
            aria-label="Share your result"
          >
            Share Result
          </button>
        </div>

        {showToast && (
          <div 
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up"
            style={{ backgroundColor: primaryColor, color: backgroundColor }}
          >
            Result copied to clipboard!
          </div>
        )}
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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in;
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
