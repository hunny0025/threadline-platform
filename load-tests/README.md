# Load Tests — k6

This directory contains [k6](https://k6.io/) load test scripts for the Threadline API.

## Prerequisites

Install k6: https://k6.io/docs/get-started/installation/

## Scripts

| File | Purpose | Duration |
|---|---|---|
| `smoke.js` | Quick sanity check — 1 VU × 10 iterations | ~10s |
| `load.js` | Full ramp test — 100 VUs over 5 minutes | ~5m |

## Running Locally

```bash
# Quick smoke check against local dev server
k6 run load-tests/smoke.js

# Full load test against staging
k6 run --env BASE_URL=https://your-staging-url.railway.app load-tests/load.js

# Output results as JSON
k6 run --out json=results.json load-tests/load.js
```

## Thresholds

- `p(95) < 1000ms` — 95th percentile response under 1 second
- `http_req_failed < 5%` — less than 5% of requests may fail

Results above the threshold will make k6 exit with a non-zero code, useful for CI gates.
