# GC2Go

Turn a travel reel your group is arguing about into a real, feasible plan.

Someone drops an Instagram/TikTok/YouTube link into the group chat. GC2Go identifies the destination shown in the video, verifies it against real Google Maps data, checks it against everyone's availability and who's driving, and generates a budgeted itinerary the group can vote on.

## How it works

The pipeline is four separate, narrowly-scoped Gemini calls chained together, each validated against a strict JSON schema before it's allowed to feed the next step:

1. **Video → destination.** Gemini is given the source video directly (a YouTube URL, or extracted video bytes for TikTok/Instagram) plus its caption, and asked to identify a specific venue from visible/spoken evidence — signage, landmarks, spoken location names, menus. It returns `null` rather than guessing when the evidence is weak, and it's explicitly instructed to ignore any instructions embedded in the video or caption.
2. **Scraping.** TikTok and Instagram links are resolved and fetched via Bright Data's scraping API to obtain the actual video file and caption, since Gemini can't fetch those URLs itself.
3. **Destination → verified place.** Once a destination is confirmed, a second Gemini call runs with the Google Maps grounding tool enabled, returning only Maps-backed facts — address, rating, hours, review highlights, nearby food and activities. Responses with no Maps citations are rejected outright; nothing is allowed to be invented.
4. **Grounded place + group constraints → itinerary.** A final call takes the grounded place data along with the group's computed availability, driver, and budget, and produces a timed itinerary using only venues present in the grounded data.

This keeps hallucination risk low in a domain where a wrong address, invented rating, or made-up price is actively harmful rather than just annoying.

## Demo mode

By default the app runs against recorded fixtures instead of live APIs, so it can be demoed without credentials:

```
MOCK_PIPELINE=true
```

With this set, submitted links resolve to canned analysis/plan data rather than calling Gemini or Bright Data.

## Running it live

To exercise the real pipeline, set:

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Required for all four Gemini calls (video analysis, Maps grounding, trip planning). |
| `GEMINI_MODEL` | Gemini model id. Defaults to `gemini-3.7-flash`. |
| `BRIGHTDATA_API_TOKEN` | Required to scrape TikTok/Instagram video content. YouTube links work without it. |
| `MOCK_PIPELINE` | Set to `false` to use the live pipeline. |

Copy `.env.example` to `.env` and fill in the values you need.

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server. |
| `npm run build` | Production build. |
| `npm run start` | Serve a production build. |
| `npm run typecheck` | Run TypeScript in `--noEmit` mode. |
| `npm run test` | Run the test suite with Vitest. |

## Project structure

```
app/                    Next.js routes and API endpoints
  api/analyze-social-link/     Identify a destination from a pasted link
  api/enrich-place/            Ground a confirmed destination in Google Maps
  api/generate-trip-plan/      Generate the group itinerary
components/             UI: group chat feed, trip plan cards, voting panel
lib/
  gemini/                      Gemini calls: video analysis, Maps grounding, plan generation
  social-extraction/           Bright Data scraping + normalization
  feasibility.ts               Group availability/driver/budget logic
  plan-flow.ts                 Destination confirmation and planning-stage transitions
data/                   Demo fixtures and seed data used in mock mode
types/                  Shared TypeScript types
```

## Team

| Name | Role |
|---|---|
| Kevin Munoz | Product & UX Designer |
| Sahla Taher | AI/ML Engineer & Backend Engineer |
| Bijay Thakur | AI/ML Engineer |
| Marcus Coppa | Full-Stack Engineer|

## Tech stack

- [Next.js](https://nextjs.org) (App Router) with React 19
- [Gemini API](https://ai.google.dev) via `@google/genai`, including Google Maps grounding
- [Bright Data](https://brightdata.com) for TikTok/Instagram scraping
- [Zod](https://zod.dev) for schema validation across every API boundary
- Tailwind CSS
- Vitest
