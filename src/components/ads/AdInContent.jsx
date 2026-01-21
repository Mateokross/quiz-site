import AdSlot from './AdSlot'
import { useAdManager } from '../../hooks/useAdManager'

/**
 * In-content ad component (between questions)
 * Desktop: 728x90 primary, 300x250 fallback
 * Mobile: 320x50
 */
export default function AdInContent({ index }) {
  const { isMobile } = useAdManager()

  // Desktop: 728x90 primary, 300x250 fallback
  // Mobile: 320x50
  const desktopSizes = [[728, 90], [300, 250]]
  const mobileSizes = [[320, 50]]
  const sizes = isMobile ? mobileSizes : desktopSizes

  // Use index to create unique slot IDs for each in-content ad
  const slotId = `ad-in-content-${index}`

  return (
    <div className="w-full flex justify-center">
      <AdSlot
        slotId={slotId}
        sizes={sizes}
        hideOnNoFill={false}
        autoRefresh={true}
        className="flex justify-center"
      />
    </div>
  )
}
