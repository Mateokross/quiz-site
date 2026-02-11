import { useEffect, useState } from 'react'
import AdContainer from '../AdContainer'
import { AD_UNIT_PATHS } from '../../config/adUnits'

/**
 * Bottom Banner Ad Component
 * Sizes: 728x90, 970x90, 300x50, 468x60, 320x100, 320x50, 300x100, 234x60
 * Fixed at bottom of screen
 */
export default function BottomBannerAd() {
  const [optimalSizes, setOptimalSizes] = useState([])

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth
      const sizes = []

      // Determine optimal sizes based on screen width
      if (width >= 970) {
        sizes.push([970, 90])
      }
      if (width >= 728) {
        sizes.push([728, 90])
      }
      if (width >= 468) {
        sizes.push([468, 60])
      }
      if (width >= 320) {
        sizes.push([320, 100], [320, 50])
      }
      if (width >= 300) {
        sizes.push([300, 50], [300, 100])
      }
      if (width >= 234) {
        sizes.push([234, 60])
      }

      setOptimalSizes(sizes.length > 0 ? sizes : [[300, 50]])
    }

    updateSizes()
    window.addEventListener('resize', updateSizes)

    return () => window.removeEventListener('resize', updateSizes)
  }, [])

  if (optimalSizes.length === 0) return null

  // Calculate min dimensions from the first (largest) size
  const minWidth = optimalSizes[0]?.[0] || 300
  const minHeight = optimalSizes[0]?.[1] || 50

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AdContainer
        divId="bottom-banner-ad"
        adUnitPath={AD_UNIT_PATHS.BOTTOM_BANNER}
        sizes={optimalSizes}
        minWidth={minWidth}
        minHeight={minHeight}
        style={{
          maxWidth: `${minWidth}px`,
        }}
      />
    </div>
  )
}
