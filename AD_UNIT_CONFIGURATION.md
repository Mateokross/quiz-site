# Ad Unit Configuration Guide

## Overview

This guide explains how to configure Google Ad Manager ad units for the quiz site. The current implementation uses placeholder ad unit paths that need to be replaced with your actual Google Ad Manager configuration

## Current Placeholder Configuration

The app is currently configured to use **GPT documentation sample/test inventory** (safe for local/dev testing), via `src/config/adUnits.js`:

- `TOP_BANNER`: `/6355419/Travel/Asia`
- `BOTTOM_BANNER`: `/6355419/Travel/Europe/France/Paris`
- `SIDEBAR_LEFT`: `/6355419/Travel`
- `SIDEBAR_RIGHT`: `/6355419/Travel`
- `INTERSTITIAL`: `/6355419/Travel`

For production, replace these with ad unit paths from **your** Google Ad Manager network.

## Required Ad Units

You need to create the following ad units in Google Ad Manager:

### 1. Top Banner Ad Unit
- **Component**: `src/components/ads/TopBannerAd.jsx`
- **Current Path**: `/6355419/Travel/Asia` (GPT sample/test inventory)
- **Suggested Path**: `/YOUR_NETWORK_CODE/quizzs/top-banner`
- **Sizes**: 728x90, 300x50, 468x60, 320x100, 320x50, 300x100, 234x60

### 2. Bottom Banner Ad Unit
- **Component**: `src/components/ads/BottomBannerAd.jsx`
- **Current Path**: `/6355419/Travel/Europe/France/Paris` (GPT sample/test inventory)
- **Suggested Path**: `/YOUR_NETWORK_CODE/quizzs/bottom-banner`
- **Sizes**: 728x90, 970x90, 300x50, 468x60, 320x100, 320x50, 300x100, 234x60

### 3. Sidebar Left Ad Unit
- **Component**: `src/components/ads/SidebarAd.jsx` (position="left")
- **Current Path**: `/6355419/Travel` (GPT sample/test inventory)
- **Suggested Path**: `/YOUR_NETWORK_CODE/quizzs/sidebar-left`
- **Sizes**: 160x600, 120x600, 300x600

### 4. Sidebar Right Ad Unit
- **Component**: `src/components/ads/SidebarAd.jsx` (position="right")
- **Current Path**: `/6355419/Travel` (GPT sample/test inventory)
- **Suggested Path**: `/YOUR_NETWORK_CODE/quizzs/sidebar-right`
- **Sizes**: 160x600, 120x600, 300x600

### 5. Interstitial Ad Unit
- **Component**: `src/components/ads/InterstitialAd.jsx`
- **Current Path**: `/6355419/Travel` (GPT sample/test inventory)
- **Suggested Path**: `/YOUR_NETWORK_CODE/quizzs/interstitial`
- **Sizes**: 480x320, 320x480, 336x280, 300x250

## How to Update Ad Unit Paths

### Option 1: Update Each Component Individually

Edit each ad component file and update the `adUnitPath` prop in the `AdContainer` component:

**Example for TopBannerAd.jsx:**
```jsx
<AdContainer
  divId="top-banner-ad"
  adUnitPath="/YOUR_NETWORK_CODE/quizzs/top-banner"  // Update this line
  sizes={optimalSizes}
  // ... other props
/>
```

### Option 2: Create a Centralized Configuration File

Create a new file `src/config/adUnits.js`:

```javascript
export const AD_UNIT_PATHS = {
  TOP_BANNER: '/YOUR_NETWORK_CODE/quizzs/top-banner',
  BOTTOM_BANNER: '/YOUR_NETWORK_CODE/quizzs/bottom-banner',
  SIDEBAR_LEFT: '/YOUR_NETWORK_CODE/quizzs/sidebar-left',
  SIDEBAR_RIGHT: '/YOUR_NETWORK_CODE/quizzs/sidebar-right',
  INTERSTITIAL: '/YOUR_NETWORK_CODE/quizzs/interstitial',
}
```

Then import and use in each component:
```jsx
import { AD_UNIT_PATHS } from '../../config/adUnits'

// In component:
<AdContainer
  divId="top-banner-ad"
  adUnitPath={AD_UNIT_PATHS.TOP_BANNER}
  sizes={optimalSizes}
/>
```

## Google Ad Manager Setup Steps

### Step 1: Get Your Network Code
1. Log in to Google Ad Manager
2. Navigate to Admin → Global Settings
3. Find your Network Code (format: 8-10 digits)

### Step 2: Create Ad Units
For each ad unit listed above:

1. Go to Inventory → Ad Units
2. Click "New Ad Unit"
3. Enter the ad unit name (e.g., "top-banner")
4. Add all supported sizes for that ad unit
5. Set targeting if needed
6. Save the ad unit

### Step 3: Create Line Items and Creatives
1. Go to Delivery → Line Items
2. Create line items for each ad unit
3. Set targeting to match your ad units
4. Upload or link creatives
5. Set priority and pricing

### Step 4: Test with Google Publisher Console
1. Deploy your site with the updated ad unit paths
2. Open the site in a browser
3. Open browser console and run: `googletag.openConsole()`
4. Verify that ads are being requested correctly
5. Check for any errors or warnings

## Testing with Test Ads

Before going live, you can test with Google's test ad units:

```javascript
// Test ad unit path
const TEST_AD_UNIT = '/6355419/Travel/Europe/France/Paris'

// Use this in your components during development
```

## Environment-Based Configuration

Consider using environment variables for different deployments:

```javascript
// src/config/adUnits.js
const isDev = import.meta.env.DEV

export const AD_UNIT_PATHS = {
  TOP_BANNER: isDev 
    ? '/6355419/Travel/Europe/France/Paris' // Test ad unit
    : '/YOUR_NETWORK_CODE/quizzs/top-banner', // Production ad unit
  // ... other ad units
}
```

## Verification Checklist

Before deploying to production:

- [ ] Network code is correct
- [ ] All 5 ad units are created in Google Ad Manager
- [ ] All ad unit paths are updated in the code
- [ ] Line items are created and active
- [ ] Creatives are uploaded and approved
- [ ] Test ads are displaying correctly
- [ ] No GPT console errors
- [ ] Ads refresh correctly every 60 seconds
- [ ] Interstitial timing works (30s initial, 2min recurring)
- [ ] Ads hide when no fill
- [ ] Responsive sizing works on all screen sizes

## Troubleshooting

### No Ads Showing
- Check GPT console for errors: `googletag.openConsole()`
- Verify ad unit paths are correct
- Ensure line items are active and have inventory
- Check targeting settings

### Ads Not Refreshing
- Check browser console for JavaScript errors
- Verify the refresh interval is working (60 seconds)
- Ensure interstitial isn't blocking refresh

### Layout Issues
- Verify ad container sizing
- Check for CSS conflicts
- Test on different screen sizes

## Additional Resources

- [Google Publisher Tag Documentation](https://developers.google.com/publisher-tag/guides/get-started)
- [Google Ad Manager Help Center](https://support.google.com/admanager)
- [GPT Reference](https://developers.google.com/publisher-tag/reference)
