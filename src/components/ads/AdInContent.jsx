import AdSlot from './AdSlot'
import { AD_SIZES } from '../../constants/adConfig'
import { useLazyAd } from '../../hooks/useLazyAd'

/**
 * In-content ad component (between questions)
 * Desktop: 728x90 primary, 300x250 fallback
 * Mobile: 320x50
 * Uses lazy loading to defer loading until near viewport
 */
export default function AdInContent({ index }) {
  const { containerRef, shouldLoad } = useLazyAd({ rootMargin: '100px' })

  const sizes = AD_SIZES.IN_CONTENT

  // Use index to create unique slot IDs for each in-content ad
  const slotId = `ad-in-content-${index}`

  return (
    <div ref={containerRef} className="w-full flex justify-center">
      {shouldLoad && (
        <AdSlot
          slotId={slotId}
          sizes={sizes}
          hideOnNoFill={false}
          autoRefresh={true}
          className="flex justify-center"
        />
      )}
    </div>
  )
}
