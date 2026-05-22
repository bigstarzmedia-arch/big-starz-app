# Big Starz App - Complete OnSpaceAI Redesign (v3.0.0)

## COMPLETE REDESIGN - ONSPACEAI MATCHING (v3.0.0)

### Phase 1: Feed Redesign
- [ ] Add category tabs (For You, Music, Live, Fashion, AI Picks)
- [ ] Implement trending videos grid (2-column layout)
- [ ] Add Watch button (pink) and Gift button (gold outline)
- [ ] Add creator info at bottom (name, likes, genre)
- [ ] Implement category filtering and search
- [ ] Add "TRENDING NOW" badge to featured videos

### Phase 2: Create (AI Studio) Redesign
- [ ] Rebuild Create screen with 3 cards: Music Video (pink), AI Cameo (blue), AI Image (pink)
- [ ] Music Video: Text input + style selector (Cinematic, Anime, Neon, Fashion) + Generate button
- [ ] AI Cameo: Upload/Camera + Prompt + Preview + Generate button with 3-step process (Upload, Prompt, Preview)
- [ ] AI Image: Text input + style selector + Generate button
- [ ] Add progress tracking for all generations
- [ ] Add "Create with Big Starz AI ✨" subtitle

### Phase 3: Live, Earn, Profile Redesign
- [ ] Live screen: Live streaming interface with tools
- [ ] Earn screen: Affiliate partnerships grid with commission rates (12-22%) and Apply buttons
- [ ] Profile screen: Creator avatar, stats (followers, following, videos), Edit Profile, Share, My Videos/Liked tabs
- [ ] Membership modal: Free ($0), Pro ($9.99), Elite with feature lists
- [ ] Add "Upgrade to Elite" banner on profile

### Phase 4: API Integration
- [ ] Sora API: Text-to-video generation for Music Video
- [ ] Runway API: Video editing and beautification
- [ ] ElevenLabs API: Text-to-speech for music generation
- [ ] HappyFace API: Face detection for AI Cameo
- [ ] Gemini API: Image generation for AI Image
- [ ] Veo API: Video enhancement
- [ ] Camera access: Recording and upload for AI Cameo

### Phase 5: End-to-End Testing
- [ ] Test Feed category tabs and video loading
- [ ] Test Music Video generation with Sora
- [ ] Test AI Cameo upload and face detection with HappyFace
- [ ] Test AI Image generation with Gemini
- [ ] Test camera recording for all features
- [ ] Test Earn affiliate links
- [ ] Test Profile editing and stats
- [ ] Test Membership tier selection
- [ ] Verify all buttons work and no errors
- [ ] Test on iOS and Android via Expo Go

### Phase 6: Deployment
- [ ] Create final checkpoint
- [ ] Generate APK
- [ ] Submit to Google Play Store
- [ ] Submit to Apple App Store

## API Integration Details

### Sora API (Text-to-Video)
- [ ] Set up Sora API key in environment variables
- [ ] Create video generation endpoint in backend
- [ ] Wire Music Video generation to Sora
- [ ] Implement progress tracking and status polling
- [ ] Add video output storage in S3

### Runway API (Video Editing)
- [ ] Set up Runway API key
- [ ] Create video beautification endpoint
- [ ] Wire to AI Cameo beautification
- [ ] Implement video enhancement pipeline

### ElevenLabs API (Text-to-Speech)
- [ ] Set up ElevenLabs API key
- [ ] Create voice synthesis endpoint
- [ ] Wire to Music Video generation
- [ ] Add voice selection UI

### HappyFace API (Face Detection)
- [ ] Set up HappyFace API key
- [ ] Create face detection endpoint
- [ ] Validate face upload for AI Cameo
- [ ] Add face quality checks

### Gemini API (Image Generation)
- [ ] Set up Gemini API key
- [ ] Create image generation endpoint
- [ ] Wire to AI Image generation
- [ ] Implement style selector

### Veo API (Video Enhancement)
- [ ] Set up Veo API key
- [ ] Create video enhancement endpoint
- [ ] Wire to video beautification pipeline

## Testing Checklist

### Feed Testing
- [ ] Category tabs switch correctly
- [ ] Videos load in 2-column grid
- [ ] Watch button opens video player
- [ ] Gift button shows gift selection
- [ ] Creator info displays correctly
- [ ] Search functionality works

### Create (AI Studio) Testing
- [ ] Music Video card opens text input
- [ ] Style selector shows all 4 options (Cinematic, Anime, Neon, Fashion)
- [ ] Generate button calls Sora API
- [ ] Progress bar shows generation status
- [ ] AI Cameo card opens camera/upload
- [ ] Face detection validates upload
- [ ] AI Image card opens text input
- [ ] Generate button calls Gemini API

### Live Testing
- [ ] Live streaming interface loads
- [ ] Tools are accessible

### Earn Testing
- [ ] Affiliate cards display correctly
- [ ] Commission rates show (12-22%)
- [ ] Apply Now buttons are clickable
- [ ] Links open affiliate pages

### Profile Testing
- [ ] Creator avatar displays
- [ ] Stats show (followers, following, videos)
- [ ] Edit Profile button works
- [ ] Share button opens share sheet
- [ ] My Videos tab shows user videos
- [ ] Liked tab shows liked videos

### Membership Testing
- [ ] Free tier shows $0
- [ ] Pro tier shows $9.99
- [ ] Elite tier shows features
- [ ] Subscribe buttons work

## Known Issues
- None yet (starting fresh)

## Current Tasks (Session 2) - ALL COMPLETE ✅
- [x] Integrate 3 vector background images into ALL black screens (Create, Chat, Wallet, Settings, Profile, Music, Casting, Analytics)
- [x] Add "Big Starz Casting App" header to all screens with vector backgrounds
- [x] Add "Big Starz" watermark to all non-Elite tier videos
- [x] Connect Seedance 2.0 API for Elite tier users (1440p-SR 4K, reference images/videos/audio)
- [x] Create Vibe background with diverse performers in luxury brands
- [x] Add Translator button for international support (English, हिन्दी, العربية, Swahili)
- [x] Implement real-time Chat with WebSocket (typing indicators, online status, message history)
- [x] Add Stripe webhook handling for subscription status sync (Free → Pro → Elite)

## Completed Features
- [x] Free Tier backend with quota tracking (3/day free, 50/day pro, unlimited elite)
- [x] Database schema with freeTierQuota table
- [x] tRPC API routes for video generation and quota checking
- [x] 15 passing vitest tests
- [x] Reusable free-tier-backend skill created
- [x] Generated 3 cartoon vector backgrounds with diverse performers
