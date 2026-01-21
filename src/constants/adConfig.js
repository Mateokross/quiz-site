/**
 * Ad configuration constants
 * Centralized configuration for Google Publisher Tag (GPT) ads
 */

// Ad unit path (placeholder for testing)
export const AD_UNIT_PATH = '/6355419/Travel/Europe/France/Paris'

// Ad sizes for different placements
export const AD_SIZES = {
  TOP_BANNER: {
    desktop: [[728, 90], [320, 50]],
    mobile: [[320, 100], [320, 50]],
  },
  BOTTOM_BANNER: {
    desktop: [[728, 90], [320, 50]],
    mobile: [[320, 50]],
  },
  SIDEBAR: [[300, 250], [160, 600]],
  IN_CONTENT: {
    desktop: [[728, 90], [300, 250]],
    mobile: [[320, 50]],
  },
}

// Breakpoints and dimensions
export const AD_BREAKPOINTS = {
  MOBILE: 768, // Tailwind md breakpoint
  XL: 1280, // Tailwind xl breakpoint - when sidebars appear
}

// Ad configuration values
export const AD_CONFIG = {
  REFRESH_INTERVAL: 60000, // 60 seconds (meets GPT best practice of min 30s)
  NAVBAR_CONTENT_HEIGHT: 73, // Height of navbar content (without ad)
  CONTENT_MIN_WIDTH_XL: 680, // Minimum content width at xl breakpoint
  SIDEBAR_WIDTH: 300, // Width of sidebar ads
}

// Calculate required viewport width for sidebars
// Content min-width + left sidebar + right sidebar
export const SIDEBAR_REQUIRED_WIDTH = 
  AD_CONFIG.CONTENT_MIN_WIDTH_XL + (AD_CONFIG.SIDEBAR_WIDTH * 2)
