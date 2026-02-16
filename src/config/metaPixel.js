/**
 * Meta Pixel Configuration
 * Centralized configuration for Meta (Facebook) Pixel tracking
 */

export const META_PIXEL_ID = '1296537379044452'

/**
 * Custom event names
 */
export const META_EVENTS = {
  QUIZ_MILESTONE: 'QuizMilestone',
  QUIZ_COMPLETED: 'QuizCompleted',
  RESULT_VIEWED: 'ResultViewed',
}

/**
 * Track a custom Meta Pixel event
 * @param {string} eventName - Name of the event to track
 * @param {Object} params - Optional parameters to send with the event
 */
export function trackMetaEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log(`📊 Meta Pixel: Tracking event "${eventName}"`, params)
    window.fbq('track', eventName, params)
  } else {
    console.warn('Meta Pixel not loaded')
  }
}

/**
 * Track a custom Meta Pixel event (non-standard events)
 * @param {string} eventName - Name of the custom event
 * @param {Object} params - Optional parameters to send with the event
 */
export function trackMetaCustomEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log(`📊 Meta Pixel: Tracking custom event "${eventName}"`, params)
    window.fbq('trackCustom', eventName, params)
  } else {
    console.warn('Meta Pixel not loaded')
  }
}

/**
 * Track PageView event
 */
export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    console.log('📊 Meta Pixel: Tracking PageView')
    window.fbq('track', 'PageView')
  }
}
