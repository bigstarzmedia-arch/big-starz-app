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
