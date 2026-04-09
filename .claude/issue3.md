## Problem
`Catalog.jsx` and other pages simulate API calls with `setTimeout` and hardcoded mock data instead of hitting the real backend.

## Tasks
- Replace all mock `fetchProducts()` / mock data calls with real API calls to the staging backend
- Handle the backend response envelope `{ success, status, message, data }` consistently
- Add proper loading and error states
