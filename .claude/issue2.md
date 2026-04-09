## Problem
Frontend has no centralized API client. Only `Header.jsx` has real API calls; everything else uses mock data. `VITE_API_URL` is defined in `.env.example` but never read in client source.

## Tasks
1. Create a centralized API client (e.g., `client/src/utils/api.js`) using `fetch` or `axios`
2. Prepend `VITE_API_URL` to all API calls (or rely on Vercel rewrite — verify rewrite at `client/vercel.json` covers all cases)
3. Add request interceptor for auth token (`Authorization: Bearer <token>`)
4. Align response unwrapping with backend shape: `{ success, status, message, data }`
5. Test all API calls against staging: `https://threadline-platform-production.up.railway.app`
