# Big Starz App - Components Manifest

## Consolidation Summary
- **Before:** 69 components (bloated, many duplicates)
- **After:** 57 components (removed 12 duplicates)
- **Target:** 30 core components (ongoing consolidation)

## Core Components (Keep)

### Navigation & Layout
- `top-navigation.tsx` - Main header with language selector
- `screen-container.tsx` - SafeArea wrapper for all screens
- `themed-view.tsx` - Theme-aware view wrapper

### Authentication & User
- `creator-onboarding.tsx` - Onboarding flow
- `email-verification.tsx` - Email verification
- `creator-verification-modal.tsx` - Creator verification

### Video & Media
- `video-player-modal.tsx` - Unified video player (was: video-player.tsx + video-player-modal.tsx)
- `camera-recorder.tsx` - Camera recording
- `video-upload.tsx` - Video upload
- `video-preview-loop.tsx` - Video preview

### Social & Sharing
- `social-share-modal.tsx` - Share to social platforms
- `social-export.tsx` - Export content
- `direct-messaging.tsx` - DM system
- `creator-message-modal.tsx` - Creator messages

### Features
- `duets-stitches.tsx` - Duets/stitches (was: duets-stitches.tsx + duets-stitches-feature.tsx)
- `livestream-studio.tsx` - Livestream (was: livestream-studio.tsx + livestream-studio-feature.tsx)
- `trending-sounds-library.tsx` - Trending sounds (was: trending-sounds-library.tsx + trending-sounds-feature.tsx)
- `trending-hashtags.tsx` - Trending hashtags
- `search-discovery.tsx` - Search & discovery
- `booking-calendar.tsx` - Booking calendar

### Monetization & Payments
- `subscription-management.tsx` - Subscriptions (was: paywall.tsx + paywall-modal.tsx + tier-paywall.tsx + subscription-paywall.tsx)
- `stripe-payment.tsx` - Stripe integration
- `payment-processing.tsx` - Payment processing
- `creator-payout-system.tsx` - Payout system
- `token-balance.tsx` - Token display

### Analytics & Admin
- `analytics-dashboard.tsx` - Analytics (was: analytics-dashboard.tsx + analytics-dashboard-advanced.tsx)
- `admin-dashboard.tsx` - Admin panel

### Notifications
- `notifications-center.tsx` - Notifications (was: notifications-center.tsx + notifications-demo.tsx)
- `enhanced-notifications.tsx` - Enhanced notifications
- `notification-toast.tsx` - Toast notifications

### UI Components
- `ui/icon-symbol.tsx` - Icon mapping
- `ui/collapsible.tsx` - Collapsible component
- `haptic-tab.tsx` - Tab with haptics
- `neon-button.tsx` - Neon button style
- `follow-button.tsx` - Follow button

### Utilities & Helpers
- `ai-generation-overlay.tsx` - AI generation UI
- `big-starz-background.tsx` - Background component
- `glassmorphism-bg.tsx` - Glassmorphism effect
- `parallax-scroll-view.tsx` - Parallax scrolling
- `hello-wave.tsx` - Wave animation
- `external-link.tsx` - External link handler
- `content-moderation.tsx` - Content moderation
- `content-download.tsx` - Download content
- `onboarding-tutorial.tsx` - Tutorial
- `settings-preferences.tsx` - Settings
- `rewards-system.tsx` - Rewards
- `sound-library-modal.tsx` - Sound library
- `voice-clone-recorder.tsx` - Voice cloning
- `custom-song-upload.tsx` - Custom song upload
- `face-clone-with-countdown.tsx` - Face cloning
- `watermarked-video-card.tsx` - Watermarked videos
- `gender-toggle.tsx` - Gender selection

## Removed Components (Duplicates)
- ❌ `bottom-nav.tsx` → Replaced by tab bar in `_layout.tsx`
- ❌ `big-starz-bottom-nav.tsx` → Replaced by tab bar in `_layout.tsx`
- ❌ `analytics-dashboard-advanced.tsx` → Merged into `analytics-dashboard.tsx`
- ❌ `duets-stitches-feature.tsx` → Merged into `duets-stitches.tsx`
- ❌ `livestream-studio-feature.tsx` → Merged into `livestream-studio.tsx`
- ❌ `trending-sounds-feature.tsx` → Merged into `trending-sounds-library.tsx`
- ❌ `paywall-modal.tsx` → Merged into `subscription-management.tsx`
- ❌ `tier-paywall.tsx` → Merged into `subscription-management.tsx`
- ❌ `notifications-demo.tsx` → Merged into `notifications-center.tsx`
- ❌ `big-starz-header.tsx` → Replaced by `top-navigation.tsx`
- ❌ `global-header.tsx` → Replaced by `top-navigation.tsx`
- ❌ `video-player.tsx` → Merged into `video-player-modal.tsx`

## Next Steps
1. Update all imports to use consolidated components
2. Remove unused component references
3. Test all screens for functionality
4. Implement Step 3: Video Filters
5. Implement Step 4: Collaboration
6. Implement Step 5: Marketplace
