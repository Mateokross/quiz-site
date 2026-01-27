import { useState } from 'react'
import AdSlot from './AdSlot'
import { useSidebarVisibility } from '../../hooks/useSidebarVisibility'
import { AD_SIZES, AD_BREAKPOINTS } from '../../constants/adConfig'
import { calculateMaxDimensions } from '../../utils/adHelpers'

/**
 * Sidebar ad component (left or right)
 * Fixed position, positioned at bottom of viewport
 * Desktop only: 300x600, 160x600, 120x600
 * Visible at xl breakpoint (1280px+) with conditional loading
 * Sidebars reduce horizontal space available for top banner/navbar
 */
export default function AdSidebar({ position = 'left' }) {
  const { isVisible, hasSpace } = useSidebarVisibility(AD_BREAKPOINTS.XL)
  const [renderedSize, setRenderedSize] = useState(null)
  
  const sizes = AD_SIZES.SIDEBAR
  const slotId = position === 'left' ? 'ad-sidebar-left' : 'ad-sidebar-right'
  
  // Calculate container dimensions based on ad sizes
  const { maxWidth } = calculateMaxDimensions(sizes)
  const containerWidth = renderedSize ? renderedSize[0] : maxWidth

  // Only load ad if viewport is wide enough (CSS handles visibility via hidden xl:block)
  // Both checks evaluate to the same threshold (1280px) but represent different concepts
  // (minimum width vs sufficient space), so we check both for clarity
  const shouldLoad = isVisible && hasSpace

  // Align ads to the edge of their container to prevent shifting when narrower ads load
  const alignmentClass = position === 'left' ? 'justify-start' : 'justify-end'
  const adAlignmentClass = position === 'left' ? 'flex justify-start' : 'flex justify-end'

  return (
    <div 
      className={`hidden xl:block fixed ${position === 'left' ? 'left-0' : 'right-0'} bottom-0 z-[30] flex items-end ${alignmentClass}`}
      style={{ 
        width: `${containerWidth}px`,
      }}
    >
      <AdSlot
        slotId={slotId}
        sizes={sizes}
        hideOnNoFill={false}
        autoRefresh={true}
        shouldLoad={shouldLoad}
        useMaxSize={false}
        onSlotRender={(event) => {
          if (!event.isEmpty && Array.isArray(event.size)) {
            setRenderedSize(event.size)
          }
        }}
        className={adAlignmentClass}
      />
    </div>
  )
}
