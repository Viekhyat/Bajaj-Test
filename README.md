# SRM Full Stack Engineering Challenge

This repository contains the complete full-stack solution for the hierarchical node processing challenge.

## Project Structure
- `/backend`: Node.js + Express API (`POST /bfhl`)
- `/frontend`: Vanilla HTML, CSS, and JS with a premium glassmorphism design.

## Features
- **Validation**: Strict validation of `X->Y` single-character uppercase formats.
- **Cycle & Tree Detection**: Constructs graphs, prevents multi-parents, detects disjoint components (trees and cycles), and builds nested structures.
- **Deep Insights**: Calculates total trees, total cycles, and identifies the root of the largest tree (resolving ties lexicographically).
- **Aesthetic UI**: Beautiful, fully responsive frontend UI powered by modern CSS (Glassmorphism, vibrant gradients, and dynamic animations).
- **Performance**: Handles edge-case heavy operations smoothly under 3 seconds constraint.

## Running Locally

### Backend
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Run the server: `npm start`
4. The server will run at `http://localhost:3000`

### Frontend
1. The frontend does not require any build tools.
2. Simply open `frontend/index.html` in any modern web browser or run a local server (e.g., Live Server extension in VS Code).

## Deployment Guide (Step 13)

### 1. Push to GitHub
1. Create a new public repository on GitHub.
2. Initialize this folder as a git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <YOUR_GITHUB_REPO_URL>
   git push -u origin main
   ```

### 2. Backend Deployment (Render)
1. Go to [Render](https://render.com/) and sign in.
2. Click **New +** > **Web Service**.
3. Connect your GitHub account and select your repository.
4. Set the following:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Click **Create Web Service**. Once deployed, copy the provided URL.

### 3. Frontend Deployment (Vercel or Netlify)
**Using Netlify:**
1. Go to [Netlify](https://www.netlify.com/) and sign in.
2. Click **Add new site** > **Import an existing project**.
3. Connect to GitHub and select your repository.
4. Set the following:
   - **Base directory**: `frontend`
   - **Publish directory**: `frontend` (or leave empty if it auto-detects)
5. Click **Deploy Site**.
6. **Important**: Before deploying, update the `fetch` URL in `frontend/script.js` from `http://localhost:3000/bfhl` to your new deployed Render backend URL.

## Final Submission Details (Step 14)
Once deployed, replace the placeholders below with your actual links and submit:

1. **Hosted API URL**: `https://<your-render-backend>.onrender.com/bfhl`
2. **Frontend URL**: `https://<your-netlify-frontend>.netlify.app`
3. **GitHub Repository**: `https://github.com/yourusername/srm-fullstack-challenge`
