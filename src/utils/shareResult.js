/**
 * Gets the share URL for the quiz result
 * @param {string} quizId - The quiz ID for URL generation
 * @returns {string} - The URL
 */
function getShareUrl(quizId) {
  return `${window.location.origin}/quiz/${quizId}`
}

/**
 * Gets the share text for the quiz result
 * @param {string} resultTitle - The title of the result
 * @param {string} quizTitle - The title of the quiz
 * @param {string} quizId - The quiz ID for URL generation
 * @returns {string} - The share text
 */
function getShareText(resultTitle, quizTitle, quizId) {
  const url = getShareUrl(quizId)
  return `I got ${resultTitle}! ${quizTitle} - ${url}`
}

/**
 * Copies the URL to clipboard
 * @param {string} quizId - The quiz ID for URL generation
 * @returns {Promise<boolean>} - True if copy was successful
 */
export async function copyUrl(quizId) {
  const url = getShareUrl(quizId)
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch (error) {
    console.error('Error copying URL to clipboard:', error)
    return false
  }
}

/**
 * Copies the full result text to clipboard (as displayed to the user)
 * @param {string} resultTitle - The title of the result
 * @param {string} resultDescription - The description of the result
 * @returns {Promise<boolean>} - True if copy was successful
 */
export async function copyText(resultTitle, resultDescription) {
  const text = `Your Result: ${resultTitle}\n${resultDescription}`
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying text to clipboard:', error)
    return false
  }
}

/**
 * Opens Twitter share dialog
 * @param {string} resultTitle - The title of the result
 * @param {string} quizTitle - The title of the quiz
 * @param {string} quizId - The quiz ID for URL generation
 */
export function shareOnTwitter(resultTitle, quizTitle, quizId) {
  const url = getShareUrl(quizId)
  const text = `I got ${resultTitle}! ${quizTitle}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, '_blank', 'width=550,height=420')
}

/**
 * Opens Facebook share dialog
 * @param {string} quizId - The quiz ID for URL generation
 */
export function shareOnFacebook(quizId) {
  const url = getShareUrl(quizId)
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(facebookUrl, '_blank', 'width=550,height=420')
}

/**
 * Shares quiz result using Web Share API or clipboard fallback
 * @param {string} resultTitle - The title of the result
 * @param {string} quizTitle - The title of the quiz
 * @param {string} quizId - The quiz ID for URL generation
 * @returns {Promise<boolean>} - True if share was successful
 */
export async function shareResult(resultTitle, quizTitle, quizId) {
  const url = getShareUrl(quizId)
  const text = getShareText(resultTitle, quizTitle, quizId)

  // Try Web Share API first (mobile-friendly)
  if (navigator.share) {
    try {
      await navigator.share({
        title: quizTitle,
        text: `I got ${resultTitle}!`,
        url: url,
      })
      return true
    } catch (error) {
      // User cancelled or error occurred
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error)
      }
      // Fall through to clipboard fallback
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}
