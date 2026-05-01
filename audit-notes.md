# Tab Bar Fix Audit - Apr 30, 2026

## User Requests
1. Fix "X-Box" broken square icons → Replace with real icons
2. "Star" for Music Studio, "Mic" for Vibe Live
3. Remove duplicate "music-stu" tab
4. Deep Obsidian (#0B0B0B) globally
5. 7 genres: Rap, R&B, Pop, Country, EDM, Latin, Rock
6. Cameo 3D Face Mesh + Voice Clone 1-5 count active

## Current Tab Layout
- index → Vibe (star.fill → "star")
- cameo-studio → Cameo (camera.fill → "camera-alt")
- music-studio → Music (music.note → "music-note")
- affiliate-hub → Cast (person.2.fill → "people")
- wallet-screen → Wallet (creditcard.fill → "account-balance-wallet")

## Issue: The user may be seeing the Wallet tab as a broken icon
- "creditcard.fill" maps to "account-balance-wallet" which IS a valid MaterialIcons name
- Possible issue: 5th tab overflows on small screens

## Fix Plan
1. Change tab bar background from #000000 to #0B0B0B (Deep Obsidian)
2. Add "mic" icon mapping
3. Ensure all 5 tabs render with proper icons
4. Add "Rap" genre to music-studio.tsx (currently has Pop, Country, EDM, Latin, Rock, Hip-Hop, R&B)
