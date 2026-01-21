import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function GoogleAnalytics() {
  const location = useLocation()

  useEffect(() => {
    // Check if gtag is available (script loaded)
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-KW5NKL5MBC', {
        page_path: location.pathname + location.search,
      })
    }
  }, [location])

  return null
}
