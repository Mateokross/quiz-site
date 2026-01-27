import { useState } from 'react'
import AdSlot from './AdSlot'
import { AD_SIZES } from '../../constants/adConfig'

/**
 * Top banner ad component
 * Tall banner for desktop (728x90), mobile banner for mobile (320x100/320x50)
 * Hides container when no fill
 */
export default function AdTopBanner({ 
  backgroundColor = null,
  onHeightChange = null 
}) {
  const [adHeight, setAdHeight] = useState(null)

  const sizes = AD_SIZES.TOP_BANNER

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
