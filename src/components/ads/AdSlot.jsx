import { useEffect, useRef, useState } from 'react'
import { useAdManager } from '../../hooks/useAdManager'

/**
 * Base ad slot component with GPT integration
 * Handles display, refresh, and no-fill detection
 */
export default function AdSlot({
  slotId,
  sizes,
  adUnitPath = '/6355419/Travel/Europe/France/Paris',
  className = '',
  style = {},
  hideOnNoFill = false,
  autoRefresh = true,
  refreshInterval = 60000,
  onSlotRender = null,
  useMaxSize = true,
  shouldLoad = true,
}) {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  const { registerSlot, displaySlot, setupRefresh, cleanupRefresh } = useAdManager()

  useEffect(() => {
    // Only register and display if shouldLoad is true
    if (!shouldLoad) {
      return
    }

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
    const handleSlotRenderEnded = (event) => {
      if (event.slot.getSlotElementId() === slotId) {
        if (event.isEmpty && hideOnNoFill) {
          setIsVisible(false)
        } else if (!event.isEmpty) {
          setIsVisible(true)
        }
        if (typeof onSlotRender === 'function') {
          onSlotRender(event)
        }
      }
    }

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
  }, [slotId, sizes, adUnitPath, hideOnNoFill, autoRefresh, refreshInterval, onSlotRender, shouldLoad, registerSlot, displaySlot, setupRefresh, cleanupRefresh])

  if (!isVisible) {
    return null
  }

  // Calculate container dimensions based on largest size
  const maxWidth = Math.max(...sizes.map(size => size[0]))
  const maxHeight = Math.max(...sizes.map(size => size[1]))
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
