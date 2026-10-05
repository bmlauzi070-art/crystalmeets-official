# Crystal Meets — Product Requirements Document

## Original Problem Statement
A premium, custom-built Irish car meet discovery platform replacing motormeets.ie. Automotive HUD / dashboard / night-drive aesthetic — NOT a generic Eventbrite clone. Deep Obsidian Charcoal (#12161A) base, Amplify Orange (#FF5722) accent, Supernova White (#FFFFFF) text. Signature intro tire+smoke animation on first load. Three-zone desktop (list + dark interactive map + filters). Mobile map-first with bottom-sheet list. Simple View toggle for older users. Featured meet strip. Meet detail with Live Status banner, weather overlay, one-click Google/Apple Maps routing, dynamic OG share links.

## User Personas
- **Enthusiast (18–35)**: Wants nightly JDM/drift meets, filter by category, save favourites, share to WhatsApp/Insta.
- **Family driver (30–55)**: Cars & Coffee weekend, family-friendly toggle, weather-aware.
- **Older audience (55+)**: Uses **Simple View** — plain high-contrast list, no map, no motion.
- **Admin/Organiser**: Manages featured slot, meet lifecycle status.

## Core Requirements (static)
- Palette locked: #12161A / #FF5722 / #FFFFFF (dark) + optional slate #F1F5F9 / charcoal #0F172A (light).
- Intro tyre-spin + orange streaks + smoke bloom + wordmark reveal, <2.5s, once per session, `prefers-reduced-motion` respected.
- Auth is **optional site-wide**; only triggered on Save / Set Reminder.
- Both JWT email/password AND "Continue with Google" (Emergent-managed).
- Admin-controlled featured + live status ([ACTIVE]/[POSTPONED]/[CONCLUDED]/[CANCELLED]).
- Dynamic OG share via `/api/share/meet/:id` for WhatsApp/Facebook.
- Sharp corners, thin orange border traces (no bubbly rounded cards); 4px radius only on car preview thumbnails.

## Architecture
- **Backend**: FastAPI + Motor (MongoDB). JWT (HS256, cookie + Bearer). Bcrypt. Open-Meteo weather with 30-min in-memory cache. Emergent Google Auth session exchange.
- **Frontend**: CRA + React Router + Tailwind. Leaflet + CartoDB tiles (dark_all / voyager per theme). Sonner toasts. Shadcn/UI (Popover, Dropdown, Sheet, Drawer, Dialog, Switch, Select, Textarea, ScrollArea).
- **State**: ThemeContext, AuthContext, AppContext (filters, simpleView, selection, meets fetch).

## Implemented (2026-02)
- **v1.0 — 2026-02-25**:
  - Intro tyre+smoke animation with skip @1.4s.
  - Desktop three-zone (34% list · 66% map · slim top bar with Simple View + Filters + Account).
  - Mobile map-first + bottom-sheet drawer for list.
  - Featured strip (orange pulse border, 1–3 slots).
  - MeetList / MeetCard with hover→pin sync, active state.
  - MeetMap: Leaflet + CartoDB dark_all, custom orange diamond pins, FitBounds + FlyToSelected guarded.
  - MeetDetail page: LiveStatusBanner, hero, WeatherOverlay chip, InfoCells, Google Maps + Apple Maps route buttons, Save (opens auth modal if anon), Share (navigator.share → clipboard fallback).
  - Admin dashboard `/admin` with meets table + edit/create dialog + featured/status toggles + role gating.
  - JWT email/password auth + Emergent Google OAuth callback.
  - Backend `/api/share/meet/:id` returns HTML with proper OG tags + meta refresh for social crawlers.
  - Seeded 12 realistic Irish meets (Mondello Park trackday, Dublin C&C Ringsend, JDM Night Sandyford, Killarney Rally, Cork German, Charity Drive Temple St, Belfast C&C, Waterford Rally Sprint, Galway Classics, etc).
- **v1.1 — 2026-02-25** (post-first-test polish):
  - **Light-mode theme** added (slate #F1F5F9 + charcoal #0F172A + Amplify Orange preserved); sun/moon toggle next to Simple View.
  - **Bold headings** switched to Graphik (Manrope fallback via Google Fonts).
  - Car preview thumbnails get 4px radius (`.cm-thumb`); outer cards stay flat.
  - Meet card hover/active: razor-thin 1px orange border trace (no bg swap, no layout shift), +25% inner padding.
  - Fixed mobile map zero-height, filters popover z-index behind Leaflet, missing accessible titles on Sheet/Drawer.
  - Light-mode Leaflet tiles swap to CartoDB Voyager.

## Prioritized Backlog
### P1 — Should have
- **Meet submissions from public users** (moderated queue in admin).
- **RSVP / count going** for a meet, viewable on card.
- **Reminders**: email or web push 24h before saved meet (needs Resend/SendGrid).
- **Shadcn date-picker in admin** replacing native datetime-local.

### P2 — Nice to have
- Filter chip: "Within X km of me" using geolocation.
- Weather forecast for the meet DATE (not current) with historical Irish winter warnings.
- Multi-language: Irish (Gaeilge) copy.
- Ticketing / payment for paid track days (Stripe).

### P3 — Polish
- Turn PWA / installable app.
- Photo galleries per meet.
- Meet-of-the-week email digest.

## Test Credentials
See `/app/memory/test_credentials.md`. Admin: `admin@crystalmeets.ie / AdminCrystal2026!`
