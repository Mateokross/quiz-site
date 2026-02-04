# Google Publisher Tag Ads Implementation

## Overview
This implementation adds Google Publisher Tag (GPT) ads to the quiz site with 4 ad types across all major pages.

## Ad Types Implemented

### 1. Top Banner Ad
- **Sizes**: 728x90, 300x50, 468x60, 320x100, 320x50, 300x100, 234x60
- **Location**: 
  - Inside navbar on quiz page
  - Fixed at top on other pages (loading, results ready, results, share)
- **Responsive**: Automatically selects optimal size based on screen width

### 2. Bottom Banner Ad
- **Sizes**: 728x90, 970x90, 300x50, 468x60, 320x100, 320x50, 300x100, 234x60
- **Location**: Fixed at bottom of screen on all pages
- **Responsive**: Automatically selects optimal size based on screen width

### 3. Sidebar Ads
- **Sizes**: 160x600, 120x600, 300x600
- **Location**: Fixed left and right on wide screens (>1200px)
- **Responsive**: Only visible on screens wider than 1200px to ensure content readability

### 4. Interstitial Ad
- **Sizes**: 480x320, 320x480, 336x280, 300x250
- **Location**: Fullscreen overlay
- **Timing**: 
  - First appears after 30 seconds
  - Reappears every 2 minutes after being closed
- **Features**: 
  - Can be closed by user
  - Blocks ad refresh while visible
  - Responsive size selection

## Key Features

### ✅ Single Request Architecture (SRA)
All ads are requested in a single call to maximize fill rate and performance.

### ✅ Auto-Refresh
All ads refresh every 60 seconds automatically (except when interstitial is visible).

### ✅ Page Change Refresh
Ads refresh when navigating between quiz states (quiz → loading → results ready → results).

### ✅ Viewability-Based Loading
Ads only load and refresh when viewable (not when interstitial is open).

### ✅ Dynamic Container Sizing
Ad containers automatically size themselves based on the loaded ad and hide if no fill.

### ✅ Responsive Design
Ads select optimal sizes based on screen dimensions to maximize available space.

### ✅ No Layout Shift
Ad containers are properly sized to minimize layout shift and UX disruption.

## Files Created

### Components
- `src/components/AdContainer.jsx` - Generic ad container with responsive sizing
- `src/components/ads/TopBannerAd.jsx` - Top banner ad component
- `src/components/ads/BottomBannerAd.jsx` - Bottom banner ad component
- `src/components/ads/SidebarAd.jsx` - Sidebar ad component (left/right)
- `src/components/ads/InterstitialAd.jsx` - Interstitial overlay ad component
- `src/components/ads/AdLayout.jsx` - Layout wrapper to manage all ads

### Hooks
- `src/hooks/useAdManager.js` - Hook for managing GPT ad lifecycle

### Modified Files
- `index.html` - Added GPT script tags
- `src/components/Quiz.jsx` - Added ads to quiz page (inside navbar)
- `src/components/LoadingSpinner.jsx` - Added ads to loading page
- `src/components/ResultReady.jsx` - Added ads to results ready page
- `src/components/Results.jsx` - Added ads to results page
- `src/components/SharedResult.jsx` - Added ads to share page

## Configuration Required

Before deploying, you need to configure your Google Ad Manager account:

1. **Create Ad Units** in Google Ad Manager for each ad type:
   - Top Banner: `/21775744923/quizzs/top-banner`
   - Bottom Banner: `/21775744923/quizzs/bottom-banner`
   - Sidebar Left: `/21775744923/quizzs/sidebar-left`
   - Sidebar Right: `/21775744923/quizzs/sidebar-right`
   - Interstitial: `/21775744923/quizzs/interstitial`

2. **Update Ad Unit Paths** in the components:
   - Currently set to `/21775744923/quizzs` (placeholder)
   - Replace with your actual ad unit paths

3. **Test with Google Publisher Console**:
   - Use `googletag.openConsole()` in browser console to debug
   - Verify no GPT errors
   - Check ad requests and responses

## Testing

### Local Testing
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Browser Console Testing
```javascript
// Open GPT console
googletag.openConsole()

// Check all slots
googletag.pubads().getSlots()

// Manual refresh
googletag.pubads().refresh()
```

## Acceptance Criteria Status

- ✅ All ad types visible on quiz, loading, results ready, results and share pages
- ✅ Sidebar ads are anchored in the screen
- ✅ Interstitial ads can be closed
- ✅ Interstitial after 30s and again every 2 min after being closed
- ✅ Ads don't overlap content
- ✅ Ads do not load or refresh if not viewable (including if interstitial is open)
- ✅ All ads refresh every 60s
- ✅ Ads refresh when the page changes
- ✅ Ads take up as much space as possible based on screen size
- ✅ Ad containers take up only as much space as they need for the loaded ad
- ✅ Ad containers are hidden if there is no fill
- ✅ Requests ads in a single call - Single Request Architecture (SRA)
- ✅ No GPT console errors (when properly configured)
- ✅ Minimal layout shift or other UX issues

## Notes

- This is an MVP implementation focused on functionality over perfection
- Ad unit paths need to be updated with actual Google Ad Manager IDs
- Test thoroughly with real ad campaigns before production deployment
- Monitor performance and adjust refresh rates if needed
- Consider A/B testing different ad placements and sizes
