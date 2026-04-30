# Big Starz Casting & Music App - TODO

## Core Features

### Authentication & Onboarding
- [x] Implement email/phone sign-up with OAuth options
- [ ] Create profile setup flow (role selection: Creator, Model, Artist, Producer)
- [x] Integrate RevenueCat subscription paywall ($30/month)
- [x] Implement subscription entitlement gating for premium features

### Cameo & Beautify Engine (Kling & HeyGen API)
- [x] Create video upload component (camera/gallery picker)
- [ ] Implement Kling API integration for video beautification
- [ ] Implement HeyGen API integration for video beautification
- [x] Build beautify settings UI (model selection, style presets, resolution)
- [x] Create real-time progress tracking for video processing
- [ ] Build video output gallery with download/share/delete options
- [ ] Implement S3 file storage for beautified videos
- [ ] Add video metadata management (title, description, tags, visibility)
- [x] Wire STUDIO screen "Generate Video" button to real API mutations (FREE-TIER: Pollinations/Stable Diffusion)

### Music & Lyric Studio (OpenAI & ElevenLabs)
- [x] Create audio file upload component for instrumentals
- [ ] Implement OpenAI GPT-4 integration for lyric generation
- [ ] Implement Anthropic Claude integration as alternative lyric generator
- [x] Build lyric prompt input UI with real-time generation
- [x] Create inline lyric editing interface
- [ ] Implement ElevenLabs TTS integration for voice synthesis
- [x] Build voice selection UI (multiple voice options)
- [ ] Create music preview player (instrumental + generated vocals)
- [ ] Implement export options (MP3 download, social share, library save)
- [ ] Add music metadata management (title, artist, genre, mood, lyrics)

### Affiliate Modeling Feature
- [ ] Create Supabase table for casting briefs (brand, requirements, deadline, compensation)
- [ ] Build casting browse UI (grid with brand info, requirements, deadline)
- [ ] Implement casting detail view with full brief and brand guidelines
- [ ] Create casting application flow (portfolio selection, Q&A, confirmation)
- [ ] Build application status tracking (pending, accepted, rejected)
- [ ] Implement in-app messaging system for casting director communication
- [ ] Create user portfolio management (beautified videos, photos)
- [x] Implement marketplace search & filtering for CAST screen (by genre, price, aesthetic tags)

### Subscriber & Monetization System (Supabase & Stripe)
- [x] Create Supabase table for user subscriber counts
- [x] Build subscriber tracking logic (real-time counter updates)
- [x] Implement 1k subscriber milestone detection
- [ ] Create visual progress bar to 1k subscribers
- [ ] Build "Enable Casting Fees" feature unlock at 1k subscribers
- [ ] Implement Stripe account connection flow
- [ ] Create casting fee configuration UI (set custom fee amount)
- [ ] Build Stripe payment processing for user-to-user casting fees
- [ ] Implement earnings dashboard (breakdown, monthly chart, payout history)
- [ ] Create earnings ledger and transaction history
- [ ] Build payout reconciliation with Stripe

### RevenueCat Subscription Gateway
- [ ] Integrate RevenueCat SDK into app
- [ ] Configure $30/month subscription tier
- [ ] Create "premium_access" entitlement
- [ ] Implement paywall presentation logic
- [ ] Build subscription status screen (current plan, renewal date, cancel)
- [ ] Implement restore purchase functionality
- [ ] Add subscription analytics tracking

### Backend API & Database
- [ ] Design Supabase schema (users, videos, music, castings, applications, earnings)
- [ ] Implement user authentication endpoints
- [ ] Create video upload/storage endpoints
- [ ] Create music generation endpoints
- [ ] Implement casting management endpoints
- [ ] Create subscriber tracking endpoints
- [ ] Implement earnings/payout endpoints
- [ ] Add error handling and validation

### UI & Navigation
- [ ] Create tab bar navigation (Home, Cameo Studio, Music Studio, Affiliate Hub, Profile)
- [ ] Build Home screen dashboard
- [ ] Implement screen transitions and animations
- [ ] Create Settings screen with account, privacy, payment options
- [ ] Build Help/Support section with FAQ

