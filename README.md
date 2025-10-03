# Auth‑Gated Tableau Wrapper (Firebase)
This bundle adds a login + Request Account flow with admin approval.

## Setup
1. Firebase Console → Enable Authentication (Email/Password) + Firestore.
2. Create a Web App → paste config in `/assets/firebaseConfig.js`.
3. Upload `firestore.rules` to Firestore Rules (insert your admin UID in the list).
4. Deploy these files to your host.

Pages:
- `/index.html` (gated dashboards)
- `/auth/login.html` (sign-in)
- `/auth/request.html` (sign up + profile submit → `approved=false`)
- `/auth/admin.html` (approve/reject)

## Notes
- Replace placeholders in `firebaseConfig.js` with your real config.
- Put your admin UID(s) in `firestore.rules`.
- You can later switch to custom claims if you prefer.
