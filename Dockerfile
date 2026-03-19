# ============================================================
# Threadline Platform - Backend Dockerfile
# Used by docker-compose for local dev with hot reload.
# For production Railway deployment, Railway uses npm start.
# ============================================================

FROM node:22-alpine

WORKDIR /app

# Install dependencies first (layer caching)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

EXPOSE 3000

# Nodemon for hot reload in dev
CMD ["npx", "nodemon", "server.js"]