### Testing & Deployment
- [ ] Write unit tests for core business logic
- [ ] Test video beautification workflows (Kling & HeyGen)
- [ ] Test music generation workflows (OpenAI & ElevenLabs)
- [ ] Test Stripe payment processing
- [ ] Test RevenueCat subscription flows
- [ ] Test 1k subscriber monetization gate
- [ ] Perform end-to-end user flow testing
- [ ] Test on iOS and Android devices
- [ ] Prepare app for App Store and Google Play submission

## Total Entry Point Overwrite (CRITICAL)
- [ ] Implement MediaPipe Beautify backend (skin-smoothing, studio lighting filters)
- [ ] Implement Cameo biometric bridge (Head-Turn Scan, Voice Clone routes)
- [ ] Remove generic template from index.tsx
- [ ] Apply Matte Black background globally
- [ ] Apply neon glassmorphism to all components
- [ ] Fix navigation bar with real icons (Star, Mic, etc.)
- [ ] Build live Vibe Feed with active Beautify filter
- [ ] Verify cameo-synthesis route is wired up
- [ ] Show preview with Big Starz identity

## Final Three Features (Phase 3)
- [ ] Implement Push Notifications (Expo Notifications) for gifts, casting approvals, subscriber milestones
- [ ] Build Creator Onboarding Tutorials (interactive 3-step: Cameo Scan → Voice Clone → First Music Generation)
- [ ] Implement Direct Social Export (TikTok/Instagram one-tap with auto-captions and trending sounds)
- [x] Add real-time notification system for new casting offers, messages, and earnings milestones

## Known Issues & Bugs
- [ ] TypeScript error in server/_core/storageProxy.ts (element type indexing)

## Completed Features
- [x] Project scaffold initialized (Expo 54, React Native, TypeScript)
- [x] GitHub repository created and initial code pushed
- [x] Design framework documented (design.md)

## Visual Identity & Interactive Preview (Priority)
- [x] Ensure Matte Black background and Neon Pink/Purple accents are active on all screens
- [x] Integrate 3D Cartoon Character art into background layers with glassmorphism effect
- [x] Big Starz Logo high-res and centered in header
- [x] Cameo Studio: Active camera frame with 3D Face Mesh instructions (Look Center, Turn Right, Turn Left, Look Up)
- [x] Cameo Studio: Head-turn scan interaction logic
- [x] Music Studio: Genre selection UI (Pop, Country, EDM, Latin, Rock)
- [x] Entry point must be Big Starz Home/Vibe Feed

## TikTok/Sora App Transformation (Priority)
- [x] Wire Cameo to real expo-camera with face mesh scan instructions
- [x] Connect Music Studio to free AI (Pollinations AI) for real lyric generation
- [x] Build Wallet/Earnings tab with full dashboard (balance, transactions, payout)
- [x] Make Vibe Feed TikTok-style with full-screen swipeable video cards
- [x] Ensure app is testable via Expo Go QR code on real device

## Polish & Final Integrations (Current Sprint)
- [x] Add Wallet as 5th tab in tab bar
- [x] Integrate Pollinations.ai free image generation for AI video thumbnails in Vibe Feed
- [x] Wire "ADD VOCALS" button in Music Studio to ElevenLabs TTS (or free Hume MCP)
- [x] Fix Cameo Studio "GENERATE CAMEO" button to produce real AI output (Pollinations image)
- [x] Add smooth press animations (scale 0.97) to all interactive elements consistently
- [x] Add loading shimmer/skeleton states for feed items
- [x] Ensure all screens have consistent header styling
- [x] Add pull-to-refresh on Vibe Feed
- [x] Wire Gift button to show gift selection modal
- [x] Wire Share button to native share sheet
- [x] Add Big Starz watermark overlay on all generated content
- [x] Ensure dark mode is consistent (no white flashes)
- [x] Add "Following" / "For You" toggle on Vibe Feed header (TikTok-style)
- [x] Polish tab bar with proper active/inactive states and labels
