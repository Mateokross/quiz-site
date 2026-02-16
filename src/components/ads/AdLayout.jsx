import { useEffect, useState } from 'react'
import TopBannerAd from './TopBannerAd'
import BottomBannerAd from './BottomBannerAd'
import SidebarAd from './SidebarAd'
import InterstitialAd from './InterstitialAd'

/**
 * AdLayout Component
 * Manages all ad types on a page
 * Handles refresh logic and interstitial timing
 */
export default function AdLayout({
  showTopBanner = true,
  showBottomBanner = true,
  showSidebars = true,
  showInterstitial = true,
  topBannerFixed = false,
  topBannerInsideNavbar = false,
  children,
}) {
  const [interstitialVisible, setInterstitialVisible] = useState(false)
  const [shouldRefresh, setShouldRefresh] = useState(0)

  // Auto-refresh ads every 60 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Only refresh if interstitial is not visible
      if (!interstitialVisible && window.googletag) {
        console.log('🔄 Auto-refreshing all ads (60s interval)...')
        window.googletag.cmd.push(() => {
          window.googletag.pubads().refresh()
        })
      }
    }, 60000) // 60 seconds

    return () => clearInterval(refreshInterval)
  }, [interstitialVisible])

  // Refresh ads when component mounts (page transition)
  useEffect(() => {
    if (window.googletag && !interstitialVisible) {
      console.log('🔄 Refreshing ads on page transition...')
      window.googletag.cmd.push(() => {
        window.googletag.pubads().refresh()
      })
    }
  }, [])

  // Refresh ads when page changes (triggered by parent)
  useEffect(() => {
    if (shouldRefresh > 0 && window.googletag) {
      window.googletag.cmd.push(() => {
        window.googletag.pubads().refresh()
      })
    }
  }, [shouldRefresh])

  const handleInterstitialLoad = () => {
    setInterstitialVisible(true)
    
    // Pause ad refresh when interstitial is visible
    if (window.googletag) {
      window.googletag.cmd.push(() => {
        // Don't refresh ads while interstitial is showing
      })
    }
  }

  const handleInterstitialClose = () => {
    setInterstitialVisible(false)
    
    // Resume ad refresh after interstitial closes
    if (window.googletag) {
      window.googletag.cmd.push(() => {
        window.googletag.pubads().refresh()
      })
    }
  }

  return (
    <>
      {showTopBanner && !topBannerInsideNavbar && (
        <TopBannerAd 
          isFixed={topBannerFixed} 
          insideNavbar={false}
        />
      )}
      
      {showBottomBanner && <BottomBannerAd />}
      
      {showSidebars && (
        <>
          <SidebarAd position="left" />
          <SidebarAd position="right" />
        </>
      )}
      
      {showInterstitial && (
        <InterstitialAd
          onAdLoad={handleInterstitialLoad}
          onAdClose={handleInterstitialClose}
        />
      )}
      
      {children}
    </>
  )
}
