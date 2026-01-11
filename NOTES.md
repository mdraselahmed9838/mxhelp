
# TrainSupport Pro - User History & Audit Notes

## Data Visibility (How Admin Sees All Info)
Every field collected during **Student Registration** or **Staff Recruitment** is stored as a single JSON object in the user's record within LocalStorage. 

The `PendingApplications.tsx` and `UserManagement.tsx` components use a **Universal Dossier Modal** which:
1.  Loads the full user object from the `DB`.
2.  Displays every detail (including the requested training dates, phone specs, and previous experience) in categorized sections.
3.  Ensures that even after a user is approved, their "Registration History" remains accessible via the **History/Dossier** button.

## Persistence
-   **Storage Key**: `tss_users_v4_master`.
-   **Security**: Admin credentials are no longer hardcoded in the production UI logic (Demo admin is provided in `store.ts` for development).
-   **Block Logic**: Any user with `isBlocked: true` (default for new registrations) is denied login in `App.tsx`.

## Vercel Deployment
The app uses `BrowserRouter` with a `vercel.json` rewrite rule to ensure that deep links (like `/pending`) work correctly after a browser refresh on the live server.
