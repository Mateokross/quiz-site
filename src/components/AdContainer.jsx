import { useEffect, useRef, useState } from 'react'

/**
 * Generic ad container component
 * Handles responsive sizing and visibility
 */
export default function AdContainer({
  divId,
  adUnitPath = '/21775744923/quizzs',
  sizes,
  style = {},
  className = '',
  onSlotDefined,
  minWidth = 0,
  minHeight = 0,
}) {
  const containerRef = useRef(null)
  const [isVisible, setIsVisible] = useState(true)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    // Observe container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setContainerSize({ width, height })
        
        // Hide container if it's too small
        if (width < minWidth || height < minHeight) {
          setIsVisible(false)
        } else {
          setIsVisible(true)
        }
      }
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [minWidth, minHeight])

  useEffect(() => {
    if (!window.googletag || !isVisible) return

    window.googletag.cmd.push(() => {
      // Check if slot already exists
      const existingSlots = window.googletag.pubads().getSlots()
      const slotExists = existingSlots.some(slot => 
        slot.getSlotElementId() === divId
      )

      if (!slotExists) {
        const slot = window.googletag
          .defineSlot(adUnitPath, sizes, divId)
          .addService(window.googletag.pubads())

        // Listen for slot render ended to handle empty ads
        window.googletag.pubads().addEventListener('slotRenderEnded', (event) => {
          if (event.slot.getSlotElementId() === divId) {
            if (event.isEmpty) {
              setIsVisible(false)
            } else {
              setIsVisible(true)
            }
          }
        })

        if (onSlotDefined) {
          onSlotDefined(slot)
        }

        window.googletag.display(divId)
      }
    })
  }, [divId, adUnitPath, sizes, isVisible, onSlotDefined])

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={containerRef}
      id={divId}
      className={className}
      style={{
        minWidth: `${minWidth}px`,
        minHeight: `${minHeight}px`,
        ...style,
      }}
    />
  )
}
