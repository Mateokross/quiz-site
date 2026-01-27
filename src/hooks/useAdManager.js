import { useEffect, useRef, useState, useCallback } from 'react'
import { AD_BREAKPOINTS, AD_CONFIG, AD_UNIT_PATH, AD_SIZES } from '../constants/adConfig'
import { calculateMaxDimensions, isElementViewable, createWidthBasedMapping, createHeightAwareMapping } from '../utils/adHelpers'

// Helper to get default sizes for a slot ID (for pre-defined slots)
function getDefaultSizesForSlot(slotId) {
  switch (slotId) {
    case 'ad-top-banner':
      return AD_SIZES.TOP_BANNER
    case 'ad-bottom-banner':
      return AD_SIZES.BOTTOM_BANNER
    case 'ad-sidebar-left':
    case 'ad-sidebar-right':
      return AD_SIZES.SIDEBAR
    case 'ad-interstitial':
      return AD_SIZES.INTERSTITIAL
    default:
      // Check if it's an in-content ad (pattern: ad-in-content-{index})
      if (slotId.startsWith('ad-in-content-')) {
        return AD_SIZES.IN_CONTENT
      }
      return []
  }
}

// Helper to determine if a slot needs height-aware mapping
function needsHeightAwareMapping(slotId) {
  return slotId.startsWith('ad-in-content-') || 
         slotId === 'ad-sidebar-left' || 
         slotId === 'ad-sidebar-right' || 
         slotId === 'ad-interstitial'
}

// Helper to check if a slot is pre-defined in index.html (already has sizeMapping)
function isPreDefinedSlot(slotId) {
  return slotId === 'ad-top-banner' ||
         slotId === 'ad-bottom-banner' ||
         slotId === 'ad-sidebar-left' ||
         slotId === 'ad-sidebar-right' ||
         slotId === 'ad-interstitial'
}

/**
 * Hook for managing Google Publisher Tag (GPT) ads
 * Handles slot registration, refresh intervals, and no-fill detection
 */
export function useAdManager() {
  const refreshIntervalsRef = useRef(new Map())
  const slotsRef = useRef(new Map())
  const sizesRef = useRef(new Map())

  // Helper to get sizes for a slot with fallback to defaults
  const getSizesForSlot = useCallback((slotId) => {
    let sizes = sizesRef.current.get(slotId)
    if (!sizes || sizes.length === 0) {
      sizes = getDefaultSizesForSlot(slotId)
    }
    return sizes
  }, [])

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
          // Only apply sizeMapping for runtime-created slots (e.g., in-content ads)
          // Pre-defined slots in index.html already have sizeMapping applied, so skip it
          if (!isPreDefinedSlot(slotId)) {
            const mapping = needsHeightAwareMapping(slotId) 
              ? createHeightAwareMapping(sizes)
              : createWidthBasedMapping(sizes)
            
            if (mapping) {
              slot.defineSizeMapping(mapping)
            }
          }
          
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
  // forceSlotIds: array of slot IDs to force refresh regardless of viewability
  const refreshAllSlots = useCallback((force = false, forceSlotIds = []) => {
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

      // Get slots to force refresh
      const forceRefreshSlots = forceSlotIds.length > 0
        ? allSlots.filter(slot => forceSlotIds.includes(slot.getSlotElementId()))
        : []

      // Filter to only viewable slots (excluding force-refresh slots)
      const viewableSlots = allSlots.filter(slot => {
        const slotId = slot.getSlotElementId()
        // Include if it's in force list or is viewable
        return forceSlotIds.includes(slotId) || isSlotViewable(slot)
      })

      // Combine and deduplicate
      const slotsToRefresh = [...new Set([...forceRefreshSlots, ...viewableSlots])]

      if (slotsToRefresh.length > 0) {
        window.googletag.pubads().refresh(slotsToRefresh)
      }
    })
  }, [isSlotViewable])

  return {
    registerSlot,
    displaySlot,
    refreshSlot,
    refreshAllSlots,
    setupRefresh,
    cleanupRefresh,
  }
}
