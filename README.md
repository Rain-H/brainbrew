# Naodong – Ad Inspiration Gallery

Naodong is a lightweight, single‑page web app that aggregates public advertising cases to help creatives, marketers, and brand planners quickly browse ideas. The site automatically fetches content from public sources and presents it in a clean, scrollable gallery. No sign‑in or authoring—just fast inspiration.

## Core Features
- **Automated aggregation**: Fetches the latest ad cases from a specified API
- **Single-page experience**: Always-visible logo/name; no complex navigation
- **Card gallery layout**: Thumbnail (or placeholder), title, source platform, optional short description, and a “View Original” link
- **Newest first**: Reverse-chronological listing
- **Progressive loading**: Infinite scroll or “Load more”
- **Resilient UX**: Fallback image on load failure; clear empty/error states
- **Responsive**: Adapts smoothly from mobile to desktop

## Tech Stack
- Next.js 14, TypeScript, Tailwind CSS

## Getting Started
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Configuration
- Set/update the content fetch endpoint in the data layer to point to your source API.

## Notes
- This is a minimal inspiration viewer. There is no login or authoring flow by design.

## License
- MIT
