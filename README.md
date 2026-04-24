# SRM Full Stack Engineering Challenge

This repository contains the complete, production-ready full-stack solution for the hierarchical node processing challenge.

## Project Structure
- **`/backend`**: Node.js + Express API (`POST /bfhl`). Handles strict graph processing.
- **`/frontend`**: Vanilla HTML, CSS, and JS powered by **Vite**. Features an ultra-premium "Aurora Borealis Glassmorphism" UI dashboard.

## Features & Implementation
- **Strict Validation**: Trims whitespace, rejects empty strings, numbers, multi-character nodes, and self-loops.
- **Advanced Graph Construction**: Builds adjacency lists and silently discards duplicate parent edges (Diamond multi-parent rule).
- **Cycle & Tree Detection (DFS)**: Utilizes an explicit Depth First Search algorithm with a recursion stack to detect pure and connected cycles. Ties for the largest root or cycle root are resolved lexicographically.
- **Premium Aesthetic UI**: The frontend features dynamic Aurora gradients, high-blur glassmorphism cards, interactive dashboard stats (Trees, Cycles, Largest Root), visual error tags, and syntax-highlighted JSON output.

## Running Locally

### 1. Start the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the server:
   ```bash
   node server.js
   ```
   *(The API will run on `http://localhost:3000`)*

### 2. Start the Frontend
1. Open a **new** terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install Vite and dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *(The frontend will be instantly served with Hot Module Replacement, typically on `http://localhost:5173`)*

## Deployment Guide

### 1. Push to GitHub
Initialize this folder as a git repository and push it to a public GitHub repo.

### 2. Backend Deployment (Render / Railway)
1. Go to [Render](https://render.com/) or Railway.
2. Create a new **Web Service** and connect your GitHub repo.
3. Set the Root Directory to `backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Copy the provided API URL once deployed.

### 3. Frontend Deployment (Vercel / Netlify)
1. Before deploying, go to `frontend/script.js` and update the `fetch` URL from `http://localhost:3000/bfhl` to your newly deployed backend API URL!
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repo.
4. Set the Framework Preset to **Vite** and Root Directory to `frontend`.
5. Deploy.

## Final Submission Format
Once deployed, submit the following exact format:

**Frontend URL:**
`https://<your-vercel-app>.vercel.app`

**Backend API Base URL (NO /bfhl):**
`https://<your-render-backend>.onrender.com`

**GitHub Repository:**
`https://github.com/yourusername/srm-fullstack-challenge`
