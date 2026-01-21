import { useState } from 'react'
import AdSlot from './AdSlot'
import { useAdManager } from '../../hooks/useAdManager'

/**
 * Bottom banner ad component
 * Fixed at bottom of screen
 * Short banner: 728x90 for desktop, 320x50 for mobile
 * Hides container when no fill
 */
export default function AdBottomBanner() {
  const { isMobile } = useAdManager()
  const [renderedSize, setRenderedSize] = useState(null)

  // Desktop: 728x90 primary, 320x50 fallback
  // Mobile: 320x50
  const desktopSizes = [[728, 90], [320, 50]]
  const mobileSizes = [[320, 50]]
  const sizes = isMobile ? mobileSizes : desktopSizes

  // Calculate container dimensions based on ad sizes
  const maxWidth = Math.max(...sizes.map(size => size[0]))
  const maxHeight = Math.max(...sizes.map(size => size[1]))
  const [containerWidth, containerHeight] = renderedSize || [maxWidth, maxHeight]

  return (
    <div 
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-20 flex justify-center"
      style={{
        height: `${containerHeight}px`,
        width: `${containerWidth}px`,
      }}
    >
      <AdSlot
        slotId="ad-bottom-banner"
        sizes={sizes}
        hideOnNoFill={true}
        autoRefresh={true}
        useMaxSize={false}
        onSlotRender={(event) => {
          if (!event.isEmpty && Array.isArray(event.size)) {
            setRenderedSize(event.size)
          }
        }}
        className="flex justify-center"
      />
    </div>
  )
}
