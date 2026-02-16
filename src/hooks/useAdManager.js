import { useEffect, useRef, useState } from 'react'

/**
 * Hook to manage Google Publisher Tag ads
 * Handles initialization, refresh, and cleanup
 */
export function useAdManager() {
  const [isGPTReady, setIsGPTReady] = useState(false)
  const slotsRef = useRef(new Map())
  const refreshIntervalRef = useRef(null)
  const interstitialTimerRef = useRef(null)

  // Initialize GPT
  useEffect(() => {
    if (typeof window === 'undefined') return

    const initGPT = () => {
      window.googletag = window.googletag || { cmd: [] }
      
      window.googletag.cmd.push(() => {
        // Enable Single Request Architecture
        window.googletag.pubads().enableSingleRequest()
        
        // Note: enableServices() will be called in AdContainer after slots are defined
        // This is required for SRA to work correctly
        
        setIsGPTReady(true)
      })
    }

    // Check if GPT script is loaded
    if (window.googletag && window.googletag.apiReady) {
      initGPT()
    } else {
      // Wait for GPT to load
      const checkGPT = setInterval(() => {
        if (window.googletag && window.googletag.apiReady) {
          clearInterval(checkGPT)
          initGPT()
        }
      }, 100)

      return () => clearInterval(checkGPT)
    }
  }, [])

  // Define an ad slot
  const defineSlot = (adUnitPath, sizes, divId) => {
    if (!isGPTReady || !window.googletag) return null

    return new Promise((resolve) => {
      window.googletag.cmd.push(() => {
        // Check if slot already exists
        if (slotsRef.current.has(divId)) {
          resolve(slotsRef.current.get(divId))
          return
        }

        const slot = window.googletag
          .defineSlot(adUnitPath, sizes, divId)
          .addService(window.googletag.pubads())

        slotsRef.current.set(divId, slot)
        resolve(slot)
      })
    })
  }

  // Display an ad
  const displayAd = (divId) => {
    if (!isGPTReady || !window.googletag) return

    window.googletag.cmd.push(() => {
      window.googletag.display(divId)
    })
  }

  // Refresh specific ads
  const refreshAds = (divIds = null) => {
    if (!isGPTReady || !window.googletag) return

    window.googletag.cmd.push(() => {
      if (divIds) {
        const slots = divIds
          .map(id => slotsRef.current.get(id))
          .filter(slot => slot !== undefined)
        
        if (slots.length > 0) {
          window.googletag.pubads().refresh(slots)
        }
      } else {
        // Refresh all ads
        const allSlots = Array.from(slotsRef.current.values())
        if (allSlots.length > 0) {
          window.googletag.pubads().refresh(allSlots)
        }
      }
    })
  }

  // Destroy a slot
  const destroySlot = (divId) => {
    if (!window.googletag) return

    window.googletag.cmd.push(() => {
      const slot = slotsRef.current.get(divId)
      if (slot) {
        window.googletag.destroySlots([slot])
        slotsRef.current.delete(divId)
      }
    })
  }

  // Destroy all slots
  const destroyAllSlots = () => {
    if (!window.googletag) return

    window.googletag.cmd.push(() => {
      const allSlots = Array.from(slotsRef.current.values())
      if (allSlots.length > 0) {
        window.googletag.destroySlots(allSlots)
        slotsRef.current.clear()
      }
    })
  }

  // Start auto-refresh (every 60 seconds)
  const startAutoRefresh = (divIds = null) => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
    }

    refreshIntervalRef.current = setInterval(() => {
      refreshAds(divIds)
    }, 60000) // 60 seconds
  }

  // Stop auto-refresh
  const stopAutoRefresh = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current)
      refreshIntervalRef.current = null
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoRefresh()
      if (interstitialTimerRef.current) {
        clearTimeout(interstitialTimerRef.current)
      }
    }
  }, [])

  return {
    isGPTReady,
    defineSlot,
    displayAd,
    refreshAds,
    destroySlot,
    destroyAllSlots,
    startAutoRefresh,
    stopAutoRefresh,
  }
}
