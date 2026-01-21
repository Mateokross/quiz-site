import { useEffect, useRef, useState } from 'react'

/**
 * Hook for managing Google Publisher Tag (GPT) ads
 * Handles slot registration, refresh intervals, and no-fill detection
 */
export function useAdManager() {
  const [isMobile, setIsMobile] = useState(false)
  const refreshIntervalsRef = useRef(new Map())
  const slotsRef = useRef(new Map())

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Register an ad slot
  const registerSlot = (slotId, sizes, adUnitPath = '/6355419/Travel/Europe/France/Paris') => {
    if (!window.googletag) {
      console.warn('googletag not available')
      return null
    }

    // Check if slot already exists in our cache
    if (slotsRef.current.has(slotId)) {
      return slotsRef.current.get(slotId)
    }

    let slot = null
    window.googletag.cmd.push(function() {
      // Check if slot was already defined (e.g., in index.html)
      slot = window.googletag.pubads().getSlots().find(s => s.getSlotElementId() === slotId)
      
      // If not found, define it
      if (!slot) {
        slot = window.googletag.defineSlot(adUnitPath, sizes, slotId)
        if (slot) {
          slot.addService(window.googletag.pubads())
        }
      }
      
      // Cache the slot
      if (slot) {
        slotsRef.current.set(slotId, slot)
      }
    })

    return slot
  }

  // Display an ad slot
  const displaySlot = (slotId) => {
    if (!window.googletag) {
      console.warn('googletag not available')
      return
    }

    window.googletag.cmd.push(function() {
      window.googletag.display(slotId)
    })
  }

  // Refresh a specific slot
  const refreshSlot = (slotId) => {
    if (!window.googletag) {
      return
    }

    window.googletag.cmd.push(function() {
      // Try to get slot from cache first
      let slot = slotsRef.current.get(slotId)
      
      // If not in cache, try to find it from existing slots
      if (!slot) {
        slot = window.googletag.pubads().getSlots().find(s => s.getSlotElementId() === slotId)
        if (slot) {
          slotsRef.current.set(slotId, slot)
        }
      }
      
      if (slot) {
        window.googletag.pubads().refresh([slot])
      }
    })
  }

  // Set up auto-refresh for a slot (every 60 seconds)
  const setupRefresh = (slotId, intervalMs = 60000) => {
    // Clear existing interval if any
    if (refreshIntervalsRef.current.has(slotId)) {
      clearInterval(refreshIntervalsRef.current.get(slotId))
    }

    const interval = setInterval(() => {
      refreshSlot(slotId)
    }, intervalMs)

    refreshIntervalsRef.current.set(slotId, interval)
  }

  // Clean up refresh interval for a slot
  const cleanupRefresh = (slotId) => {
    if (refreshIntervalsRef.current.has(slotId)) {
      clearInterval(refreshIntervalsRef.current.get(slotId))
      refreshIntervalsRef.current.delete(slotId)
    }
  }

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      refreshIntervalsRef.current.forEach((interval) => {
        clearInterval(interval)
      })
      refreshIntervalsRef.current.clear()
    }
  }, [])

  // Refresh all slots
  const refreshAllSlots = () => {
    if (!window.googletag) {
      return
    }

    window.googletag.cmd.push(function() {
      const allSlots = window.googletag.pubads().getSlots()
      if (allSlots.length > 0) {
        window.googletag.pubads().refresh(allSlots)
      }
    })
  }

  return {
    isMobile,
    registerSlot,
    displaySlot,
    refreshSlot,
    refreshAllSlots,
    setupRefresh,
    cleanupRefresh,
  }
}
