import AdLayout from './ads/AdLayout'

export default function LoadingSpinner({ 
  accentColor = '#000000',
  backgroundColor = '#FFFFFF',
  progressColor = '#3B82F6'
}) {
  return (
    <AdLayout
      showTopBanner={true}
      showBottomBanner={true}
      showSidebars={true}
      showInterstitial={true}
      topBannerFixed={true}
    >
      <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor }}
    >
      <div className="max-w-md mx-auto text-center animate-fade-in">
        <div className="mb-8">
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center animate-spin"
            style={{ 
              borderWidth: '4px',
              borderStyle: 'solid',
              borderColor: '#E5E7EB',
              borderTopColor: progressColor,
            }}
            role="status"
            aria-label="Calculating your result"
          />
          <h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: accentColor }}
          >
            Calculating your result...
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            This may take a moment
          </p>
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
    </AdLayout>
  )
}
