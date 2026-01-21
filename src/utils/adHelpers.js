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
 * Check if an element is currently viewable in the viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - True if element is viewable
 */
export function isElementViewable(element, fallbackSize = null) {
  if (!element) return false
  
  const rect = element.getBoundingClientRect()
  let width = rect.width
  let height = rect.height

  // If element has no size yet, use fallback size for viewability check
  if ((width === 0 || height === 0) && fallbackSize) {
    width = fallbackSize.width || width
    height = fallbackSize.height || height
  }

  const right = rect.left + width
  const bottom = rect.top + height

  return rect.top < window.innerHeight && bottom > 0 && rect.left < window.innerWidth && right > 0
}
