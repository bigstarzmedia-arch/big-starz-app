# Big Starz App - Comprehensive Test Plan

## Test Checklist

### 1. VIBE FEED (Home Screen)
- [ ] Videos load and play automatically
- [ ] Swipe up/down to navigate between videos
- [ ] Like button works (heart icon toggles)
- [ ] Comment button opens comment modal
- [ ] Share button triggers share sheet
- [ ] Creator info displays correctly (name, badge)
- [ ] Video title and description visible
- [ ] No crashes on rapid swiping
- [ ] Video loops when reaching end
- [ ] Pause/play controls work

### 2. CREATE SCREEN (AI Studio)
- [ ] Music Video card displays
  - [ ] Text input accepts prompt
  - [ ] Style selector buttons work (Cinematic, Anime, Neon, Fashion)
  - [ ] Generate button triggers API call
  - [ ] Progress bar shows generation status
  - [ ] Error handling for quota exceeded
- [ ] AI Cameo card displays
  - [ ] Camera/Gallery picker opens
  - [ ] Prompt input works
  - [ ] Style selector works
  - [ ] Generate button works
- [ ] AI Image card displays
  - [ ] Text input works
  - [ ] Style selector works
  - [ ] Generate button works
- [ ] Quota display shows remaining credits
- [ ] Paywall modal appears when quota exceeded

### 3. CHAT SCREEN
- [ ] Conversation list displays
- [ ] Tap conversation opens message thread
- [ ] Message input field works
- [ ] Send button sends message
- [ ] Messages display in thread
- [ ] **FRIENDS SECTION** (NEW)
  - [ ] Friends list visible
  - [ ] Can search for friends
  - [ ] Can add/remove friends
  - [ ] Can message friends directly

### 4. PROFILE SCREEN
- [ ] Avatar displays
- [ ] Stats show (followers, views, likes)
- [ ] Earnings section visible
- [ ] Follow button works
- [ ] **Message button works** (navigates to Chat)
- [ ] Portfolio grid displays videos
- [ ] Withdraw button visible
- [ ] Tier badge displays

### 5. WALLET SCREEN
- [ ] Balance displays correctly
- [ ] Transaction history shows
- [ ] Current tier displays
- [ ] Upgrade button opens paywall
- [ ] Paywall modal shows 3 tiers:
  - [ ] Free: $0, 300/day
  - [ ] Pro: $30/mo, 50/day (most popular)
  - [ ] Elite: $99/mo, unlimited

### 6. MUSIC SCREEN
- [ ] Beats grid displays
- [ ] BPM and duration info visible
- [ ] Like/unlike beats works
- [ ] Download count shows
- [ ] "Use Beat" button works
- [ ] Selected beat shows in bottom panel
- [ ] Can scroll through beats

### 7. TAB NAVIGATION
- [ ] All 6 tabs visible at bottom
- [ ] Tab icons display correctly
- [ ] Tap tab navigates to screen
- [ ] Active tab highlighted in pink
- [ ] Tab bar doesn't overlap content

### 8. REAL SORA VIDEOS
- [ ] Vibe feed uses real Sora videos (not Unsplash)
- [ ] Videos play smoothly
- [ ] No buffering issues
- [ ] Video quality is good

### 9. GENERAL
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] App doesn't crash
- [ ] Haptic feedback works on iOS/Android
- [ ] Dark theme applied throughout
- [ ] Colors match OnSpaceAI design (pink, cyan, yellow)
- [ ] All buttons have proper press feedback

## Bugs Found & Fixed
(To be updated during testing)

## Missing Features to Add
(To be updated during testing)
