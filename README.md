# 🧵 Threadline Platform
**Professional Fashion E-Commerce Staging & Dev Environment**

Threadline is a full-stack fashion e-commerce platform. This repository contains a production-grade backend API, a modern React frontend, and a fully automated DevOps pipeline.

---

## 🚀 Live Staging Environment
Use these links to check the latest stable deployment:

| Service | Environment | URL |
| :--- | :--- | :--- |
| **Frontend** | Vercel | [threadline-platform.vercel.app](https://threadline-platform.vercel.app) |
| **Backend** | Railway | [threadline-platform-production.up.railway.app](https://threadline-platform-production.up.railway.app/health) |
| **API Docs** | Swagger | [/api/docs](https://threadline-platform-production.up.railway.app/api/docs) |

---

## ⚡ Quick Start (Local Development)

### Option A: The "Senior Dev" Way (Docker) - RECOMMENDED
If you have Docker installed, you can start the **entire stack** (Backend + Frontend + MongoDB + Redis) with one command. No local database installation needed.

```bash
# 1. Clone and enter
git clone https://github.com/hunny0025/threadline-platform.git
cd threadline-platform

# 2. Setup Env
cp .env.example .env
cp client/.env.example client/.env

# 3. Start everything
docker-compose up
```
*Frontend runs on `http://localhost:5173` | Backend on `http://localhost:3000`*

---

### Option B: The Manual Way
Requires Node.js 18+ and a local MongoDB instance.

**1. Backend Setup**
```bash
npm install
npm run dev
```

**2. Frontend Setup**
```bash
cd client
npm install
npm run dev
```

---

## 🌱 Seeding Data
To populate your database with 30+ realistic fashion products, categories, and variants:
```bash
npm run seed
```
*⚠️ WARNING: This will clear your existing local database collections before seeding.*

---

## 🛠️ Team Onboarding: Env Variables
Every intern/team member **must** set these in their local `.env` file from the `.env.example` template.

### 🔑 Critical Identity Variables
| Variable | Description |
| :--- | :--- |
| `JWT_SECRET` | Secret for short-lived access tokens |
| `JWT_REFRESH_SECRET` | **MANDATORY** for login & refresh sessions |
| `SESSION_SECRET` | Used for Passport.js / Google OAuth sessions |

### 🌐 Social Auth (Google)
| Variable | Usage |
| :--- | :--- |
| `GOOGLE_CLIENT_ID` | From Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | `http://localhost:3000/api/v1/auth/google/callback` |

---

## 🛡️ Reliability & DevOps

### ☁️ CI/CD Pipeline (GitHub Actions)
Every Push/PR triggers an automated check:
1. **Linting**: Checks code quality via ESLint.
2. **Testing**: Runs unit tests via Jest.
3. **Build**: Ensures the project builds without errors.
*Status: Check the **Actions** tab for the green ✅.*

### 📦 Database Backups (S3)
We use a production-grade backup strategy located in `scripts/backup.sh`.
- **How it works**: Dumps MongoDB → Compresses → Uploads to AWS S3.
- **Schedule**: Intended for daily cron jobs in production.

---

## 📂 Project Structure
```text
threadline-platform/
├── client/                # React + Vite (Vercel)
├── src/                   # Node.js API (Railway)
│   ├── config/            # Passport & Env config
│   ├── controllers/       # Business logic
│   ├── models/            # Mongoose Schemas (User, Product, etc.)
│   ├── routes/            # API Endpoints
│   └── scripts/           # Seed & Backup utilities
├── docker-compose.yml     # Local dev orchestration
└── .github/workflows/     # CI Pipeline
```

---

## 📜 License
Internal Internship Project - Team Threadline.
