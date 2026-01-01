# Deployment Guide

This project is split into frontend (Vercel) and backend (Render/Node server).

## Backend (Render)
1. Repo: push this monorepo to GitHub
2. Create a new Render Web Service
   - Root directory: `backend`
   - Runtime: Node 18+
   - Build command: `npm install`
   - Start command: `node src/server.js`
3. Environment Variables
   - NODE_ENV=production
   - PORT=10000 (Render provides PORT automatically; leave unset)
   - CORS_ORIGIN=https://your-frontend.vercel.app
   - JWT_SECRET=yourprodsecret
   - JWT_EXPIRES_IN=7d
   - DB_HOST=your-mysql-host
   - DB_PORT=3306
   - DB_NAME=concept_master
   - DB_USER=youruser
   - DB_PASS=yourpass
   - UPLOAD_DIR=uploads
4. Disk
   - Add a persistent disk (e.g., 1GB) mounted at `/opt/render/project/src/uploads` to persist uploads
5. MySQL
   - Use a managed MySQL (PlanetScale, RDS, etc.) and allow Render outbound connections

## Frontend (Vercel)
1. Create New Project from this repository
2. Root directory: `frontend`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables
   - VITE_API_URL=https://your-backend.onrender.com/api

## CORS
- Set `CORS_ORIGIN` on backend to the Vercel domain
- For local dev use `http://localhost:5173`

## Notes on Upload URLs
- The frontend constructs absolute URLs for files by prefixing with the backend origin. Ensure `VITE_API_URL` points to `https://.../api`.

## Health Check
- Backend: `GET /api/health` should return `{ status: 'ok' }`
