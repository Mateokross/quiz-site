import { useEffect, useRef, useState, useCallback } from 'react'
import { AD_BREAKPOINTS, AD_CONFIG, AD_UNIT_PATH, AD_SIZES } from '../constants/adConfig'
import { calculateMaxDimensions, isElementViewable } from '../utils/adHelpers'

// Helper to get default sizes for a slot ID (for pre-defined slots)
function getDefaultSizesForSlot(slotId, isMobile) {
  switch (slotId) {
    case 'ad-top-banner':
      return isMobile ? AD_SIZES.TOP_BANNER.mobile : AD_SIZES.TOP_BANNER.desktop
    case 'ad-bottom-banner':
      return isMobile ? AD_SIZES.BOTTOM_BANNER.mobile : AD_SIZES.BOTTOM_BANNER.desktop
    case 'ad-sidebar-left':
    case 'ad-sidebar-right':
      return AD_SIZES.SIDEBAR
    default:
      return []
  }
}

/**
 * Hook for managing Google Publisher Tag (GPT) ads
 * Handles slot registration, refresh intervals, and no-fill detection
 */
export function useAdManager() {
  const [isMobile, setIsMobile] = useState(false)
  const refreshIntervalsRef = useRef(new Map())
  const slotsRef = useRef(new Map())
  const sizesRef = useRef(new Map())

  // Detect mobile vs desktop
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < AD_BREAKPOINTS.MOBILE)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Helper to get sizes for a slot with fallback to defaults
  const getSizesForSlot = useCallback((slotId) => {
    let sizes = sizesRef.current.get(slotId)
    if (!sizes || sizes.length === 0) {
      sizes = getDefaultSizesForSlot(slotId, isMobile)
    }
    return sizes
  }, [isMobile])

  // Helper to check if a slot is viewable
  const isSlotViewable = useCallback((slot) => {
    const slotId = slot.getSlotElementId()
    const element = document.getElementById(slotId)
    if (!element) return false

    const sizes = getSizesForSlot(slotId)
    const { maxWidth, maxHeight } = calculateMaxDimensions(sizes)
    const fallbackSize = { width: maxWidth, height: maxHeight }

    return isElementViewable(element, fallbackSize)
  }, [getSizesForSlot])

  // Register an ad slot
  const registerSlot = useCallback((slotId, sizes, adUnitPath = AD_UNIT_PATH) => {
    if (!window.googletag) {
      console.warn('googletag not available')
      return null
    }

    // Store sizes for viewability checks
    sizesRef.current.set(slotId, sizes)

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
  }, [])

  // Display an ad slot
  const displaySlot = useCallback((slotId) => {
    if (!window.googletag) {
      console.warn('googletag not available')
      return
    }

    window.googletag.cmd.push(function() {
      window.googletag.display(slotId)
    })
  }, [])

  // Refresh a specific slot (only if viewable)
  const refreshSlot = useCallback((slotId) => {
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
        // Check if slot element is viewable before refreshing
        if (isSlotViewable(slot)) {
          window.googletag.pubads().refresh([slot])
        }
      }
    })
  }, [isSlotViewable])

  // Set up auto-refresh for a slot
  const setupRefresh = useCallback((slotId, intervalMs = AD_CONFIG.REFRESH_INTERVAL) => {
    // Clear existing interval if any
    if (refreshIntervalsRef.current.has(slotId)) {
      clearInterval(refreshIntervalsRef.current.get(slotId))
    }

    const interval = setInterval(() => {
      refreshSlot(slotId)
    }, intervalMs)

    refreshIntervalsRef.current.set(slotId, interval)
  }, [refreshSlot])

  // Clean up refresh interval for a slot
  const cleanupRefresh = useCallback((slotId) => {
    if (refreshIntervalsRef.current.has(slotId)) {
      clearInterval(refreshIntervalsRef.current.get(slotId))
      refreshIntervalsRef.current.delete(slotId)
    }
  }, [])

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      refreshIntervalsRef.current.forEach((interval) => {
        clearInterval(interval)
      })
      refreshIntervalsRef.current.clear()
    }
  }, [])

  // Refresh all slots (only viewable ones unless forced)
  const refreshAllSlots = useCallback((force = false) => {
    if (!window.googletag) {
      return
    }

    window.googletag.cmd.push(function() {
      const allSlots = window.googletag.pubads().getSlots()
      if (allSlots.length === 0) return

      if (force) {
        window.googletag.pubads().refresh(allSlots)
        return
      }

      // Filter to only viewable slots
      const viewableSlots = allSlots.filter(slot => isSlotViewable(slot))

      if (viewableSlots.length > 0) {
        window.googletag.pubads().refresh(viewableSlots)
      }
    })
  }, [isSlotViewable])

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
