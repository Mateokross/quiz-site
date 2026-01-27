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

    // Wait for DOM element to be available before registering/displaying
    const initializeSlot = () => {
      if (!window.googletag || !containerRef.current) {
        return false
      }

      // Register slot (handles both new and pre-defined slots)
      registerSlot(slotId, sizes, adUnitPath)

      // Display slot - ensure it's displayed even if pre-defined
      displaySlot(slotId)

      // Set up refresh if enabled
      if (autoRefresh) {
        setupRefresh(slotId, refreshInterval)
      }

      // Set up no-fill detection
      window.googletag.cmd.push(function() {
        window.googletag.pubads().addEventListener('slotRenderEnded', handleSlotRenderEnded)
      })

      return true
    }

    // Try immediately, then retry if element not ready
    let displayTimer = null
    if (initializeSlot()) {
      // Successfully initialized
    } else {
      // Element not ready yet, retry after a short delay
      displayTimer = setTimeout(() => {
        initializeSlot()
      }, 50)
    }

    // Cleanup
    return () => {
      if (displayTimer) {
        clearTimeout(displayTimer)
      }
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
