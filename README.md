# Threadline Platform

Threadline is a fashion e-commerce platform currently under development.  
This repository contains the backend API, frontend client, and CI/CD setup.

## Project Overview
The goal of Threadline is to build a scalable fashion e-commerce platform that supports product browsing, ordering, and user management.

## Repository Structure

```
threadline-platform/
├── .github/workflows/     # GitHub Actions CI/CD
├── client/                # Frontend (React + Vite) → Deploy on Vercel
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── main.jsx       # React entry point
│   │   ├── App.css        # App styles
│   │   └── index.css      # Global styles & CSS variables
│   ├── index.html         # HTML entry
│   ├── vite.config.js     # Vite config with API proxy
│   ├── package.json
│   └── .env.example       # Frontend env vars template
├── src/                   # Backend (Express.js) → Deploy on Railway
│   ├── config/            # Environment config
│   ├── db/                # Database connection (Mongoose)
│   ├── docs/              # Swagger API docs
│   ├── middleware/         # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── scripts/           # Utility scripts (seed, etc.)
├── tests/                 # Unit tests
├── server.js              # Backend entry point
├── package.json           # Backend dependencies
└── .env.example           # Backend env vars template
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
git clone https://github.com/hunny0025/threadline-platform.git
cd threadline-platform
cp .env.example .env         # Fill in your values
npm install
npm run dev                  # Starts backend on http://localhost:3000
```

### Frontend Setup
```bash
cd client
cp .env.example .env         # Set VITE_API_URL
npm install
npm run dev                  # Starts frontend on http://localhost:5173
```

## Staging Deployment

### Backend → Railway
1. Connect this repo to [Railway](https://railway.app)
2. Set the **root directory** to `/` (project root)
3. Set environment variables in Railway dashboard:
   - `PORT` — Railway assigns automatically
   - `NODE_ENV` = `staging`
   - `MONGODB_URI` — Your MongoDB Atlas connection string
   - `JWT_SECRET` — A strong random string
   - `ALLOWED_ORIGINS` — Your Vercel frontend URL
4. Railway will auto-detect `npm start` and deploy

### Frontend → Vercel
1. Connect this repo to [Vercel](https://vercel.com)
2. Set the **root directory** to `client`
3. Framework preset: **Vite**
4. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` — Your Railway backend URL (e.g., `https://threadline-api.up.railway.app`)
5. Vercel will auto-build and deploy

### Staging MongoDB
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` for Railway access
3. Create a database user and get the connection string
4. Add the connection string as `MONGODB_URI` in Railway

## CI/CD Pipeline

This repository uses **GitHub Actions** to automatically run checks on every push and pull request.

The pipeline performs the following steps:
- Install project dependencies
- Run ESLint for code quality
- Execute unit tests
- Build the application

## Branch Protection

To maintain code quality, the `main` branch should be protected by requiring:

- Pull requests before merging
- Successful CI checks
- Code review approval

## Environment Variables

### Backend (.env.example)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | Environment: development / staging / production |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

### Frontend (client/.env.example)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

## License
MIT
