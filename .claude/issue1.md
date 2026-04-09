## Problem
The CORS middleware at `src/middleware/cors.js` is missing `PATCH`, `OPTIONS` methods and `credentials: true`, which blocks product updates and cross-origin auth.

## Fix Applied
- Added `PATCH` and `OPTIONS` to allowed methods
- Added `Origin` to allowed headers
- Added `credentials: true` for cookie/session auth cross-origin

## Remaining Work
- Verify `ALLOWED_ORIGINS` on Railway includes `https://threadline-platform.vercel.app`
