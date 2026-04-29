# Big Starz Casting & Music App - Design Framework

## App Overview

Big Starz is a high-end casting and music creation platform where artists, models, and creators can:
- Upload videos and have them "beautified" using AI (Kling/HeyGen)
- Write and produce music with AI-assisted lyrics (OpenAI/ElevenLabs)
- Get cast in affiliate modeling opportunities for luxury brands
- Monetize their content through a subscriber-based system with Stripe payouts
- Access premium features via RevenueCat subscription ($30/month)

---

## Screen List

### 1. **Onboarding & Authentication**
- **Splash Screen**: Big Starz logo, app name, loading state
- **Sign Up / Login**: Phone/email authentication with OAuth options
- **Subscription Gate**: RevenueCat paywall for $30/month access (before accessing core features)
- **Profile Setup**: User role selection (Creator, Model, Artist, Producer)

### 2. **Core Navigation (Tab Bar)**
- **Home**: Dashboard with personalized content feed and quick actions
- **Cameo Studio**: Upload and beautify videos
- **Music Studio**: Upload instrumentals and write lyrics
- **Affiliate Hub**: Browse and apply for modeling opportunities
- **Profile**: User account, subscriber count, earnings, settings

### 3. **Home Screen**
- Welcome banner with user's name
- Subscriber count display (tracks progress to 1k gate)
- Quick action buttons: "Start Cameo", "Create Music", "Browse Castings"
- Recent activity feed (beautified videos, music uploads, casting applications)
- Earnings summary (if user has 1k+ subscribers)

### 4. **Cameo & Beautify Engine**
- **Upload Screen**: Camera or gallery picker for video upload
- **Beautify Settings**: 
  - Select AI model (Kling or HeyGen)
  - Choose video style (cinematic, fashion, performance, etc.)
  - Set resolution and output format
  - Preview settings
- **Processing Screen**: Real-time progress indicator with estimated time
- **Output Gallery**: View, download, share, or delete beautified videos
- **Video Details**: Title, description, tags, visibility (private/public)

### 5. **Music & Lyric Studio**
- **Upload Instrumental**: Drag-and-drop or file picker for audio files
- **Lyric Assistant**: 
  - AI prompt input (describe the song vibe, theme, mood)
  - Real-time lyric generation using OpenAI/Anthropic
  - Edit and refine lyrics inline
  - Save lyric drafts
- **Voice Selection**: Choose voice for TTS (ElevenLabs integration)
- **Music Preview**: Listen to generated vocals over instrumental
- **Export Options**: Download as MP3, share to social, save to library

### 6. **Affiliate Modeling Feature**
- **Browse Castings**: Grid of available luxury brand collaborations
  - Brand name, product category, compensation
  - Required attributes (height, style, demographics)
  - Application deadline
- **Casting Details**: Full brief, brand guidelines, expected deliverables
- **Apply for Casting**: 
  - Submit portfolio (select beautified videos)
  - Answer brand-specific questions
  - Confirm availability
- **Application Status**: Track pending, accepted, rejected applications
- **Collaboration Chat**: In-app messaging with brands/directors

### 7. **Subscriber & Monetization System**
- **Subscriber Tracking**: Real-time counter showing current subscriber count
- **1k Milestone Gate**: 
  - Visual progress bar to 1k subscribers
  - Unlock message when threshold reached
  - "Enable Casting Fees" button becomes active
- **Casting Fees Setup**: 
  - Set custom casting fee amount
  - Connect Stripe account for payouts
  - View fee history and earnings
- **Earnings Dashboard**: 
  - Total earnings breakdown (casting fees, affiliate commissions)
  - Monthly revenue chart
  - Payout history with Stripe transaction links

### 8. **Subscription & Paywall**
- **RevenueCat Paywall**: 
  - $30/month subscription tier
  - Feature list (unlimited beautifications, music generation, casting access)
  - Restore purchase option
  - Manage subscription button
- **Subscription Status**: Current plan, renewal date, cancel option

### 9. **Profile & Settings**
- **User Profile**:
  - Profile picture, bio, social links
  - Subscriber count, total earnings
  - Verification badge (if applicable)
- **Settings**:
  - Account security (password, 2FA)
  - Notification preferences
  - Privacy settings
  - Payment methods (Stripe, RevenueCat)
  - App preferences (theme, language)
- **Support & Legal**: FAQ, contact support, terms, privacy policy

---

## Primary Content & Functionality

### Cameo & Beautify Engine
- **Input**: Video file (MOV, MP4, WebM) up to 5 minutes
- **Processing**: Kling or HeyGen API beautification
- **Output**: High-quality video with cinematic styling
- **Storage**: S3 or Supabase file storage
- **Metadata**: Title, description, tags, visibility, creation date

### Music & Lyric Studio
- **Input**: Audio file (MP3, WAV) instrumental
- **Lyric Generation**: OpenAI GPT-4 or Anthropic Claude for lyric writing
- **Voice Synthesis**: ElevenLabs API for TTS
- **Output**: MP3 with vocals synced to instrumental
- **Metadata**: Song title, artist, genre, mood, lyrics, voice model used

### Affiliate Modeling
- **Casting Database**: Supabase table with brand briefs, requirements, deadlines
- **User Portfolio**: Collection of beautified videos and photos
- **Application System**: Track submissions, status, and communications
- **Messaging**: In-app chat between user and casting directors

