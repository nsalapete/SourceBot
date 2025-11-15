# Ngrok Integration Setup Guide

This guide explains how to connect your Lovable frontend to your Flask backend using ngrok.

## Prerequisites

1. Install ngrok: https://ngrok.com/download
2. Create a free ngrok account: https://dashboard.ngrok.com/signup
3. Get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken

## Setup Steps

### 1. Configure ngrok

```powershell
# Authenticate ngrok with your token
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

### 2. Start Your Flask Backend

```powershell
# Navigate to backend directory
cd backend

# Activate your Python environment if needed
# Then run the orchestrator
python orchestrator.py
```

Your Flask backend should now be running on `http://localhost:5000`

### 3. Start ngrok Tunnel

In a **new terminal**, run:

```powershell
ngrok http 5000
```

You'll see output like:
```
Forwarding https://abc123.ngrok-free.app -> http://localhost:5000
```

**Copy the https URL** (e.g., `https://abc123.ngrok-free.app`)

### 4. Configure Frontend Environment

Edit `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
VITE_NGROK_URL=https://abc123.ngrok-free.app
VITE_ENV=development
```

**Important:** Replace `https://abc123.ngrok-free.app` with your actual ngrok URL!

### 5. Start Frontend Development Server

```powershell
# In the root directory
npm run dev
```

Your Lovable frontend will start on `http://localhost:8080`

## Testing the Connection

1. Open your browser to `http://localhost:8080`
2. Open browser DevTools (F12) and check the Console
3. You should see: `🌐 Using ngrok URL: https://...` or `🔗 Using local API URL: http://localhost:5000`
4. Try submitting a task - it should connect to your backend

## Architecture

```
┌─────────────────┐
│   Browser       │
│  localhost:8080 │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐      ┌─────────────┐
│  Vite Dev       │─────▶│   ngrok      │─────▶│   Flask     │
│  Server (8080)  │      │   Tunnel     │      │  (5000)     │
└─────────────────┘      └──────────────┘      └─────────────┘
```

## API Endpoints Connected

Your frontend will call these Flask endpoints:

- `GET /api/state` - Get current workflow state
- `POST /api/submit-goal` - Submit new procurement goal
- `POST /api/execute-research` - Trigger research phase
- `POST /api/approve-findings` - Approve/reject findings
- `GET /api/get-voice-report` - Get voice report
- `GET /api/get-text-report` - Get text report
- `POST /api/reset` - Reset workflow
- `GET /api/health` - Health check

## Troubleshooting

### Frontend can't connect to backend

1. Check ngrok is running: Look for "Session Status: online"
2. Verify `.env` file has correct ngrok URL
3. Restart Vite dev server after changing `.env`
4. Check Flask backend is running on port 5000

### CORS errors

Your Flask backend needs CORS enabled:

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

### ngrok URL changes

Free ngrok URLs change each time you restart ngrok. Update `.env` with new URL and restart Vite.

### 502 Bad Gateway

- Backend is not running
- Backend crashed - check terminal for errors
- Port 5000 is being used by another process

## Production Notes

- ngrok free tier has rate limits
- For production, deploy backend to a cloud service (Heroku, Railway, etc.)
- Update `VITE_API_URL` to your production backend URL
- Remove ngrok dependency

## File Structure

```
SourceBot/
├── .env                          # Your environment variables
├── .env.example                  # Template for environment variables
├── vite.config.ts               # Vite config with proxy setup
├── frontend/
│   └── src/
│       ├── vite-env.d.ts        # TypeScript env definitions
│       └── lib/
│           ├── apiConfig.ts     # API configuration
│           └── api.ts           # API calls (to be updated)
└── backend/
    └── orchestrator.py          # Flask backend server
```

## Next Steps

1. Update `frontend/src/lib/api.ts` to use real backend endpoints
2. Replace mock data with actual API calls using `apiConfig.ts`
3. Test each workflow step end-to-end
4. Add error handling for network failures
