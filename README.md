# 🧵 Threadline Platform
**Full-Stack Fashion E-Commerce Platform — Production Deployment**

Threadline is a production-grade fashion e-commerce platform built with a Node.js/Express backend API and a modern React + Vite frontend, featuring Google OAuth, JWT authentication, Redis caching, and a fully automated CI/CD pipeline.

---

## 🚀 Live Deployment

| Service | Platform | URL |
| :--- | :--- | :--- |
| **Frontend** | Vercel | [threadline-platform.vercel.app](https://threadline-platform.vercel.app) |
| **Backend API** | Render | [threadline-platform.onrender.com](https://threadline-platform.onrender.com/health) |
| **API Docs** | Swagger | [/api/docs](https://threadline-platform.onrender.com/api/docs) |
| **Repository** | GitHub | [github.com/hunny0025/threadline-platform](https://github.com/hunny0025/threadline-platform) |

---

## ⚡ Quick Start (Local Development)

### Option A: Docker (Recommended)
Start the **entire stack** (Backend + Frontend + MongoDB + Redis) with one command.

```bash
# 1. Clone and enter
git clone https://github.com/hunny0025/threadline-platform.git
cd threadline-platform

# 2. Setup environment
cp .env.example .env
cp client/.env.example client/.env
# Fill in your values in .env

# 3. Start everything
docker-compose up
```
*Frontend: `http://localhost:5173` | Backend: `http://localhost:3000`*

---

### Option B: Manual Setup
Requires Node.js 18+ and local MongoDB + Redis instances.

**Backend:**
```bash
npm install
cp .env.example .env   # Fill in required values
npm run seed           # Seed 100 products + categories
npm run dev            # Starts on http://localhost:3000
```

**Frontend:**
```bash
cd client
npm install
cp .env.example .env   # Set VITE_API_URL=http://localhost:3000
npm run dev            # Starts on http://localhost:5173
```

---

## 🌱 Seeding the Database

To populate the database with **100 realistic fashion products**, 10 categories, and full variants:
```bash
npm run seed
```
> ⚠️ This will clear existing `Products`, `Variants`, and `Categories` collections before seeding.

---

## 🔐 Environment Variables — Full Reference

Copy `.env.example` → `.env` and fill in all values:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | ✅ | Server port (default: 3000) |
| `NODE_ENV` | ✅ | `development` / `production` |
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `REDIS_URL` | ✅ | Redis connection URL (use `rediss://` for TLS) |
| `JWT_SECRET` | ✅ | Access token secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | ✅ | Refresh token secret — must differ from JWT_SECRET |
| `SESSION_SECRET` | ✅ | Passport session secret (min 32 chars) |
| `GOOGLE_CLIENT_ID` | ⚠️ OAuth | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | ⚠️ OAuth | From Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | ⚠️ OAuth | `https://your-backend.com/api/v1/auth/google/callback` |
| `ALLOWED_ORIGINS` | ✅ | Comma-separated CORS origins (e.g. your Vercel URL) |
| `RAZORPAY_KEY_ID` | ⚠️ Payments | Razorpay dashboard test/live key |
| `RAZORPAY_KEY_SECRET` | ⚠️ Payments | Razorpay dashboard test/live secret |
| `EMAIL_HOST` | ⚠️ Email | SMTP host |
| `EMAIL_PORT` | ⚠️ Email | SMTP port (587) |
| `EMAIL_USER` | ⚠️ Email | SMTP username |
| `EMAIL_PASS` | ⚠️ Email | SMTP password |

> **Dev Tip:** Use [ethereal.email](https://ethereal.email) for free SMTP testing — no real emails are sent.

---

## 🏗️ Project Architecture

```text
threadline-platform/
├── client/                    # React + Vite (deployed on Vercel)
│   ├── src/
│   │   ├── components/        # AuthContext, CartContext, UI library
│   │   ├── pages/             # Catalog, ProductDetail, Checkout, AuthCallback
│   │   ├── hooks/             # useSearch, useCartContext, useScrollDirection
│   │   └── lib/               # API client (auto-injects Bearer tokens)
├── src/                       # Node.js/Express API (deployed on Render)
│   ├── config/                # Passport.js & environment config
│   ├── controllers/           # authController, productController, etc.
│   ├── middleware/            # CORS, auth, rate-limiting, sanitization
│   ├── models/                # Mongoose Schemas (User, Product, Order, etc.)
│   ├── routes/                # /auth, /products, /cart, /orders
│   ├── db/                    # MongoDB & Redis connection managers
│   └── scripts/               # seed.js, backup.sh
├── Dockerfile                 # Production Docker build
├── docker-compose.yml         # Local full-stack orchestration
└── .github/workflows/         # CI/CD pipeline (lint + test + build)
```

---

## 🔑 Key Features

- **Authentication**: Email/Password + Google OAuth 2.0 (Passport.js + JWT)
- **Global Auth State**: React AuthContext with persistent login via localStorage
- **Product Catalogue**: 100 products, 10 categories, search, filters, variants
- **Shopping Cart**: Session-aware cart with `x-session-id` for guest users
- **Checkout & Orders**: Full order lifecycle with Razorpay payment integration
- **Admin Ready**: Role-based access (user / admin) for protected routes
- **Caching**: Redis-powered product & search cache (graceful fallback if Redis unavailable)
- **Security**: Helmet, CORS hardening, rate limiting, custom body sanitizer (Express 5 compatible)
- **DevOps**: Docker, GitHub Actions CI/CD, health check endpoint, Swagger API docs

---

## 🛡️ CI/CD Pipeline

Every push to `main` triggers:
1. **Lint** — ESLint (Flat Config, Node.js 22)
2. **Test** — Jest unit tests
3. **Build** — Vercel auto-redeploys frontend; Render auto-redeploys backend

---

## 📜 License

Internal Project — Team Threadline.
