import { useState } from 'react'
import AdSlot from './AdSlot'
import { useSidebarVisibility } from '../../hooks/useSidebarVisibility'
import { AD_SIZES, AD_BREAKPOINTS } from '../../constants/adConfig'
import { calculateMaxDimensions } from '../../utils/adHelpers'

/**
 * Sidebar ad component (left or right)
 * Fixed position, follows scroll
 * Desktop only: 300x250 primary, 160x600 fallback
 * Visible at xl breakpoint (1280px+) with conditional loading
 */
export default function AdSidebar({ position = 'left', navbarTopOffset = 0 }) {
  const { isVisible, hasSpace } = useSidebarVisibility(AD_BREAKPOINTS.XL)
  const [renderedSize, setRenderedSize] = useState(null)
  
  const sizes = AD_SIZES.SIDEBAR
  const slotId = position === 'left' ? 'ad-sidebar-left' : 'ad-sidebar-right'
  
  // Calculate container dimensions based on ad sizes
  const { maxWidth, maxHeight } = calculateMaxDimensions(sizes)
  const [containerWidth, containerHeight] = renderedSize || [maxWidth, maxHeight]
  
  // Top position: navbar top offset (which includes ad height + navbar content)
  const topPosition = navbarTopOffset > 0 ? `${navbarTopOffset}px` : '90px'

  // Only load ad if viewport is wide enough (CSS handles visibility via hidden xl:block)
  // Both checks evaluate to the same threshold (1280px) but represent different concepts
  // (minimum width vs sufficient space), so we check both for clarity
  const shouldLoad = isVisible && hasSpace

  return (
    <div 
      className={`hidden xl:block fixed ${position === 'left' ? 'left-0' : 'right-0'} bottom-0 z-10 flex items-center justify-center`}
      style={{ 
        top: topPosition,
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
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
        className="flex justify-center"
      />
    </div>
  )
}
