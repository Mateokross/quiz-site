# Ads Implementation Documentation

This document provides a comprehensive overview of the Google Publisher Tag (GPT) ads implementation in the quiz site.

## Table of Contents

1. [File Organization](#file-organization)
2. [Architecture Overview](#architecture-overview)
3. [Ad Loading Flow](#ad-loading-flow)
4. [Component Structure](#component-structure)
5. [Best Practices](#best-practices)
6. [Configuration](#configuration)
7. [Ad Placements](#ad-placements)
8. [Performance Optimizations](#performance-optimizations)

## File Organization

The ads implementation is organized into several directories:

```
src/
├── components/
│   └── ads/
│       ├── AdSlot.jsx          # Base ad slot component
│       ├── AdTopBanner.jsx     # Top banner wrapper
│       ├── AdBottomBanner.jsx  # Bottom banner wrapper
│       ├── AdSidebar.jsx       # Sidebar wrapper (left/right)
│       ├── AdInContent.jsx     # In-content ad wrapper
│       └── AdInterstitial.jsx  # Fullscreen interstitial ad wrapper
├── hooks/
│   ├── useAdManager.js         # Central ad management hook
│   ├── useSidebarVisibility.js # Sidebar visibility detection
│   ├── useLazyAd.js            # Lazy loading for in-content ads
│   └── useInterstitialAd.js    # Interstitial ad timing and display logic
├── constants/
│   └── adConfig.js             # Ad configuration constants
└── utils/
    └── adHelpers.js             # Ad utility functions

index.html                          # GPT initialization and slot definitions
```

### Key Files Explained

- **`index.html`**: Initializes GPT library, enables best practices (SRA, collapseEmptyDivs), and pre-defines ad slots
- **`src/constants/adConfig.js`**: Centralized configuration for ad sizes, breakpoints, and settings
- **`src/hooks/useAdManager.js`**: Core hook managing slot registration, refresh, and viewability
- **`src/components/ads/AdSlot.jsx`**: Base component that handles GPT integration, display, and no-fill detection
- **`src/utils/adHelpers.js`**: Utility functions for size calculations and viewability checks

## Architecture Overview

The ads system follows a layered architecture:

```
┌─────────────────────────────────────────┐
│         Page Components                 │
│  (Quiz, Results, Loading, etc.)        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Ad Wrapper Components              │
│  (AdTopBanner, AdSidebar, etc.)        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         AdSlot Component                │
│    (Base GPT Integration)               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        useAdManager Hook                │
│  (Slot Management & Refresh Logic)      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Google Publisher Tag (GPT)        │
│         (External Library)               │
└─────────────────────────────────────────┘
```

### Design Principles

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Centralized Configuration**: All ad settings in one place (`adConfig.js`)
3. **Reusability**: Base `AdSlot` component used by all ad types
4. **Performance**: Lazy loading, viewability checks, and efficient refresh logic
5. **Responsive Design**: Mobile/desktop detection and appropriate ad sizes

## Ad Loading Flow

### 1. Initialization (index.html)

When the page loads, GPT is initialized:

```javascript
// 1. Preload GPT script for faster loading
<link rel="preload" href="https://securepubads.g.doubleclick.net/tag/js/gpt.js" ... />

// 2. Load GPT script asynchronously
<script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" ... />

// 3. Initialize GPT with best practices
googletag.pubads().enableSingleRequest();  // Bundle requests
googletag.pubads().collapseEmptyDivs(true); // Auto-collapse empty divs

// 4. Pre-define slots (optional, can also be defined dynamically)
googletag.defineSlot(adUnitPath, sizes, slotId).addService(googletag.pubads());
```

### 2. Component Mount (React)

When an ad component mounts:

```
AdWrapper Component (e.g., AdTopBanner)
    ↓
Renders AdSlot with slotId and sizes
    ↓
AdSlot useEffect runs:
    1. Checks shouldLoad prop
    2. Registers slot via useAdManager.registerSlot()
    3. Displays slot via useAdManager.displaySlot()
    4. Sets up auto-refresh via useAdManager.setupRefresh()
    5. Adds slotRenderEnded event listener
    ↓
GPT renders ad into the div with id=slotId
    ↓
slotRenderEnded event fires
    ↓
AdSlot handles event:
    - Updates visibility state
    - Calls onSlotRender callback
    - Hides container if no fill (if hideOnNoFill=true)
```

### 3. Slot Registration Flow

```javascript
registerSlot(slotId, sizes, adUnitPath)
    ↓
1. Store sizes in sizesRef for viewability checks
    ↓
2. Check if slot exists in cache (slotsRef)
    ↓
3. If not cached:
   a. Check if slot was pre-defined in index.html
   b. If not found, define new slot
   c. Add service to pubads()
   d. Cache slot in slotsRef
    ↓
4. Return slot object
```

### 4. Refresh Flow

```javascript
Auto-refresh (every 60 seconds):
    ↓
refreshSlot(slotId)
    ↓
1. Get slot from cache or find in GPT slots
    ↓
2. Check viewability:
   - Get element by slotId
   - Get sizes (from cache or defaults)
   - Calculate fallback dimensions
   - Check if element is in viewport
    ↓
3. If viewable:
   - Call googletag.pubads().refresh([slot])
    ↓
4. GPT fetches new ad and renders
```

## Component Structure

### AdSlot (Base Component)

The foundation component that all ad types use:

**Props:**
- `slotId` (string, required): Unique identifier for the ad slot
- `sizes` (array, required): Array of [width, height] pairs
- `adUnitPath` (string, optional): Ad unit path (defaults to AD_UNIT_PATH)
- `hideOnNoFill` (boolean): Hide container when no ad fills
- `autoRefresh` (boolean): Enable automatic refresh
- `refreshInterval` (number): Refresh interval in ms (default: 60000)
- `onSlotRender` (function): Callback when ad renders
- `useMaxSize` (boolean): Use max size for container dimensions
- `shouldLoad` (boolean): Conditionally load ad (for lazy loading)

**Key Features:**
- Handles GPT slot registration and display
- Manages visibility state based on ad fill
- Sets up and cleans up refresh intervals
- Listens to `slotRenderEnded` events
- Calculates container dimensions based on ad sizes

### Ad Wrapper Components

Each wrapper component provides specific styling and behavior:

#### AdTopBanner
- **Location**: Top of page, inside navbar (quiz) or fixed (other pages)
- **Sizes**: Desktop: 728x90, 320x50 | Mobile: 320x100, 320x50
- **Features**: Dynamic height adjustment, hides on no fill

#### AdBottomBanner
- **Location**: Fixed at bottom of screen
- **Sizes**: Desktop: 728x90, 320x50 | Mobile: 320x50
- **Features**: Fixed positioning, dynamic container sizing

#### AdSidebar
- **Location**: Fixed left/right sidebars
- **Sizes**: 300x250, 160x600
- **Features**: Conditional loading based on viewport width, edge-aligned to prevent shifting
- **Visibility**: Only loads when viewport >= 1280px and has sufficient space

#### AdInContent
- **Location**: Between quiz questions
- **Sizes**: Desktop: 728x90, 300x250 | Mobile: 320x50
- **Features**: Lazy loading using Intersection Observer

#### AdInterstitial
- **Location**: Fullscreen overlay on all pages
- **Sizes**: 320x480, 300x250, 728x90
- **Features**: 
  - Dismissible with close button
  - Appears 30 seconds after page load
  - Refreshes every 2 minutes after being closed (timer continues from close time)
  - Pauses timer when tab is hidden
  - Only renders when tab is visible (uses Page Visibility API)
  - Hides container on no fill

## Best Practices

### 1. GPT Best Practices Implemented

#### Single Request Architecture (SRA)
```javascript
googletag.pubads().enableSingleRequest();
```
- Bundles multiple ad requests into a single HTTP request
- Reduces latency and improves page load performance

#### Collapse Empty Divs
```javascript
googletag.pubads().collapseEmptyDivs(true);
```
- Automatically collapses ad containers when no ad fills
- Prevents empty space from affecting layout

#### Preload GPT Script
```html
<link rel="preload" href="https://securepubads.g.doubleclick.net/tag/js/gpt.js" as="script" crossorigin="anonymous" />
```
- Starts downloading GPT script earlier
- Improves initial page load time

### 2. Refresh Best Practices

#### Minimum Refresh Interval
- Refresh interval set to 60 seconds (meets GPT minimum of 30 seconds)
- Prevents excessive ad requests

#### Viewability-Based Refresh
- Only refreshes ads that are currently viewable
- Avoids wasting requests on off-screen ads
- Uses fallback size calculation for elements not yet rendered

#### Conditional Loading
- Sidebar ads only load when viewport is wide enough
- In-content ads use lazy loading (Intersection Observer)
- Prevents unnecessary ad requests

### 3. Performance Optimizations

#### Memoization
- All hook functions wrapped in `useCallback`
- Prevents unnecessary re-renders
- Event handlers memoized to prevent memory leaks

#### Lazy Loading
- In-content ads load only when near viewport
- Uses Intersection Observer API
- Configurable rootMargin and threshold

#### Efficient Viewability Checks
- Caches slot sizes to avoid repeated calculations
- Uses fallback sizes for elements not yet rendered
- Checks element dimensions before refresh

### 4. Code Organization

#### Centralized Configuration
- All ad sizes, breakpoints, and settings in `adConfig.js`
- Easy to update without touching multiple files
- Single source of truth

#### Reusable Components
- Base `AdSlot` component handles all GPT logic
- Wrapper components provide specific styling/behavior
- DRY principle followed throughout

#### Helper Functions
- `calculateMaxDimensions`: Calculates max width/height from sizes
- `isElementViewable`: Checks if element is in viewport
- `getDefaultSizesForSlot`: Provides fallback sizes for pre-defined slots

## Configuration

### Ad Sizes

Defined in `src/constants/adConfig.js`:

```javascript
AD_SIZES = {
  TOP_BANNER: {
    desktop: [[728, 90], [320, 50]],
    mobile: [[320, 100], [320, 50]],
  },
  BOTTOM_BANNER: {
    desktop: [[728, 90], [320, 50]],
    mobile: [[320, 50]],
  },
  SIDEBAR: [[300, 250], [160, 600]],
  IN_CONTENT: {
    desktop: [[728, 90], [300, 250]],
    mobile: [[320, 50]],
  },
  INTERSTITIAL: [[320, 480], [300, 250], [728, 90]],
}
```

### Breakpoints

```javascript
AD_BREAKPOINTS = {
  MOBILE: 768,  // Tailwind md breakpoint
  XL: 1280,    // Tailwind xl breakpoint - when sidebars appear
}
```

### Configuration Values

```javascript
AD_CONFIG = {
  REFRESH_INTERVAL: 60000,        // 60 seconds
  NAVBAR_CONTENT_HEIGHT: 73,      // Navbar height without ad
  CONTENT_MIN_WIDTH_XL: 680,      // Min content width at xl
  SIDEBAR_WIDTH: 300,             // Sidebar ad width
  INTERSTITIAL_INITIAL_DELAY: 30000,  // 30 seconds
  INTERSTITIAL_REFRESH_INTERVAL: 120000, // 2 minutes
}
```

## Ad Placements

### Quiz Page

**Desktop:**
- Top banner: Above navbar (728x90 primary, 320x50 fallback)
- Bottom banner: Fixed at bottom (728x90 primary, 320x50 fallback)
- Left/Right sidebars: Fixed, follow scroll (300x250 primary, 160x600 fallback)
- In-content: Between questions (728x90 primary, 300x250 fallback)

**Mobile:**
- Top banner: Above navbar (320x100 primary, 320x50 fallback)
- Bottom banner: Fixed at bottom (320x50)
- In-content: Between questions (320x50)
- No sidebars

### Results/Loading/Share Pages

**Desktop & Mobile:**
- Top banner: Fixed at top (728x90 primary, 320x50 fallback)
- Left/Right sidebars: Fixed (300x250 primary, 160x600 fallback)
- Interstitial: Fullscreen overlay (320x480, 300x250, 728x90)
- No bottom banner or in-content ads

### All Pages

**Interstitial Ad:**
- Fullscreen overlay on all pages
- Appears 30 seconds after page load
- Refreshes every 2 minutes after being closed
- Timer pauses when loading screen is visible
- Timer pauses when tab is hidden
- Only renders when tab is visible

## Performance Optimizations

### 1. Viewability Checks

Before refreshing ads, the system checks if they're viewable:

```javascript
isSlotViewable(slot) {
  1. Get element by slotId
  2. If element has dimensions: check actual viewport intersection
  3. If element has no dimensions: use fallback size to check potential visibility
  4. Return true only if element is in viewport
}
```

This prevents refreshing ads that aren't visible, saving bandwidth and improving performance.

### 2. Size Caching

Slot sizes are cached in `sizesRef` to avoid:
- Repeated calculations
- Re-fetching from GPT slots
- Redundant size lookups during refresh

### 3. Slot Caching

GPT slot objects are cached in `slotsRef` to:
- Avoid repeated `getSlots()` calls
- Improve refresh performance
- Reduce GPT API calls

### 4. Conditional Rendering

- Sidebar ads only render when viewport is wide enough
- In-content ads use lazy loading
- No-fill ads hide their containers (when `hideOnNoFill=true`)

### 5. Event Listener Management

- Event listeners are properly added and removed
- Prevents memory leaks
- Handlers are memoized to prevent unnecessary re-attachments

## Common Patterns

### Adding a New Ad Placement

1. **Define sizes in `adConfig.js`** (if new type):
```javascript
AD_SIZES.NEW_PLACEMENT = {
  desktop: [[728, 90], [320, 50]],
  mobile: [[320, 50]],
}
```

2. **Create wrapper component** (if needed):
```javascript
export default function AdNewPlacement() {
  const { isMobile } = useAdManager()
  const sizes = isMobile ? AD_SIZES.NEW_PLACEMENT.mobile : AD_SIZES.NEW_PLACEMENT.desktop
  
  return (
    <AdSlot
      slotId="ad-new-placement"
      sizes={sizes}
      hideOnNoFill={true}
      autoRefresh={true}
    />
  )
}
```

3. **Use in page component**:
```javascript
import AdNewPlacement from './ads/AdNewPlacement'

// In component JSX:
<AdNewPlacement />
```

### Customizing Ad Behavior

**Hide on no fill:**
```javascript
<AdSlot hideOnNoFill={true} />
```

**Disable auto-refresh:**
```javascript
<AdSlot autoRefresh={false} />
```

**Custom refresh interval:**
```javascript
<AdSlot refreshInterval={120000} /> // 2 minutes
```

**Lazy loading:**
```javascript
const { containerRef, shouldLoad } = useLazyAd({ rootMargin: '200px' })
<AdSlot shouldLoad={shouldLoad} />
```

**Custom callback:**
```javascript
<AdSlot
  onSlotRender={(event) => {
    if (!event.isEmpty) {
      console.log('Ad rendered:', event.size)
    }
  }}
/>
```

## Troubleshooting

### Ads Not Showing

1. **Check GPT initialization**: Ensure `index.html` loads GPT script
2. **Check slot registration**: Verify slotId matches between definition and component
3. **Check viewability**: Ads might be off-screen or have zero dimensions
4. **Check console**: Look for GPT errors or warnings
5. **Check shouldLoad**: Ensure conditional loading isn't preventing render

### Ads Shifting Layout

1. **Container sizing**: Ensure container has proper dimensions
2. **Alignment**: Check alignment classes (left/right/center)
3. **Max size**: Consider using `useMaxSize={true}` for consistent sizing

### Refresh Not Working

1. **Viewability check**: Ads might not be considered viewable
2. **Interval setup**: Verify `autoRefresh={true}` and refresh interval
3. **Slot caching**: Check if slot is properly cached

## Interstitial Ad Implementation

### Timing Behavior

The interstitial ad follows a specific timing pattern:

1. **Initial Display**: Appears 30 seconds after page load (only if tab is visible)
2. **After Close**: Timer starts 2-minute countdown from close time (NOT reset to page load)
3. **Pause Conditions**: Timer pauses when tab becomes hidden (Page Visibility API)
4. **Resume**: Timer resumes from where it paused when tab becomes visible
5. **Display**: Ad only displays when tab is visible AND timer has elapsed

### Timer Continuation Logic

The timer does NOT reset when the ad is closed. Instead:
- First show: 30 seconds from page load
- After close: 2 minutes from close timestamp
- Timer accumulates elapsed time, accounting for pauses
- Remaining time is calculated and stored when paused
- Timer resumes with remaining time when conditions allow

### Page Visibility Integration

Uses the Page Visibility API to ensure ads only render when visible:
- Listens to `visibilitychange` events
- Pauses timer when `document.hidden === true`
- Resumes timer when tab becomes visible
- Hides ad immediately if tab becomes hidden while ad is showing

### Component Usage

```javascript
// Simple usage - no props needed
<AdInterstitial />
```

## Future Improvements

Potential enhancements:

1. **Ad Blocking Detection**: Detect ad blockers and show fallback content
2. **A/B Testing**: Support for testing different ad configurations
3. **Analytics Integration**: Track ad performance metrics
4. **Dynamic Sizing**: More sophisticated container sizing based on actual ad dimensions
5. **Sticky Ads**: Enhanced sticky behavior for better viewability
6. **Interstitial Customization**: Configurable initial delay and refresh intervals per page

## References

- [Google Publisher Tag Documentation](https://developers.google.com/publisher-tag)
- [GPT Best Practices](https://developers.google.com/publisher-tag/guides/gpt-best-practices)
- [GPT API Reference](https://developers.google.com/publisher-tag/reference)
