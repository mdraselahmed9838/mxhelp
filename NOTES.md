
# TrainSupport Pro - Technical Notes

## Fixes & Updates

1. **Persistence Strategy**: 
   - Replaced transient in-memory store with `localStorage` based `DB` class in `store.ts`.
   - Data persists across browser refreshes and system reloads.

2. **Security & Role Protection**:
   - **Inactive User Block**: Added `isBlocked` check to the login function. Inactive users are now physically prevented from starting sessions.
   - **Session Guard**: The `Layout` component now polls the user's status on route changes. If an admin deactivates an active user, they are kicked out of the session immediately.
   - **Production Credential Hiding**: Login credentials for the demo admin are now conditionally rendered only in development mode (`import.meta.env.DEV`).

3. **Vercel Build Stability**:
   - **Routing**: Switched from `HashRouter` to `BrowserRouter` for cleaner URLs.
   - **404 Fix**: Included `vercel.json` with rewrites to ensure direct URL access (e.g., `/users`) correctly loads the React app.
   - **Linux Case-Sensitivity**: Audited all file paths for correct casing to prevent build-time errors on Linux-based CI/CD environments.

4. **Slot Management**:
   - Fixed the `Add/Edit/Delete` logic in `TimeSlots.tsx`.
   - Slots now support `isActive` toggle and proper `teacherId` assignments.

## Credentials (Dev Only)
- **Admin**: `admin@tss.com` / `admin`
- **Persistence**: Final storage key is `tss_users_v2_final`.
