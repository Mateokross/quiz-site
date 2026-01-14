/**
 * Shares quiz result using Web Share API or clipboard fallback
 * @param {string} resultTitle - The title of the result
 * @param {string} quizTitle - The title of the quiz
 * @param {string} quizId - The quiz ID for URL generation
 * @returns {Promise<boolean>} - True if share was successful
 */
export async function shareResult(resultTitle, quizTitle, quizId) {
  const url = `${window.location.origin}/quiz/${quizId}`
  const text = `I got ${resultTitle}! ${quizTitle} - ${url}`

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
