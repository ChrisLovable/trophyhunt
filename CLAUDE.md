# TrophyHunt — Claude Code Instructions

## Stack
Next.js 14 App Router · TypeScript · Tailwind CSS · Supabase · Anthropic Vision · OpenWeatherMap · Leaflet

## Brand colours
Background: #0D0F0A · Panel: #131510 · Border: #2A2D1E
Gold: #C8A96E · Muted: #5A6040 · Text: #E8E2D4
Zones: Vital #50C878 · Aim #4A9EFF · Warn #FF8844 · Miss #FF4444
Fonts: Rajdhani (headings/numbers) · Inter (body)

## Tabs
/ballistics   — koeël selector + holdover calculator + trajectory ladder (50m steps)
/hunt-log     — GPS shot marker, recovery marker, Haversine distance, weather snapshot
/measurements — Claude Vision horn length (SCI spiral method, Kudu/Impala/Springbok etc)
/community    — trophy feed, leaderboards, brag cards, club rankings

## Rules
- NEVER Web Speech API — ElevenLabs Scribe via /api/transcribe if STT needed
- All labels bilingual EN/AF
- Ad banner fixed above bottom nav (320x50 AdMob slot)
- Blue dot = AIM point (above animal), Red dot = bullet IMPACT (vital zone)
- Holdover = how far ABOVE shoulder hunter must aim for bullet to drop INTO vitals
- Atmospheric corrections via airDensityRatio() in src/lib/ballistics/engine.ts
- Species vital zones in src/lib/types/species.ts — always use correct anatomy per species