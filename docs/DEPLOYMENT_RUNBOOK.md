# 🚀 Threadline Platform — Deployment Runbook

> **Owner:** Subhas Mondal  
> **Maintained:** Keep this document updated after every production release.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Backend Deployment (Railway)](#backend-deployment-railway)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Monitoring & Alerts](#monitoring--alerts)
7. [Rollback Procedure](#rollback-procedure)
8. [Release Tagging](#release-tagging)

---

## Architecture Overview

```
Internet
    │
    ├── Vercel (Frontend)
    │     └── React/Vite SPA → client/
    │
    └── Railway (Backend)
          └── Node.js/Express API → src/
                ├── MongoDB Atlas (database)
                └── Railway Redis (cache)
```

- **Frontend URL:** `https://threadline-platform.vercel.app`
- **Backend URL:** `https://threadline-platform-production.up.railway.app`
- **API Docs:** `https://threadline-platform-production.up.railway.app/api/docs`
- **Health Check:** `https://threadline-platform-production.up.railway.app/health`

---

## Pre-Deployment Checklist

Run the automated pre-flight script first:

```bash
# Set production env vars locally then run:
npm run preflight
```

Manual checks before deploying:

- [ ] All CI tests green on `main` branch
- [ ] No HIGH/CRITICAL vulnerabilities in `npm audit`
- [ ] `MONGODB_URI` points to Atlas (not localhost)
- [ ] `REDIS_URL` points to Railway Redis plugin (not localhost)
- [ ] `ALLOWED_ORIGINS` contains the Vercel frontend URL
- [ ] `RAZORPAY_WEBHOOK_SECRET` is set
- [ ] `SENTRY_DSN` is set
- [ ] `.env` is NOT committed to git
- [ ] DB migration has been tested on staging

---

## Backend Deployment (Railway)

### First-Time Setup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link
```

### Deploy

Railway auto-deploys from the `main` branch when Git push triggers the CI pipeline.

To force a manual deploy:

```bash
railway up --service threadline-api
```

### Environment Variables (Railway Dashboard)

Set all variables from `.env.example` in the Railway dashboard under **Variables**:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas connection string |
| `REDIS_URL` | Railway Redis plugin URL |
| `JWT_SECRET` | Strong random string (≥32 chars) |
| `JWT_REFRESH_SECRET` | Different strong string (≥32 chars) |
| `SESSION_SECRET` | Strong random string (≥32 chars) |
| `ALLOWED_ORIGINS` | `https://threadline-platform.vercel.app` |
| `SENTRY_DSN` | From Sentry project settings |
| `RAZORPAY_KEY_ID` | From Razorpay dashboard |
| `RAZORPAY_KEY_SECRET` | From Razorpay dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | From Razorpay webhook config |

### Run DB Migration After Deploy

```bash
# SSH into Railway container or run via Railway CLI
railway run node src/scripts/seed.js
```

---

## Frontend Deployment (Vercel)

### First-Time Setup

```bash
cd client
npx vercel link
```

### Deploy

Vercel auto-deploys from `main`. For manual deploy:

```bash
cd client
npx vercel --prod
```

### Environment Variables (Vercel Dashboard)

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://threadline-platform-production.up.railway.app` |

### Verify SSR-equivalent Features

Since this is a Vite SPA (not Next.js), verify:

- [ ] All routes work on hard-refresh (SPA rewrite configured in `vercel.json`)
- [ ] `/catalog`, `/product/:id`, `/checkout` pages load correctly
- [ ] OG meta tags present on landing page (check with Facebook Debugger)
- [ ] All API calls go to the Railway backend URL

---

## Post-Deployment Verification

### 1. Smoke Test

```bash
# Automated smoke tests
bash scripts/smoke-test.sh https://threadline-platform-production.up.railway.app
```

Manual checks:

```bash
# Health check
curl https://threadline-platform-production.up.railway.app/health

# Products API
curl https://threadline-platform-production.up.railway.app/api/v1/products | jq '.success'

# Search
curl "https://threadline-platform-production.up.railway.app/api/v1/search?q=shirt" | jq '.success'
```

### 2. Lighthouse Performance Audit

```bash
# Run against production URLs
npx @lhci/cli collect --url="https://threadline-platform.vercel.app" --numberOfRuns=3
npx @lhci/cli assert --config=lighthouserc.js
```

**Targets:**
- FCP: < 1.2s ✓
- LCP: < 2.5s ✓
- CLS: < 0.1 ✓
- Performance score: ≥ 90 ✓

### 3. Payment Webhook Verification

- Log into Razorpay dashboard → Webhooks
- Confirm the webhook URL matches: `https://threadline-platform-production.up.railway.app/api/v1/payment/webhook`
- Send a test webhook event and verify it's received (check Railway logs)

### 4. SSL Verification

```bash
# Check SSL certificate
curl -vI https://threadline-platform-production.up.railway.app 2>&1 | grep "SSL connection"
curl -vI https://threadline-platform.vercel.app 2>&1 | grep "SSL connection"
```

---

## Monitoring & Alerts

### Sentry (Error Monitoring)

- Dashboard: `https://sentry.io/organizations/threadline/`
- Monitor error rate for **2 hours post-deploy**
- Alert thresholds: >5 errors/min → investigate immediately

What to watch:
- Unhandled promise rejections
- 500 errors on payment/order routes
- DB connection errors

### APM (New Relic — optional)

Set `NEW_RELIC_LICENSE_KEY` to enable. Dashboard tracks:
- Request throughput
- DB query performance
- Memory/CPU usage

### Uptime

Railway provides built-in uptime monitoring. Also consider:
```bash
# Manual uptime check
watch -n 30 'curl -s https://threadline-platform-production.up.railway.app/health | jq .status'
```

---

## Rollback Procedure

### Backend (Railway)

```bash
# List recent deployments
railway deployments list

# Roll back to previous deployment
railway deployments rollback <deployment-id>
```

Or revert in Git and push:
```bash
git revert HEAD
git push origin main
```

### Frontend (Vercel)

1. Go to Vercel Dashboard → Deployments
2. Find the last good deployment
3. Click **Promote to Production**

---

## Release Tagging

```bash
# Patch release (bug fixes): 1.0.0 → 1.0.1
npm run release:patch

# Minor release (new features): 1.0.0 → 1.1.0
npm run release:minor

# Major release (breaking changes): 1.0.0 → 2.0.0
npm run release:major

# Specific version (e.g. v1.0-beta)
node scripts/release.js v1.0-beta
```

After tagging, create a GitHub Release:
1. Go to [Releases](https://github.com/hunny0025/threadline-platform/releases/new)
2. Select the new tag
3. Write release notes (features, fixes, breaking changes)
4. Publish

---

*Last updated: April 2026 — Hand off to Subhas Mondal.*
