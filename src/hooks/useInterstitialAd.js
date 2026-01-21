import { useEffect, useState, useRef, useCallback } from 'react'
import { AD_CONFIG } from '../constants/adConfig'

/**
 * Hook to manage interstitial ad timing and display logic
 * 
 * Features:
 * - Shows ad 30 seconds after page load
 * - After closing, shows again 2 minutes from close time (not reset)
 * - Pauses timer when tab is hidden
 * - Only shows ad when tab is visible
 * 
 * @returns {Object} - { shouldShow, onClose }
 */
export function useInterstitialAd() {
  const [shouldShow, setShouldShow] = useState(false)
  const pageLoadTimeRef = useRef(Date.now())
  const lastCloseTimeRef = useRef(null)
  const timerRef = useRef(null)
  const pausedTimeRef = useRef(null) // Timestamp when timer was paused
  const remainingTimeRef = useRef(null) // Remaining time when paused
  const isTabVisibleRef = useRef(!document.hidden)

  // Calculate initial delay or refresh interval
  const getDelay = useCallback(() => {
    if (lastCloseTimeRef.current === null) {
      // First show: 30 seconds from page load
      return AD_CONFIG.INTERSTITIAL_INITIAL_DELAY
    } else {
      // Subsequent shows: 2 minutes from last close
      return AD_CONFIG.INTERSTITIAL_REFRESH_INTERVAL
    }
  }, [])

  // Get start time for current timer
  const getStartTime = useCallback(() => {
    if (lastCloseTimeRef.current === null) {
      return pageLoadTimeRef.current
    } else {
      return lastCloseTimeRef.current
    }
  }, [])

  // Clear existing timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  // Start or resume timer
  const startTimer = useCallback(() => {
    clearTimer()

    // Don't start timer if tab is hidden
    if (!isTabVisibleRef.current) {
      return
    }

    // If we have paused time, resume from there
    if (pausedTimeRef.current !== null && remainingTimeRef.current !== null) {
      const remaining = remainingTimeRef.current
      timerRef.current = setTimeout(() => {
        if (isTabVisibleRef.current) {
          setShouldShow(true)
        }
        pausedTimeRef.current = null
        remainingTimeRef.current = null
      }, remaining)
      return
    }

    // Calculate elapsed time since start
    const startTime = getStartTime()
    const elapsed = Date.now() - startTime
    const delay = getDelay()
    const remaining = Math.max(0, delay - elapsed)

    if (remaining > 0) {
      timerRef.current = setTimeout(() => {
        if (isTabVisibleRef.current) {
          setShouldShow(true)
        }
      }, remaining)
    } else {
      // Time has already elapsed
      if (isTabVisibleRef.current) {
        setShouldShow(true)
      }
    }
  }, [clearTimer, getDelay, getStartTime])

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      // Calculate remaining time
      const startTime = getStartTime()
      const elapsed = Date.now() - startTime
      const delay = getDelay()
      const remaining = Math.max(0, delay - elapsed)
      
      pausedTimeRef.current = Date.now()
      remainingTimeRef.current = remaining
      clearTimer()
    }
  }, [clearTimer, getDelay, getStartTime])

  // Resume timer
  const resumeTimer = useCallback(() => {
    // startTimer will check for paused state and use remaining time if available
    startTimer()
  }, [startTimer])

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden
      isTabVisibleRef.current = isVisible

      if (isVisible) {
        // Tab became visible - resume timer if ad not showing
        if (!shouldShow) {
          resumeTimer()
        }
      } else {
        // Tab became hidden - pause timer
        pauseTimer()
        // Hide ad if currently showing
        if (shouldShow) {
          setShouldShow(false)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [shouldShow, pauseTimer, resumeTimer])

  // Initialize timer on mount
  useEffect(() => {
    startTimer()

    return () => {
      clearTimer()
    }
  }, [startTimer, clearTimer])

  // Handle close
  const onClose = useCallback(() => {
    setShouldShow(false)
    lastCloseTimeRef.current = Date.now()
    pausedTimeRef.current = null
    remainingTimeRef.current = null
    clearTimer()
    
    // Start 2-minute timer from close time
    if (isTabVisibleRef.current) {
      startTimer()
    }
  }, [clearTimer, startTimer])

  return { shouldShow, onClose }
}
