# Sarika Rajput — 3D Interactive Portfolio (PRD)

## Original Problem Statement
Build a 3D interactive portfolio for Sarika Rajput (Electronics & Computer Engineer, Verna, Goa, India) by adapting the public MoncyDev/Portfolio-Website template. Preserve architecture, 3D scene, GSAP animations, and design language. Replace all personal content with Sarika's info. Add an interactive chess-themed mini-game and a daily GK facts box with a thank-you quote.

## Tech Stack
- React 18 + TypeScript + Vite (port 3000)
- Three.js + @react-three/fiber/drei/rapier/postprocessing
- GSAP (standard, free) + ScrollSmoother + ScrollTrigger
- react-icons, react-fast-marquee, @vercel/analytics

## What's Been Implemented (2026-01-08)
- Cloned MoncyDev template into `/app/frontend`, Vite running on port 3000 via supervisor.
- Replaced trial GSAP (`gsap-trial`) with standard free `gsap@latest` (ScrollSmoother + SplitText).
- Personalized: Landing, About, Career (Siemens + SprintM), WhatIDo (Build / Wire), Work (6 real projects from `/src/data/projects.ts`), Contact, SocialIcons, Navbar, Loading marquee, page title, meta description, favicon.
- New: `ChessGame.tsx` — Knight's Tour 5×5 mini-game modal, opens via "PLAY CHESS" button.
- New: `GKFacts.tsx` + `gkFacts.ts` — static curated 18-fact list, daily rotation, "Another fact" button, with the thank-you quote.
- Chess-themed visuals: ♞ favicon, ♞ navbar logo, knight icon in CTA.
- Build verified: `yarn build` succeeds — output in `dist/`.
- README.md + vercel.json added for clean GitHub-to-Vercel deploy.

## Files Modified / Created
**Modified:** `index.html`, `src/App.tsx`, `src/components/Landing.tsx`, `About.tsx`, `Career.tsx`, `WhatIDo.tsx`, `Work.tsx`, `Contact.tsx`, `SocialIcons.tsx`, `Navbar.tsx`, `Loading.tsx`, `MainContainer.tsx`, `Character/utils/...` (gsap-trial → gsap), `vite.config.ts`, `package.json`.
**Created:** `src/components/ChessGame.tsx`, `src/components/GKFacts.tsx`, `src/components/styles/ChessGame.css`, `src/components/styles/GKFacts.css`, `src/data/projects.ts`, `src/data/gkFacts.ts`, `public/favicon.svg`, `README.md`, `vercel.json`.

## Known Notes
- 3D character GLB is shipped encrypted in the public template (`character.enc` with in-source password). Loading screen takes ~10-20s on first load because of the model + HDR environment download — this is template-default behavior.
- Headless Playwright screenshots can't get past the loading screen due to WebGL limitations, but the site works in real browsers.

## Backlog / Future
- P1: Optional — replace the 3D character with a custom Sarika-themed avatar (would require Blender + GLB export).
- P2: Make GK facts pull from a free API (e.g. uselessfacts.jsph.pl) for live rotation.
- P2: Add a "Resume PDF" link in SocialIcons once Sarika provides one.
- P2: SEO — add Open Graph image + sitemap.xml.
