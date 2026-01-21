import { useEffect, useState, useRef } from 'react'

/**
 * Hook to detect if sidebar ads should be loaded based on viewport width
 * and actual visibility of the sidebar container
 */
export function useSidebarVisibility(containerRef, minWidth = 1280) {
  const [isVisible, setIsVisible] = useState(() => {
    // Initialize based on current viewport width
    if (typeof window !== 'undefined') {
      return window.innerWidth >= minWidth
    }
    return false
  })
  const [hasSpace, setHasSpace] = useState(() => {
    // Initialize based on current viewport width
    if (typeof window !== 'undefined') {
      const viewportWidth = window.innerWidth
      const contentMinWidth = 680
      const sidebarWidth = 300
      const requiredWidth = contentMinWidth + (sidebarWidth * 2)
      return viewportWidth >= requiredWidth
    }
    return false
  })

  useEffect(() => {
    const checkVisibility = () => {
      const viewportWidth = window.innerWidth
      const meetsMinWidth = viewportWidth >= minWidth
      
      // Check if there's sufficient space (viewport width - content min-width >= sidebar width)
      // Content min-width at xl is 680px, sidebar is 300px
      // So we need at least 680 + 300 + 300 = 1280px
      const contentMinWidth = 680
      const sidebarWidth = 300
      const requiredWidth = contentMinWidth + (sidebarWidth * 2)
      const sufficientSpace = viewportWidth >= requiredWidth

      // If viewport meets min width, assume container will be visible (CSS handles display)
      // We don't need to check computed styles since Tailwind's `hidden xl:block` handles visibility
      setIsVisible(meetsMinWidth)
      setHasSpace(sufficientSpace)
    }

    // Initial check with small delay to ensure DOM is ready
    const timer = setTimeout(checkVisibility, 0)

    // Listen to resize events
    window.addEventListener('resize', checkVisibility)

    // Cleanup
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [minWidth])

  return { isVisible, hasSpace }
}
