import { useEffect, useState } from 'react'
import { AD_BREAKPOINTS, SIDEBAR_REQUIRED_WIDTH } from '../constants/adConfig'

/**
 * Hook to detect if sidebar ads should be loaded based on viewport width
 * and available space for sidebars
 */
export function useSidebarVisibility(minWidth = AD_BREAKPOINTS.XL) {
  const checkVisibility = () => {
    const viewportWidth = window.innerWidth
    const meetsMinWidth = viewportWidth >= minWidth
    const sufficientSpace = viewportWidth >= SIDEBAR_REQUIRED_WIDTH
    return { isVisible: meetsMinWidth, hasSpace: sufficientSpace }
  }

  const initialState = typeof window !== 'undefined' 
    ? checkVisibility() 
    : { isVisible: false, hasSpace: false }

  const [isVisible, setIsVisible] = useState(initialState.isVisible)
  const [hasSpace, setHasSpace] = useState(initialState.hasSpace)

  useEffect(() => {
    const updateVisibility = () => {
      const { isVisible: visible, hasSpace: space } = checkVisibility()
      setIsVisible(visible)
      setHasSpace(space)
    }

    // Initial check (useEffect runs after render, so DOM is ready)
    updateVisibility()

    // Listen to resize events
    window.addEventListener('resize', updateVisibility)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateVisibility)
    }
  }, [minWidth])

  return { isVisible, hasSpace }
}
