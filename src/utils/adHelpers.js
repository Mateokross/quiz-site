/**
 * Utility functions for ad-related calculations
 */

/**
 * Calculate maximum width and height from an array of ad sizes
 * @param {Array<Array<number>>} sizes - Array of [width, height] pairs
 * @returns {Object} - { maxWidth, maxHeight }
 */
export function calculateMaxDimensions(sizes) {
  if (!sizes || sizes.length === 0) {
    return { maxWidth: 0, maxHeight: 0 }
  }
  
  return {
    maxWidth: Math.max(...sizes.map(size => size[0])),
    maxHeight: Math.max(...sizes.map(size => size[1])),
  }
}

/**
 * Check if an element is covered by another element
 * Uses elementsFromPoint to check what's actually visible at key points
 * @param {HTMLElement} element - The element to check
 * @param {Object} fallbackSize - Optional fallback size if element has no dimensions
 * @returns {boolean} - True if element is covered by another element
 */
function isElementCovered(element, fallbackSize = null) {
  if (typeof document === 'undefined' || !element) return false

  const rect = element.getBoundingClientRect()
  let width = rect.width
  let height = rect.height

  // If element has no size yet, use fallback size
  if ((width === 0 || height === 0) && fallbackSize) {
    width = fallbackSize.width || width
    height = fallbackSize.height || height
  }

  // If element has no dimensions, can't check coverage
  if (width === 0 || height === 0) {
    return false
  }

  // Check multiple points: center and corners
  const centerX = rect.left + width / 2
  const centerY = rect.top + height / 2
  const points = [
    [centerX, centerY], // Center
    [rect.left + width * 0.25, rect.top + height * 0.25], // Top-left quadrant
    [rect.left + width * 0.75, rect.top + height * 0.75], // Bottom-right quadrant
  ]

  // Check if any point is covered by another element
  for (const [x, y] of points) {
    // Skip if point is outside viewport
    if (x < 0 || x > window.innerWidth || y < 0 || y > window.innerHeight) {
      continue
    }

    try {
      const elementsAtPoint = document.elementsFromPoint(x, y)
      
      // Find the topmost visible element (first non-pointer-events-none element)
      let topmostElement = null
      for (const el of elementsAtPoint) {
        const style = window.getComputedStyle(el)
        // Skip elements that don't block pointer events (like backdrop overlays)
        if (style.pointerEvents !== 'none') {
          topmostElement = el
          break
        }
      }

      // If no blocking element found, use first element
      if (!topmostElement && elementsAtPoint.length > 0) {
        topmostElement = elementsAtPoint[0]
      }

      // Check if the topmost element is NOT the ad element or one of its children
      if (topmostElement && topmostElement !== element && !element.contains(topmostElement)) {
        // Check if the covering element is actually visible (not transparent/hidden)
        const coveringStyle = window.getComputedStyle(topmostElement)
        const isVisible = 
          coveringStyle.display !== 'none' &&
          coveringStyle.visibility !== 'hidden' &&
          parseFloat(coveringStyle.opacity) > 0

        if (isVisible) {
          // Check if covering element actually overlaps the ad's bounding box
          const coveringRect = topmostElement.getBoundingClientRect()
          const overlaps = !(
            coveringRect.right < rect.left ||
            coveringRect.left > rect.right ||
            coveringRect.bottom < rect.top ||
            coveringRect.top > rect.bottom
          )
          
          if (overlaps) {
            // Check if it's a positioned overlay (likely a modal/interstitial) with high z-index
            const zIndex = parseInt(coveringStyle.zIndex, 10)
            const isPositioned = coveringStyle.position === 'fixed' || coveringStyle.position === 'absolute'
            
            // Only consider it covered if it's a positioned overlay with z-index >= 50 (interstitial level)
            // or if it's a fixed/absolute element with z-index >= 20 (modal level)
            if ((isPositioned && zIndex >= 20) || zIndex >= 50) {
              return true
            }
          }
        }
      }
    } catch (e) {
      // elementsFromPoint might fail in some edge cases, skip this point
      continue
    }
  }

  return false
}

/**
 * Check if an element is currently viewable in the viewport
 * @param {HTMLElement} element - The element to check
 * @param {Object} fallbackSize - Optional fallback size if element has no dimensions
 * @returns {boolean} - True if element is viewable
 */
export function isElementViewable(element, fallbackSize = null) {
  if (!element) {
    return false
  }
  
  const rect = element.getBoundingClientRect()
  let width = rect.width
  let height = rect.height

  // If element has no size yet, use fallback size for viewability check
  if ((width === 0 || height === 0) && fallbackSize) {
    width = fallbackSize.width || width
    height = fallbackSize.height || height
  }

  // Check if element is in viewport
  const right = rect.left + width
  const bottom = rect.top + height
  const isInViewport = rect.top < window.innerHeight && bottom > 0 && rect.left < window.innerWidth && right > 0

  if (!isInViewport) {
    return false
  }

  // Check if element is covered by another element (overlay, modal, etc.)
  if (isElementCovered(element, fallbackSize)) {
    return false
  }

  return true
}
