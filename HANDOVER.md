# Threadline Platform — Handover Document

**Project:** Threadline — Full-Stack Fashion E-Commerce Platform
**Submission Date:** April 17, 2026
**Status:** Production Live ✅

---

## 1. Team Roles

| Name | Role | Responsibilities |
| :--- | :--- | :--- |
| Hunny Sharma | Lead Developer | Full-stack development, architecture, DevOps, deployment |

---

## 2. Live URLs

| Service | URL | Status |
| :--- | :--- | :--- |
| **Frontend (Vercel)** | https://threadline-platform.vercel.app | ✅ Live |
| **Backend API (Render)** | https://threadline-platform.onrender.com | ✅ Live |
| **Health Check** | https://threadline-platform.onrender.com/health | ✅ Live |
| **Swagger API Docs** | https://threadline-platform.onrender.com/api/docs | ✅ Live |
| **GitHub Repository** | https://github.com/hunny0025/threadline-platform | ✅ Public |

---

## 3. Completed Features

### 3.1 Authentication & Security
- [x] **Email/Password Registration & Login** — with bcrypt password hashing, JWT access tokens (15 min) and refresh tokens (7 days)
- [x] **Google OAuth 2.0** — Passport.js integration; callback redirects with JWT directly (no Redis dependency)
- [x] **Global Auth State (Frontend)** — `AuthContext` provider in React; persists login via `localStorage` across page refreshes
- [x] **GET /api/v1/auth/me** — Secure profile endpoint protected by JWT middleware
- [x] **Rate Limiting** — `express-rate-limit` applied to auth routes (prevents brute-force)
- [x] **Helmet** — Secure HTTP headers
- [x] **CORS Hardening** — Strict origin allowlist (Vercel frontend); allows `x-session-id` header for guest cart
- [x] **Custom Body Sanitizer** — Express 5 compatible (replaced `express-mongo-sanitize` + `xss-clean`)

### 3.2 Product Catalogue
- [x] **100 Products** across 10 categories (T-Shirts, Shirts, Jeans, Trousers, Hoodies, Jackets, Shorts, Co-ords, Sweatshirts, Accessories)
- [x] **Product Variants** — 2 colors × 6 sizes (XS–XXL) per product = 1,200 total variants
- [x] **Search API** — `/api/v1/search?q=` with Redis caching (automatic fallback if Redis down)
- [x] **Filtering & Sorting** — By category, gender, occasion, price range
- [x] **Product Detail Page** — Full variant selector with size/colour, stock check

### 3.3 Cart & Checkout
- [x] **Guest Cart** — `x-session-id` header-based; works without login
- [x] **Authenticated Cart** — Cart merged with user account on login
- [x] **Checkout Flow** — Address input, order summary, payment intent creation
- [x] **Razorpay Integration** — Payment gateway (test mode configured)
- [x] **Order Confirmation** — Order stored in MongoDB with full line items

### 3.4 DevOps & Infrastructure
- [x] **Docker** — Single `Dockerfile` for production; `docker-compose.yml` for full local stack
- [x] **GitHub Actions CI/CD** — Lint (ESLint Flat Config) + Jest tests on every push
- [x] **Render Deployment** — Auto-deploy on `main` push; health check at `/health`
- [x] **Vercel Deployment** — Auto-deploy on `main` push; `VITE_API_URL` set to Render backend
- [x] **Redis TLS** — `rejectUnauthorized: false` for Render managed Redis (`rediss://`)
- [x] **Swagger UI** — Full API documentation auto-generated at `/api/docs`

### 3.5 Frontend
- [x] React + Vite SPA
- [x] Responsive design (mobile + desktop)
- [x] Animated page transitions and loading states
- [x] `AuthCallback` page — handles Google OAuth token exchange
- [x] Dynamic Header — shows user name + Logout when authenticated
- [x] SWR for data fetching with automatic caching and revalidation
- [x] Error boundaries for graceful failure handling

---

## 4. Tech Stack

### Backend
| Layer | Technology |
| :--- | :--- |
| Runtime | Node.js 22 |
| Framework | Express 5 |
| Database | MongoDB (Mongoose) |
| Cache | Redis (ioredis) |
| Auth | Passport.js + JWT (jsonwebtoken) |
| Containerization | Docker |
| Hosting | Render |

### Frontend
| Layer | Technology |
| :--- | :--- |
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| State | React Context API (AuthContext, CartContext) |
| Data Fetching | SWR |
| Animations | Framer Motion |
| Hosting | Vercel |

---

## 5. Test Credentials

> **Note:** The production database does not have pre-seeded user accounts. Evaluators should register a new account on the live site.

### Registering a New Account
1. Visit: https://threadline-platform.vercel.app
2. Click **Sign In** in the top navigation
3. Switch to the **Sign Up** tab
4. Fill in Name, Email, and Password (min 6 characters)
5. Submit — you will be logged in automatically

### Google OAuth
1. Visit: https://threadline-platform.vercel.app
2. Click **Sign In → Continue with Google**
3. Authorize with any Google account
4. You will be redirected back and logged in automatically

### API Direct Access (for evaluators)
```bash
# Register a user
curl -X POST https://threadline-platform.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpass123"}'

# Login and get a token
curl -X POST https://threadline-platform.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Use the returned accessToken to call protected routes
curl -H "Authorization: Bearer <accessToken>" \
  https://threadline-platform.onrender.com/api/v1/auth/me
```

---

## 6. API Endpoints Summary

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/health` | ❌ | Health check (MongoDB + Redis status) |
| POST | `/api/v1/auth/register` | ❌ | Register a new user |
| POST | `/api/v1/auth/login` | ❌ | Login with email + password |
| GET | `/api/v1/auth/me` | ✅ JWT | Get current user profile |
| GET | `/api/v1/auth/google` | ❌ | Start Google OAuth flow |
| GET | `/api/v1/auth/google/callback` | ❌ | Google OAuth callback |
| POST | `/api/v1/auth/logout` | ❌ | Logout (clears refresh cookie) |
| GET | `/api/v1/products` | ❌ | List products (filter/sort/paginate) |
| GET | `/api/v1/products/:id` | ❌ | Get single product with variants |
| GET | `/api/v1/search?q=` | ❌ | Search products |
| GET | `/api/v1/cart` | ❌ | Get cart (session or user) |
| POST | `/api/v1/cart` | ❌ | Add item to cart |
| PUT | `/api/v1/cart/:itemId` | ❌ | Update cart item quantity |
| DELETE | `/api/v1/cart/:itemId` | ❌ | Remove item from cart |
| POST | `/api/v1/orders` | ✅ JWT | Create order |
| GET | `/api/v1/orders` | ✅ JWT | Get user orders |

Full interactive API documentation: **https://threadline-platform.onrender.com/api/docs**

---

## 7. Known Limitations

- **Redis Reconnect Logs**: The Render logs show periodic "Redis connected successfully" messages (every 2s). This is a cosmetic logging issue from the `ioredis` reconnect event — it does not affect API performance or functionality.
- **Cold Start**: Render free tier services sleep after 15 minutes of inactivity. The first request after a cold start may take ~30 seconds. Subsequent requests are instant.
- **Session Store**: Express sessions use `MemoryStore` (in-memory). This is adequate for single-instance deployments. For multi-instance scaling, migrate to Redis session store.

---

## 8. Repository Notes

- ✅ No `.env` files committed (enforced by `.gitignore`)
- ✅ `.env.example` provided for both root and `/client`
- ✅ All secrets managed via Render + Vercel environment variable dashboards
- ✅ `main` branch is the production branch (auto-deploys on push)

---

*Threadline Platform | April 2026*
