import { Link } from 'react-router-dom'
import quizRegistry from '../quiz-configs/index.json'
import AdInterstitial from './ads/AdInterstitial'

export default function LandingPage() {
  const currentYear = new Date().getFullYear()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Interstitial ad */}
      <AdInterstitial isLoadingScreen={false} />
      {/* Header */}
      <header className="w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-3">
            quizzs
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Discover something about yourself.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pb-16">
          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {quizRegistry.map((quiz) => (
              <Link
                key={quiz.id}
                to={quiz.path}
                className="group block bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 p-6 sm:p-8 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 active:scale-[0.98]"
              >
                <div className="flex flex-col h-full">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 group-hover:text-gray-700">
                    {quiz.title}
                  </h2>
                  <div className="mt-auto flex items-center text-gray-600 group-hover:text-gray-900">
                    <span className="text-sm sm:text-base font-medium">Start</span>
                    <span className="ml-2 text-lg">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-6">
          <p className="text-sm text-gray-600 text-center">
            © {currentYear} quizzs. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
