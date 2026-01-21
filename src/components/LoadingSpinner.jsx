import { useEffect } from 'react'
import AdTopBanner from './ads/AdTopBanner'
import AdSidebar from './ads/AdSidebar'
import { useAdManager } from '../hooks/useAdManager'

export default function LoadingSpinner({ 
  accentColor = '#000000',
  backgroundColor = '#FFFFFF',
  progressColor = '#3B82F6'
}) {
  const { refreshAllSlots } = useAdManager()

  // Refresh ads when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      refreshAllSlots()
    }, 100)
    return () => clearTimeout(timer)
  }, [refreshAllSlots])

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{ backgroundColor }}
    >
      {/* Sidebars */}
      <AdSidebar position="left" />
      <AdSidebar position="right" />

      {/* Top banner */}
      <div className="w-full fixed top-0 z-20">
        <AdTopBanner />
      </div>

      <div className="mx-auto text-center animate-fade-in mt-[90px] md:min-w-[480px] lg:min-w-[600px] xl:min-w-[680px] 2xl:min-w-[800px] md:max-w-2xl lg:max-w-2xl xl:max-w-none xl:px-[300px]">
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
  )
}