### Monetization System
- **Subscriber Tracking**: Supabase table tracking user subscriber counts
- **1k Gate Logic**: Conditional unlock of casting fee feature
- **Stripe Integration**: User-to-user payment processing
- **Earnings Ledger**: Transaction history and payout records

### RevenueCat Subscription
- **Paywall**: Native RevenueCat integration for $30/month tier
- **Entitlements**: "premium_access" entitlement for feature gating
- **Restore**: Allow users to restore previous purchases
- **Analytics**: Track subscription metrics (conversions, churn, LTV)

---

## Key User Flows

### Flow 1: New User Onboarding
1. User downloads app → Splash screen
2. Sign up with email/phone or OAuth
3. Complete profile setup (role selection)
4. Presented with RevenueCat paywall ($30/month)
5. After subscription, access Home dashboard
6. Guided tour of Cameo Studio, Music Studio, Affiliate Hub

### Flow 2: Beautify a Video (Cameo Studio)
1. User taps "Start Cameo" on Home
2. Selects video from camera or gallery
3. Chooses AI model (Kling/HeyGen) and style preset
4. Confirms settings and initiates processing
5. Waits for beautification (real-time progress shown)
6. Views output video in gallery
7. Option to download, share, or delete

### Flow 3: Create Music with AI Lyrics
1. User navigates to Music Studio
2. Uploads instrumental audio file
3. Enters lyric prompt (e.g., "upbeat hip-hop about success")
4. OpenAI generates lyrics in real-time
5. User edits/refines lyrics
6. Selects ElevenLabs voice
7. Generates TTS and syncs with instrumental
8. Previews final track
9. Downloads or shares

### Flow 4: Apply for Affiliate Casting
1. User navigates to Affiliate Hub
2. Browses available castings (luxury brands)
3. Taps casting to view full brief
4. Taps "Apply"
5. Selects portfolio videos (beautified content)
6. Answers brand-specific questions
7. Confirms and submits
8. Receives confirmation; status tracked in "My Applications"

### Flow 5: Unlock Monetization (1k Subscriber Gate)
1. User accumulates 1,000 subscribers (tracked in Supabase)
2. Home screen shows progress bar → "Milestone Reached!"
3. "Enable Casting Fees" button activates
4. User taps button → Stripe account setup flow
5. Sets casting fee amount
6. When brands/users pay for casting, Stripe processes payout
7. Earnings appear in Earnings Dashboard

### Flow 6: Subscribe via RevenueCat
1. Unsubscribed user attempts to access premium feature
2. RevenueCat paywall appears ($30/month)
3. User selects subscription
4. Completes payment
5. Entitlement granted; feature unlocked
6. User can manage subscription in Settings

---

## Color Choices

### Brand Palette (Luxury Hip-Hop Aesthetic)
- **Primary**: Deep Gold (#D4AF37) — luxury, exclusivity
- **Secondary**: Matte Black (#1A1A1A) — sophistication
- **Accent**: Vibrant Cyan (#00D9FF) — modern energy
- **Background**: Off-White (#F5F5F5) light mode; Deep Charcoal (#0F0F0F) dark mode
- **Text**: Charcoal (#2C2C2C) on light; Off-White (#F5F5F5) on dark
- **Success**: Emerald Green (#2ECC71) — confirmations
- **Warning**: Coral Red (#FF6B6B) — alerts
- **Muted**: Silver Gray (#A0A0A0) — secondary text

### Usage
- **Primary (Gold)**: Buttons, highlights, active states
- **Secondary (Black)**: Cards, surfaces, navigation
- **Accent (Cyan)**: Loading states, interactive elements, progress bars
- **Success/Warning**: Status indicators, form validation

---

## Interaction Patterns

### Button Feedback
- Primary buttons: Scale 0.97 + haptic feedback on press
- Secondary buttons: Opacity 0.7 on press
- Icon buttons: Opacity 0.6 on press

### Loading States
- Spinner with Cyan accent color
- Real-time progress percentage for long operations (video beautification, music generation)
- Estimated time remaining

### Error Handling
- Toast notifications for errors (bottom-center, 3-second duration)
- Inline form validation with red border + error message
- Retry buttons for failed operations

### Animations
- Subtle fade-in for screens (duration: 250ms)
- Gentle scale for button presses (0.97 scale, 80ms)
- Smooth transitions between tabs (200ms)
- No bouncy or dramatic animations (maintain professional aesthetic)

---

## Accessibility & Responsive Design

- **Safe Area**: All content respects notch and home indicator
- **Tab Bar**: Always visible, 56pt height + safe area bottom
- **Text**: Minimum 14pt for body text, 18pt for headings
- **Touch Targets**: Minimum 44pt × 44pt for interactive elements
- **Color Contrast**: WCAG AA compliance (4.5:1 for text)
- **Dark Mode**: Full support with CSS variables

---

## Summary

The Big Starz app is a premium, luxury-focused platform combining AI-powered video beautification, music creation, and casting opportunities. The design prioritizes:
- **Simplicity**: Clear navigation, minimal cognitive load
- **Luxury**: Gold accents, sophisticated typography, premium feel
- **Functionality**: All core features (Cameo, Music, Affiliate, Monetization) are equally prominent
- **Monetization**: RevenueCat paywall gates premium features; Stripe enables user-to-user payouts
- **Engagement**: Real-time progress tracking, subscriber milestones, earnings visibility
