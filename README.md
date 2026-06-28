# TaskFlow – MERN Task Tracker

A full-stack task management app built with MongoDB, Express, React, and Node.js.

## Features
- ✅ Create, Read, Update, Delete tasks
- 🔍 Search, filter by status/priority, sort
- 🏷️ Priority levels (Low / Medium / High)
- 📅 Due date tracking with overdue alerts
- ⚡ Status toggle (Pending → In Progress → Completed)
- 🔔 Toast notifications
- 📱 Fully responsive UI
- ✔️ Form validation (frontend + backend)

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Axios, react-hot-toast |
| Backend | Node.js, Express.js, express-validator |
| Database | MongoDB + Mongoose |
| Deploy | Render (API) + Vercel (UI) |

## Local Setup

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free at [mongodb.com/atlas](https://mongodb.com/atlas))

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env → set MONGO_URI to your Atlas connection string
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env → VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Open http://localhost:5173

## Deployment

### Backend → Render
1. Go to [render.com](https://render.com) → New Web Service → connect this repo
2. Root directory: `backend`
3. Build: `npm install` | Start: `npm start`
4. Add env vars: `MONGO_URI`, `CLIENT_URL` (your Vercel URL), `NODE_ENV=production`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → import this repo
2. Framework: Vite | Root: `frontend`
3. Add env var: `VITE_API_URL=https://your-render-url.onrender.com/api`

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | List tasks (supports ?status, ?priority, ?sortBy, ?order, ?search) |
| GET | /api/tasks/:id | Get single task |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| PATCH | /api/tasks/:id/status | Update status only |
| DELETE | /api/tasks/:id | Delete task |
