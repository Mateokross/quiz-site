import { useState } from 'react'
import AdSlot from './AdSlot'
import { useAdManager } from '../../hooks/useAdManager'
import { AD_SIZES } from '../../constants/adConfig'
import { calculateMaxDimensions } from '../../utils/adHelpers'

/**
 * Bottom banner ad component
 * Fixed at bottom of screen
 * Short banner: 728x90 for desktop, 320x50 for mobile
 * Hides container when no fill
 */
export default function AdBottomBanner() {
  const { isMobile } = useAdManager()
  const [renderedSize, setRenderedSize] = useState(null)

  const sizes = isMobile ? AD_SIZES.BOTTOM_BANNER.mobile : AD_SIZES.BOTTOM_BANNER.desktop

  // Calculate container dimensions based on ad sizes
  const { maxWidth, maxHeight } = calculateMaxDimensions(sizes)
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
