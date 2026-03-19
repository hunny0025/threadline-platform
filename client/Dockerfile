# ============================================================
# Threadline Platform - Frontend Dockerfile (Vite + React)
# Used by docker-compose for local dev with hot reload.
# For Vercel deployment, Vercel builds directly from source.
# ============================================================

FROM node:22-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 5173

# --host exposes Vite dev server outside the container
CMD ["npx", "vite", "--host", "0.0.0.0"]
