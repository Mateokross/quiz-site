import { useEffect, useRef, useState, useCallback } from 'react'
import { useAdManager } from '../../hooks/useAdManager'
import { AD_CONFIG, AD_UNIT_PATH } from '../../constants/adConfig'
import { calculateMaxDimensions } from '../../utils/adHelpers'

/**
 * Base ad slot component with GPT integration
 * Handles display, refresh, and no-fill detection
 */
export default function AdSlot({
  slotId,
  sizes,
  adUnitPath = AD_UNIT_PATH,
  className = '',
  style = {},
  hideOnNoFill = false,
  autoRefresh = true,
  refreshInterval = AD_CONFIG.REFRESH_INTERVAL,
  onSlotRender = null,
  useMaxSize = true,
  shouldLoad = true,
}) {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  const { registerSlot, displaySlot, setupRefresh, cleanupRefresh } = useAdManager()
  
  // Memoize event handler to prevent memory leaks and unnecessary re-renders
  const handleSlotRenderEnded = useCallback((event) => {
    const eventSlotId = event.slot.getSlotElementId()
    if (eventSlotId === slotId) {
      if (event.isEmpty && hideOnNoFill) {
        setIsVisible(false)
      } else if (!event.isEmpty) {
        setIsVisible(true)
      }
      if (typeof onSlotRender === 'function') {
        onSlotRender(event)
      }
    }
  }, [slotId, hideOnNoFill, onSlotRender])

  useEffect(() => {
    // Only register and display if shouldLoad is true
    if (!shouldLoad) {
      return
    }

    // Reset visibility when component mounts to allow ad to render
    // This ensures ads show up when navigating between pages
    setIsVisible(true)

    // Register and display the slot
    if (window.googletag && containerRef.current) {
      // Register slot
      registerSlot(slotId, sizes, adUnitPath)

      // Display slot
      displaySlot(slotId)

      // Set up refresh if enabled
      if (autoRefresh) {
        setupRefresh(slotId, refreshInterval)
      }
    }

    // Set up no-fill detection
    if (window.googletag) {
      window.googletag.cmd.push(function() {
        window.googletag.pubads().addEventListener('slotRenderEnded', handleSlotRenderEnded)
      })
    }

    // Cleanup
    return () => {
      if (autoRefresh) {
        cleanupRefresh(slotId)
      }
      if (window.googletag) {
        window.googletag.cmd.push(function() {
          window.googletag.pubads().removeEventListener('slotRenderEnded', handleSlotRenderEnded)
        })
      }
    }
  }, [slotId, sizes, adUnitPath, hideOnNoFill, autoRefresh, refreshInterval, shouldLoad, registerSlot, displaySlot, setupRefresh, cleanupRefresh, handleSlotRenderEnded])

  if (!isVisible) {
    return null
  }

  // Calculate container dimensions based on largest size
  const { maxWidth, maxHeight } = calculateMaxDimensions(sizes)
  const sizeStyles = useMaxSize
    ? { minWidth: `${maxWidth}px`, minHeight: `${maxHeight}px` }
    : {}

  return (
    <div
      ref={containerRef}
      id={slotId}
      className={className}
      style={{
        ...sizeStyles,
        ...style,
      }}
    />
  )
}
