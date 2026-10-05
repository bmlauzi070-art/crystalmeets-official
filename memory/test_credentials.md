# Crystal Meets — Test Credentials

## Admin (JWT email/password)
- **Email**: admin@crystalmeets.ie
- **Password**: AdminCrystal2026!
- **Role**: admin
- Access: `/admin` route in the app; can create/edit/delete/feature meets and set live status.

## Auth Endpoints
- POST `/api/auth/register`       — email/password/name signup
- POST `/api/auth/login`          — email/password login
- POST `/api/auth/logout`         — clears cookie
- GET  `/api/auth/me`             — current user (works with JWT cookie or Bearer token)
- POST `/api/auth/google/session` — exchange Emergent OAuth session_id for a session token

## Google OAuth (Emergent-managed)
- Google OAuth is enabled — click "Continue with Google" in the auth modal
- No preconfigured Google test accounts required; Emergent-managed OAuth handles the identity flow
- After a first successful Google login, the user is stored with `provider: "google"`

## Test Notes for Testing Agent
- Meets are seeded on first startup (12 Irish car meets) — no manual seeding required
- Cookie name: `access_token` (httponly, secure, samesite=none)
- Bearer token also returned by /register and /login as `token` in response body
- Admin dashboard `/admin` requires role=admin
