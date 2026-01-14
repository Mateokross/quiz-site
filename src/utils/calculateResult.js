/**
 * Calculates the winning result category based on scores
 * @param {Object} scores - Object with category keys (A, B, C, D) and numeric values
 * @param {Array} resultOrder - Array of result keys in order (for tie-breaking)
 * @returns {string} - The winning category key
 */
export function calculateResult(scores, resultOrder) {
  let maxScore = -1
  let winner = null

  // Iterate through results in order for tie-breaking
  for (const category of resultOrder) {
    const score = scores[category] || 0
    if (score > maxScore) {
      maxScore = score
      winner = category
    }
  }

  return winner || resultOrder[0] // Fallback to first result if no scores
}
