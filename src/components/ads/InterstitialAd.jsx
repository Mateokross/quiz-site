import { useEffect, useState } from 'react'
import AdContainer from '../AdContainer'
import { AD_UNIT_PATHS } from '../../config/adUnits'

/**
 * Interstitial Ad Component
 * Sizes: 480x320, 320x480, 336x280, 300x250
 * Fullscreen overlay. After 30s and again every 2 min after being closed.
 */
export default function InterstitialAd({ onAdLoad, onAdClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showCloseButton, setShowCloseButton] = useState(false)
  const [optimalSizes, setOptimalSizes] = useState([])
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const sizes = []

      // Determine optimal sizes based on screen dimensions
      if (width >= 480 && height >= 320) {
        sizes.push([480, 320])
      }
      if (width >= 336 && height >= 280) {
        sizes.push([336, 280])
      }
      if (width >= 320 && height >= 480) {
        sizes.push([320, 480])
      }
      if (width >= 300 && height >= 250) {
        sizes.push([300, 250])
      }

      setOptimalSizes(sizes.length > 0 ? sizes : [[300, 250]])
    }

    updateSizes()
    window.addEventListener('resize', updateSizes)

    return () => window.removeEventListener('resize', updateSizes)
  }, [])

  useEffect(() => {
    // Show interstitial after 10 seconds (demo mode)
    const initialTimer = setTimeout(() => {
      setIsVisible(true)
      setShowCloseButton(true)
      if (onAdLoad) onAdLoad()
    }, 10000)

    return () => clearTimeout(initialTimer)
  }, [onAdLoad])

  const handleClose = () => {
    setIsVisible(false)
    setShowCloseButton(false)
    if (onAdClose) onAdClose()

    // Show again after 2 minutes with refreshed ad
    setTimeout(() => {
      setRefreshKey(prev => prev + 1) // Force ad refresh
      setIsVisible(true)
      setShowCloseButton(true)
      if (onAdLoad) onAdLoad()
      
      // Refresh the ad slot
      if (window.googletag) {
        window.googletag.cmd.push(() => {
          const slots = window.googletag.pubads().getSlots()
          const interstitialSlot = slots.find(slot => slot.getSlotElementId() === 'interstitial-ad')
          if (interstitialSlot) {
            window.googletag.pubads().refresh([interstitialSlot])
          }
        })
      }
    }, 120000) // 2 minutes
  }

  if (!isVisible || optimalSizes.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
      onClick={(e) => {
        // Close if clicking on backdrop
        if (e.target === e.currentTarget) {
          handleClose()
        }
      }}
    >
      <div
        style={{
          position: 'relative',
        }}
      >
        {showCloseButton && (
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '-16px',
              right: '-16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              color: '#333',
              border: '2px solid #333',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              zIndex: 10001,
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
            aria-label="Close ad"
          >
            ×
          </button>
        )}
        <AdContainer
          key={refreshKey}
          divId="interstitial-ad"
          adUnitPath={AD_UNIT_PATHS.INTERSTITIAL}
          sizes={optimalSizes}
          minWidth={optimalSizes[0]?.[0] || 300}
          minHeight={optimalSizes[0]?.[1] || 250}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        />
      </div>
    </div>
  )
}
