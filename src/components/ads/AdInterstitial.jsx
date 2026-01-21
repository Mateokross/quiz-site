import { useState, useEffect } from 'react'
import AdSlot from './AdSlot'
import { useInterstitialAd } from '../../hooks/useInterstitialAd'
import { AD_SIZES } from '../../constants/adConfig'

/**
 * Interstitial ad component (fullscreen overlay)
 * Appears 30 seconds after page load, then every 2 minutes after being closed
 * Pauses when tab is hidden
 */
export default function AdInterstitial() {
  const { shouldShow, onClose } = useInterstitialAd()
  const [hasRendered, setHasRendered] = useState(false)
  const [hasFill, setHasFill] = useState(false)

  // Only render ad slot when we're about to show it (lazy initialization)
  useEffect(() => {
    if (shouldShow && !hasRendered) {
      setHasRendered(true)
      setHasFill(false) // Reset fill state when starting to show
    }
  }, [shouldShow, hasRendered])

  // Reset state when shouldShow becomes false
  useEffect(() => {
    if (!shouldShow) {
      setHasFill(false)
      setHasRendered(false)
    }
  }, [shouldShow])

  // Don't render anything if we shouldn't show
  if (!shouldShow) {
    return null
  }

  const sizes = AD_SIZES.INTERSTITIAL

  return (
    <div 
      id="ad-interstitial-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      style={{ display: hasFill ? 'flex' : 'none' }}
      onClick={(e) => {
        // Close when clicking backdrop (optional - you may want to remove this)
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Close ad"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Ad container */}
      <div className="relative max-w-full max-h-full flex items-center justify-center p-4">
        {hasRendered && (
          <AdSlot
            slotId="ad-interstitial"
            sizes={sizes}
            hideOnNoFill={true}
            autoRefresh={false}
            useMaxSize={false}
            className="flex justify-center"
            onSlotRender={(event) => {
              if (event.isEmpty) {
                // No fill - close immediately without showing overlay
                setHasFill(false)
                onClose()
              } else {
                // Has fill - show overlay
                setHasFill(true)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}
