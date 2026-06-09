# Sarika Rajput — 3D Interactive Portfolio (PRD)

## Original Problem Statement
Build a 3D interactive portfolio for Sarika Rajput (Electronics & Computer Engineer, Verna, Goa, India) by adapting the public MoncyDev/Portfolio-Website template. Preserve architecture, 3D scene, GSAP animations, and design language. Replace all personal content with Sarika's info. Add an interactive chess-themed mini-game and a daily GK facts box with a thank-you quote.

## Tech Stack
- React 18 + TypeScript + Vite (port 3000)
- Three.js + @react-three/fiber/drei/rapier/postprocessing
- GSAP (standard, free) + ScrollSmoother + ScrollTrigger
- react-icons, react-fast-marquee, @vercel/analytics

## What's Been Implemented (2026-01-08 → 2026-01-09)
- Cloned MoncyDev template into `/app/frontend`, Vite running on port 3000 via supervisor.
- Replaced trial GSAP (`gsap-trial`) with standard free `gsap@latest` (ScrollSmoother + SplitText).
- Personalized: Landing, About, Career (Siemens + SprintM), WhatIDo (Build / Wire), Work (6 real projects from `/src/data/projects.ts`), Contact, SocialIcons, Navbar, Loading marquee, page title, meta description, favicon.
- New: `ChessGame.tsx` — Knight's Tour 5×5 mini-game modal, opens via "PLAY CHESS" button. Bullet-proof: functional setState, useMemo for legal moves, game-over guard, disabled cells.
- New: `GKFacts.tsx` + `gkFacts.ts` — static curated 18-fact list, daily rotation, "Another fact" button, with the thank-you quote.
- New: `LoadingGame.tsx` — SPACE HOPPER mini-game shown during the long initial 3D character load. Press SPACE to hop the rocket across procedurally-generated purple platforms; gaps end the run. Persists `best` score in localStorage.
- New: `ShootingStars.tsx` — canvas-based meteor + twinkling-star overlay. Subtle purple meteors on the loading screen, brighter on the dark landing section. Adaptive blend modes for light vs. dark backgrounds.
- Chess-themed visuals: ♞ favicon, ♞ navbar logo, knight icon in CTA.
- Build verified: `yarn build` succeeds — output in `dist/`.
- README.md + vercel.json added for clean GitHub-to-Vercel deploy.

## Files Modified / Created (additional from second session)
**Created:** `src/components/LoadingGame.tsx`, `src/components/styles/LoadingGame.css`, `src/components/ShootingStars.tsx`, `src/components/styles/ShootingStars.css`.
**Modified:** `src/components/Loading.tsx` (mounted game + stars), `src/components/styles/Loading.css` (z-index/inner wrapper), `src/components/Landing.tsx` (added stars), `src/components/ChessGame.tsx` (crash fix — functional setState, useMemo, game-over guard).

## Known Notes
- 3D character GLB is shipped encrypted in the public template (`character.enc` with in-source password). Loading screen takes ~10-20s on first load because of the model + HDR environment download — this is template-default behavior.
- Headless Playwright screenshots can't get past the loading screen due to WebGL limitations, but the site works in real browsers.

## Backlog / Future
- P1: Optional — replace the 3D character with a custom Sarika-themed avatar (would require Blender + GLB export).
- P2: Make GK facts pull from a free API (e.g. uselessfacts.jsph.pl) for live rotation.
- P2: Add a "Resume PDF" link in SocialIcons once Sarika provides one.
- P2: SEO — add Open Graph image + sitemap.xml.
