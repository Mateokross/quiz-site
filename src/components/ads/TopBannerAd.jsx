import { useEffect, useState } from 'react'
import AdContainer from '../AdContainer'

/**
 * Top Banner Ad Component
 * Sizes: 728x90, 300x50, 468x60, 320x100, 320x50, 300x100, 234x60
 */
export default function TopBannerAd({ isFixed = false, insideNavbar = false }) {
  const [optimalSizes, setOptimalSizes] = useState([])

  useEffect(() => {
    const updateSizes = () => {
      const width = window.innerWidth
      const sizes = []

      // Determine optimal sizes based on screen width
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

  const containerStyle = isFixed
    ? {
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: 'white',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }
    : insideNavbar
    ? {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 0',
      }
    : {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '8px 0',
        width: '100%',
      }

  return (
    <div style={containerStyle}>
      <AdContainer
        divId="top-banner-ad"
        sizes={optimalSizes}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    </div>
  )
}
