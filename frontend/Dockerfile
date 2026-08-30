# =========================================================
# SaaS Ticketing System Frontend - Production Docker Image
# React + Vite + Nginx
# Version: v1.1
# =========================================================

# ---------- Stage 1 : Build React App ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (better Docker cache)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build production bundle
RUN npm run build


# ---------- Stage 2 : Serve with Nginx ----------
FROM nginx:1.29-alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy production build
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]