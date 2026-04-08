## Problem
The Railway staging backend needs `ALLOWED_ORIGINS` to include `https://threadline-platform.vercel.app` for CORS to work.

## Fix
Set `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://threadline-platform.vercel.app` in the Railway environment variables.
