import { useEffect, useState, useRef } from 'react'

/**
 * Hook for lazy loading ads using Intersection Observer
 * Defers ad loading until the container is near the viewport
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.rootMargin - Margin around root (default: '100px')
 * @param {number} options.threshold - Intersection threshold (default: 0.1)
 * @returns {Object} - { containerRef, shouldLoad }
 */
export function useLazyAd(options = {}) {
  const { rootMargin = '100px', threshold = 0.1 } = options
  const [shouldLoad, setShouldLoad] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    // If already loading or no container, skip
    if (!containerRef.current || shouldLoad) return

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately if IntersectionObserver not supported
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [shouldLoad, rootMargin, threshold])

  return { containerRef, shouldLoad }
}
