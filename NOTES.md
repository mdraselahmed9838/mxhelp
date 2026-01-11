
# TrainSupport Pro - User History System

## Feature Set

1. **Persistent Dossiers**:
   - All user records now contain `registrationDate`, `startDate`, and `endDate`.
   - Data persists in `localStorage` with the key `tss_users_v3_history`.

2. **Pending Application Audit**:
   - New `PendingApplications.tsx` provides a high-density table of all incoming requests.
   - Admins can see the requested `Time Slot` and `Training Period` before approving.
   - Accounts are created as `isBlocked: true` by default upon registration.

3. **Full Audit Logs (History)**:
   - In `User Listing`, the "History" button opens a comprehensive dossier.
   - This dossier displays every field ever collected from the user (Personal, Training, Technical, Staff-specific).

4. **Activation Logic**:
   - Login is strictly prohibited for users with `isBlocked: true`.
   - Admin "Approval" in the Pending panel flips `isBlocked` to `false` and sets `status` to `APPROVED`.

## Deployment
- `vercel.json` rewrite rules are maintained for SPA support.
- Production environment correctly hides demo admin credentials.
