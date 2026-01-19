/**
 * Gets the share URL for the quiz result
 * @param {string} quizId - The quiz ID for URL generation
 * @param {string} resultCategory - The result category (e.g., "A", "B")
 * @returns {string} - The URL
 */
function getShareUrl(quizId, resultCategory) {
  return `${window.location.origin}/share/${quizId}/${resultCategory}`
}

/**
 * Gets the share text for the quiz result
 * @param {string} resultTitle - The title of the result
 * @param {string} quizTitle - The title of the quiz
 * @param {string} quizId - The quiz ID for URL generation
 * @param {string} resultCategory - The result category (e.g., "A", "B")
 * @returns {string} - The share text
 */
function getShareText(resultTitle, quizTitle, quizId, resultCategory) {
  const url = getShareUrl(quizId, resultCategory)
  return `I got ${resultTitle}! ${quizTitle} - ${url}`
}

/**
 * Copies the URL to clipboard
 * @param {string} quizId - The quiz ID for URL generation
 * @param {string} resultCategory - The result category (e.g., "A", "B")
 * @returns {Promise<boolean>} - True if copy was successful
 */
export async function copyUrl(quizId, resultCategory) {
  const url = getShareUrl(quizId, resultCategory)
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
 * @param {string} quizTitle - The title of the quiz
 * @param {string} quizId - The quiz ID for URL generation
 * @param {string} resultCategory - The result category (e.g., "A", "B")
 * @returns {Promise<boolean>} - True if copy was successful
 */
export async function copyText(resultTitle, resultDescription, quizTitle, quizId, resultCategory) {
  const url = getShareUrl(quizId, resultCategory)
  const text = `Your Result: ${resultTitle}\n${resultDescription}\n\nResults from ${quizTitle}\n${url}`
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
 * @param {string} resultCategory - The result category (e.g., "A", "B")
 */
export function shareOnTwitter(resultTitle, quizTitle, quizId, resultCategory) {
  const url = getShareUrl(quizId, resultCategory)
  const text = `I got ${resultTitle}! ${quizTitle}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(twitterUrl, '_blank', 'width=550,height=420')
}

/**
 * Opens Facebook share dialog
 * @param {string} quizId - The quiz ID for URL generation
 * @param {string} resultCategory - The result category (e.g., "A", "B")
 */
export function shareOnFacebook(quizId, resultCategory) {
  const url = getShareUrl(quizId, resultCategory)
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(facebookUrl, '_blank', 'width=550,height=420')
}

/**
 * Opens WhatsApp share dialog
 * @param {string} resultTitle - The title of the result
 * @param {string} quizTitle - The title of the quiz
 * @param {string} quizId - The quiz ID for URL generation
 * @param {string} resultCategory - The result category (e.g., "A", "B")
 */
export function shareOnWhatsApp(resultTitle, quizTitle, quizId, resultCategory) {
  const url = getShareUrl(quizId, resultCategory)
  const text = `I got ${resultTitle}! ${quizTitle} - ${url}`
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(whatsappUrl, '_blank', 'width=550,height=420')
}

/**
 * Shares quiz result using Web Share API or clipboard fallback
 * @param {string} resultTitle - The title of the result
 * @param {string} quizTitle - The title of the quiz
 * @param {string} quizId - The quiz ID for URL generation
 * @param {string} resultCategory - The result category (e.g., "A", "B")
 * @returns {Promise<boolean>} - True if share was successful
 */
export async function shareResult(resultTitle, quizTitle, quizId, resultCategory) {
  const url = getShareUrl(quizId, resultCategory)
  const text = getShareText(resultTitle, quizTitle, quizId, resultCategory)

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

/**
 * Downloads quiz result as PNG image
 * @param {HTMLElement} element - The DOM element to capture
 * @param {string} quizTitle - The title of the quiz
 * @param {string} resultTitle - The title of the result
 * @param {string} backgroundColor - Background color for the image
 * @param {string} quizId - The quiz ID for generating the quiz link
 * @param {string} accentColor - The primary color for styling the footer text
 * @returns {Promise<boolean>} - True if download was successful
 */
export async function downloadResultImage(element, quizTitle, resultTitle, backgroundColor, quizId, accentColor = '#000000') {
  if (!element) {
    console.error('Element not found for image capture')
    return false
  }

  // Store original styles
  const originalPadding = element.style.padding
  const originalBoxSizing = element.style.boxSizing

  // Temporarily add padding for capture (this won't be visible as we'll restore immediately)
  element.style.padding = '40px'
  element.style.boxSizing = 'border-box'

  try {
    const { toPng } = await import('html-to-image')
    
    // Capture the element first (without footer)
    const baseDataUrl = await toPng(element, {
      backgroundColor: backgroundColor,
      pixelRatio: 2,
      quality: 1.0
    })

    // Restore styles immediately
    element.style.padding = originalPadding
    element.style.boxSizing = originalBoxSizing

    // Create a canvas to composite the footer
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = baseDataUrl
    })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height + 120 // Add space for footer

    // Draw the base image
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)

    // Draw border line
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(40, img.height + 40)
    ctx.lineTo(canvas.width - 40, img.height + 40)
    ctx.stroke()

    // Draw footer text
    ctx.fillStyle = accentColor
    ctx.font = '600 16px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(quizTitle, canvas.width / 2, img.height + 64)

    const quizLink = `${window.location.origin}/quiz/${quizId}`
    ctx.fillStyle = '#666'
    ctx.font = '14px sans-serif'
    ctx.fillText(quizLink, canvas.width / 2, img.height + 88)

    const dataUrl = canvas.toDataURL('image/png')

    // Sanitize filename: replace spaces and special chars with hyphens, lowercase
    const sanitizeFilename = (str) => {
      return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    const sanitizedQuizTitle = sanitizeFilename(quizTitle)
    const sanitizedResultTitle = sanitizeFilename(resultTitle)
    const filename = `${sanitizedQuizTitle}-${sanitizedResultTitle}.png`

    // Create temporary anchor element to trigger download
    const link = document.createElement('a')
    link.download = filename
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (error) {
    console.error('Error downloading image:', error)
    // Restore styles even on error
    element.style.padding = originalPadding
    element.style.boxSizing = originalBoxSizing
    return false
  }
}
