# Sarika Rajput — 3D Interactive Portfolio

A 3D interactive portfolio website for **Sarika Rajput**, Electronics & Computer Engineer based in Verna, Goa, India.

Built with React 18 + TypeScript + Vite, featuring a 3D character scene (Three.js / R3F), GSAP scroll animations, custom cursor, post-processing effects, an interactive Knight's Tour chess mini-game, and a daily GK facts box.

> Template architecture adapted from [MoncyDev/Portfolio-Website](https://github.com/MoncyDev/Portfolio-Website). All personal content, copy, sections, and interactive widgets (chess game + GK facts) are original.

## Tech Stack

- React 18, TypeScript, Vite
- Three.js, @react-three/fiber, @react-three/drei
- @react-three/cannon, @react-three/rapier, @react-three/postprocessing
- GSAP + ScrollSmoother + ScrollTrigger (now-free standard GSAP)
- react-fast-marquee, react-icons
- @vercel/analytics

## Local Development

```bash
yarn install
yarn dev      # http://localhost:3000
```

## Production Build

```bash
yarn build
yarn preview
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel auto-detects Vite. Defaults:
   - **Framework:** Vite
   - **Build Command:** `yarn build`
   - **Output Directory:** `dist`
4. Deploy.

## Custom Sections

- `src/components/About.tsx` — bio
- `src/components/Career.tsx` — work timeline (Siemens, SprintM)
- `src/components/WhatIDo.tsx` — services (Build / Wire)
- `src/components/Work.tsx` + `src/data/projects.ts` — featured projects
- `src/components/Contact.tsx` — contact + social links
- `src/components/ChessGame.tsx` — Knight's Tour mini-game (5×5 board)
- `src/components/GKFacts.tsx` — daily GK fact + thank-you quote
- `src/data/gkFacts.ts` — curated GK facts list

## Contact

- Email: sarika15rajput@gmail.com
- GitHub: [@sarikarajput15](https://github.com/sarikarajput15)
- LinkedIn: [sarikarajput](https://linkedin.com/in/sarikarajput)
