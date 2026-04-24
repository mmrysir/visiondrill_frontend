# VisionDrill Frontend Strategy (Next.js)

## Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Context / Hooks

## API Consumption
All API calls should point to the `visiondrill_api` service.
Use an environment variable `NEXT_PUBLIC_API_URL` for the backend base URL.

## Component Library
- Components are located in `src/components/`.
- Pages are in `src/app/`.

## State Design
- Use server components where possible for performance.
- Client components for interactive features (AI chat, video player).
