export default function ResultReady({ 
  onContinue,
  accentColor = '#000000',
  backgroundColor = '#FFFFFF',
  progressColor = '#3B82F6',
  selectedButtonColor = '#000000'
}) {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor }}
    >
      <div className="max-w-md mx-auto text-center animate-fade-in">
        <div className="mb-8">
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: progressColor,
              color: backgroundColor
            }}
          >
            <svg 
              width="40" 
              height="40" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: accentColor }}
          >
            Your Result is Ready!
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8">
            We've calculated your result. Click the button below to see what you got!
          </p>
        </div>

        <button
          onClick={onContinue}
          className="px-8 py-4 text-lg font-semibold rounded-lg transition-all focus:outline-none hover:opacity-90 hover:shadow-lg transform hover:scale-105"
          style={{
            backgroundColor: selectedButtonColor,
            color: backgroundColor,
          }}
          aria-label="View your result"
        >
          View My Result
        </button>
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
