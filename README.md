# MERN Task Tracker

A small full-stack task tracker built with MongoDB, Express, React, and Node.js. The React app is hosted on Vercel, the API on Render, and MongoDB Atlas provides the database.

## Requirements

- Node.js 20 or later
- An npm account/package manager
- A MongoDB Atlas cluster and database user

## Run locally

1. Create a MongoDB Atlas database and copy its connection string.
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI`.
3. Copy `client/.env.example` to `client/.env` and set `VITE_API_URL=http://localhost:5000`.
4. Install dependencies and start both apps:

   ```sh
   cd server
   npm install
   npm run dev
   ```

   In another terminal:

   ```sh
   cd client
   npm install
   npm run dev
   ```

   Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

The API health check is available at `http://localhost:5000/api/health`.

## Deploy

### MongoDB Atlas

Create a database user, allow network access from your Render service (for a quick demo, Atlas allows `0.0.0.0/0`, but restrict this where possible), and copy the application's connection string. Replace the password placeholder and URL-encode special characters in the password.

### Render (API)

The root `render.yaml` defines the Node web service. Create a new Blueprint in Render from this repository, then set:

- `MONGODB_URI`: your Atlas connection string (secret)
- `FRONTEND_URL`: the deployed Vercel origin, for example `https://my-task-tracker.vercel.app`

Render supplies `PORT`. The API listens on that port.

### Vercel (frontend)

Import this repository into Vercel and set the project root directory to `client`. Set the environment variable:

- `VITE_API_URL`: the Render API origin, for example `https://my-task-api.onrender.com` (no trailing slash)

Vercel will use the Vite build and output settings in `client/vercel.json`. Redeploy after changing environment variables.

## API

All task endpoints are prefixed with `/api/tasks`.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Check API availability |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create a task (`title`, optional `description`) |
| PUT | `/api/tasks/:id` | Update task fields (`title`, `description`, `completed`) |
| DELETE | `/api/tasks/:id` | Delete a task |

