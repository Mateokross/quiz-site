import { useState, useEffect } from 'react'
import AdSlot from './AdSlot'
import { useAdManager } from '../../hooks/useAdManager'

/**
 * Top banner ad component
 * Tall banner for desktop (728x90), mobile banner for mobile (320x100/320x50)
 * Hides container when no fill
 */
export default function AdTopBanner({ 
  showBorder = true, 
  backgroundColor = null,
  onHeightChange = null 
}) {
  const { isMobile } = useAdManager()
  const [adHeight, setAdHeight] = useState(null)

  // Desktop: 728x90 primary, 320x50 fallback
  // Mobile: 320x100 primary, 320x50 fallback
  const desktopSizes = [[728, 90], [320, 50]]
  const mobileSizes = [[320, 100], [320, 50]]
  const sizes = isMobile ? mobileSizes : desktopSizes

  const handleSlotRender = (event) => {
    if (!event.isEmpty && event.size) {
      // event.size is an array like [728, 90] or [320, 50]
      const height = event.size[1]
      setAdHeight(height)
      if (onHeightChange) {
        onHeightChange(height)
      }
    }
  }

  // Notify parent of height changes
  useEffect(() => {
    if (adHeight && onHeightChange) {
      onHeightChange(adHeight)
    }
  }, [adHeight, onHeightChange])

  return (
    <div 
      className={`w-full flex justify-center`}
      style={{
        ...(adHeight ? { height: `${adHeight}px` } : {}),
        ...(backgroundColor ? { backgroundColor } : {}),
      }}
    >
      <AdSlot
        slotId="ad-top-banner"
        sizes={sizes}
        hideOnNoFill={true}
        autoRefresh={true}
        onSlotRender={handleSlotRender}
        useMaxSize={false}
        className="flex justify-center"
      />
    </div>
  )
}
