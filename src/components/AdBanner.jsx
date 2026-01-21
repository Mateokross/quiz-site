import { useEffect, useRef } from 'react'

export default function AdBanner() {
  const adRef = useRef(null)

  useEffect(() => {
    // Ensure googletag is available and display the ad
    if (window.googletag && adRef.current) {
      window.googletag.cmd.push(function() {
        window.googletag.display('top-banner-ad')
      })
    }
  }, [])

  return (
    <div className="sticky top-0 z-20 w-full flex justify-center py-2 bg-white border-b border-gray-200">
      <div
        id="top-banner-ad"
        ref={adRef}
        style={{
          width: '728px',
          height: '90px',
          minHeight: '90px',
        }}
      />
    </div>
  )
}
