import { useState, useRef } from 'react'
import AdSlot from './AdSlot'
import { useSidebarVisibility } from '../../hooks/useSidebarVisibility'

/**
 * Sidebar ad component (left or right)
 * Fixed position, follows scroll
 * Desktop only: 300x250 primary, 160x600 fallback
 * Visible at xl breakpoint (1280px+) with conditional loading
 */
export default function AdSidebar({ position = 'left', navbarTopOffset = 0 }) {
  const containerRef = useRef(null)
  const { isVisible, hasSpace } = useSidebarVisibility(containerRef, 1280)
  const [renderedSize, setRenderedSize] = useState(null)
  
  // Desktop sizes: 300x250 primary, 160x600 fallback
  const sizes = [[300, 250], [160, 600]]
  const slotId = position === 'left' ? 'ad-sidebar-left' : 'ad-sidebar-right'
  
  // Calculate container dimensions based on ad sizes
  const maxWidth = Math.max(...sizes.map(size => size[0]))
  const maxHeight = Math.max(...sizes.map(size => size[1]))
  const [containerWidth, containerHeight] = renderedSize || [maxWidth, maxHeight]
  
  // Top position: navbar top offset (which includes ad height + navbar content)
  const topPosition = navbarTopOffset > 0 ? `${navbarTopOffset}px` : '90px'

  // Only load ad if viewport is wide enough (CSS handles visibility via hidden xl:block)
  // Both isVisible and hasSpace check for >= 1280px, so we just need one
  const shouldLoad = isVisible && hasSpace

  return (
    <div 
      ref={containerRef}
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
