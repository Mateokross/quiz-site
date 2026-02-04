import { useEffect, useState } from 'react'
import AdContainer from '../AdContainer'

/**
 * Sidebar Ad Component
 * Sizes: 160x600, 120x600, 300x600
 * Fixed left and right on wide screens
 */
export default function SidebarAd({ position = 'left' }) {
  const [isVisible, setIsVisible] = useState(false)
  const [optimalSizes, setOptimalSizes] = useState([])

  useEffect(() => {
    const updateVisibility = () => {
      const width = window.innerWidth
      
      // Only show sidebar ads on screens wider than 1200px
      // This ensures there's enough space for content + 2 sidebars
      setIsVisible(width >= 1200)

      const sizes = []
      
      // Determine optimal sizes based on available space
      if (width >= 1400) {
        sizes.push([300, 600])
      }
      if (width >= 1200) {
        sizes.push([160, 600], [120, 600])
      }

      setOptimalSizes(sizes.length > 0 ? sizes : [[160, 600]])
    }

    updateVisibility()
    window.addEventListener('resize', updateVisibility)

    return () => window.removeEventListener('resize', updateVisibility)
  }, [])

  if (!isVisible || optimalSizes.length === 0) return null

  const divId = position === 'left' ? 'sidebar-ad-left' : 'sidebar-ad-right'

  return (
    <div
      style={{
        position: 'fixed',
        [position]: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AdContainer
        divId={divId}
        sizes={optimalSizes}
        minWidth={120}
        minHeight={600}
      />
    </div>
  )
}
