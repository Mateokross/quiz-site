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
  const [refreshCount, setRefreshCount] = useState(0)
  const [lastRefresh, setLastRefresh] = useState(Date.now())

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
    if (!isVisible) return

    // Wait for GPT to be ready
    const initAd = () => {
      if (!window.googletag || !window.googletag.apiReady) {
        setTimeout(initAd, 100)
        return
      }

      window.googletag.cmd.push(() => {
        // Check if slot already exists
        const existingSlots = window.googletag.pubads().getSlots()
        const slotExists = existingSlots.some(slot => 
          slot.getSlotElementId() === divId
        )

        if (!slotExists) {
          console.log(`Defining ad slot: ${divId}`, sizes)
          
          const slot = window.googletag
            .defineSlot(adUnitPath, sizes, divId)
            .addService(window.googletag.pubads())

          // Listen for slot render ended to handle empty ads and track refreshes
          window.googletag.pubads().addEventListener('slotRenderEnded', (event) => {
            if (event.slot.getSlotElementId() === divId) {
              console.log(`Ad render event for ${divId}:`, {
                isEmpty: event.isEmpty,
                size: event.size,
                advertiserId: event.advertiserId
              })
              // Update refresh counter
              setRefreshCount(prev => prev + 1)
              setLastRefresh(Date.now())
              // Don't hide on empty for demo purposes
              // if (event.isEmpty) {
              //   setIsVisible(false)
              // }
            }
          })

          if (onSlotDefined) {
            onSlotDefined(slot)
          }

          console.log(`Displaying ad slot: ${divId}`)
          window.googletag.display(divId)
        }
      })
    }

    initAd()
  }, [divId, adUnitPath, sizes, isVisible, onSlotDefined])

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={containerRef}
      style={{
        minWidth: `${minWidth}px`,
        minHeight: `${minHeight}px`,
        position: 'relative',
        ...style,
      }}
    >
      <div
        id={divId}
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minWidth: `${minWidth}px`,
          minHeight: `${minHeight}px`,
        }}
      />
      {/* Placeholder ad - will be replaced by real GPT ads */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#f0f0f0',
          border: '2px solid #ddd',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
          color: '#666',
          zIndex: -1,
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
          📢 Advertisement
        </div>
        <div style={{ fontSize: '11px', opacity: 0.7 }}>
          {divId}
        </div>
        <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px' }}>
          GPT Ad Slot
        </div>
        {refreshCount > 0 && (
          <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '8px', color: '#0066cc', fontWeight: 'bold' }}>
            🔄 Refreshed: {refreshCount} time{refreshCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}
