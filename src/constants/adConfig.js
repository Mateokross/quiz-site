/**
 * Ad configuration constants
 * Centralized configuration for Google Publisher Tag (GPT) ads
 */

// Ad unit path (placeholder for testing)
export const AD_UNIT_PATH = '/6355419/Travel/Europe/France/Paris'

// Ad sizes for different placements
// All sizes ordered from largest to smallest (width first, then height)
export const AD_SIZES = {
  // Top banner sizes: 970x250, 728x90, 468x60, 336x280, 300x250, 320x100, 320x50, 300x100, 300x50, 234x60
  TOP_BANNER: [
    // [970, 250],
    [728, 90],
    [468, 60],
    // [336, 280],
    // [300, 250],
    [320, 100],
    [320, 50],
    [300, 100],
    [300, 50],
    [234, 60],
  ],
  // Bottom banner sizes: 970x90, 728x90, 468x60, 320x100, 320x50, 300x100, 300x50, 234x60
  BOTTOM_BANNER: [
    [970, 90],
    [728, 90],
    [468, 60],
    [320, 100],
    [320, 50],
    [300, 100],
    [300, 50],
    [234, 60],
  ],
  // Sidebar sizes: 300x600, 160x600, 120x600 (desktop only, height-aware)
  SIDEBAR: [
    [300, 600],
    [160, 600],
    [120, 600],
  ],
  // In-content sizes (between questions): 728x90, 336x280, 300x250, 250x250, 200x200, 180x150, 468x60, 320x100, 320x50, 300x100, 300x50, 234x60, 125x125
  IN_CONTENT: [
    [728, 90],
    [336, 280],
    [300, 250],
    [250, 250],
    [200, 200],
    [180, 150],
    [468, 60],
    [320, 100],
    [320, 50],
    [300, 100],
    [300, 50],
    [234, 60],
    [125, 125],
  ],
  // Interstitial sizes: 480x320, 320x480, 336x280, 300x250 (height-aware)
  INTERSTITIAL: [
    [480, 320],
    [320, 480],
    [336, 280],
    [300, 250],
  ],
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
  INTERSTITIAL_INITIAL_DELAY: 30000, // 30 seconds
  INTERSTITIAL_REFRESH_INTERVAL: 120000, // 2 minutes
}

// Calculate required viewport width for sidebars
// Content min-width + left sidebar + right sidebar
export const SIDEBAR_REQUIRED_WIDTH = 
  AD_CONFIG.CONTENT_MIN_WIDTH_XL + (AD_CONFIG.SIDEBAR_WIDTH * 2)
