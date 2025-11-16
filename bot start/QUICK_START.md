# Quick Start Guide for SourceBot Backend

## ✅ System Status

Based on the health check, your system has:
- ✅ All Python dependencies installed (Flask, Anthropic, etc.)
- ✅ API keys configured correctly
- ✅ Supplier data file with 200 suppliers
- ✅ Backend server code ready

## 🚀 How to Start and Test

### Step 1: Start the Backend Server

Open a terminal and run:
```powershell
cd backend
python orchestrator.py
```

You should see:
```
Starting orchestrator on port 5000...
 * Running on http://127.0.0.1:5000
```

**Leave this terminal open!** The server must stay running.

### Step 2: Open the Dashboard

Simply double-click or open in browser:
```
dashboard.html
```

The dashboard will automatically connect to `http://127.0.0.1:5000`

### Step 3: Test the API

Open another terminal and run:
```powershell
python backend/test_api.py
```

This will run a complete test of all 4 agents.

## 📋 Available Endpoints

Once the server is running, you can access:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | API documentation |
| `/api/health` | GET | Health check |
| `/api/state` | GET | Get current workflow state |
| `/api/submit-goal` | POST | Submit goal (Planner agent) |
| `/api/execute-research` | POST | Run research (Researcher agent) |
| `/api/approve-findings` | POST | Approve & draft emails (Communicator agent) |
| `/api/get-voice-report` | GET | Get voice report (Reporter agent) |
| `/api/get-text-report` | GET | Get text report |
| `/api/reset` | POST | Reset workflow |

## 🧪 Manual API Testing

Test the health endpoint:
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/health"
```

Submit a goal:
```powershell
$body = @{ goal = "Find top electronics suppliers" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/submit-goal" -Method POST -Body $body -ContentType "application/json"
```

Get current state:
```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/state"
```

## 🎯 Workflow Example

1. **Submit Goal** → Planner creates a plan
2. **Execute Research** → Researcher analyzes 200 suppliers
3. **Approve Findings** → Communicator drafts emails
4. **Get Voice Report** → Reporter generates audio summary (anytime)

## 🔧 Troubleshooting

### Server won't start
- Make sure port 5000 is not in use
- Check that you're in the `backend` directory
- Verify dependencies: `pip install -r requirements.txt`

### API returns errors
- Check that API keys in `api.env` are valid
- Verify `data/suppliers.json` exists
- Look at server console for error messages

### Dashboard shows "Network Error"
- Make sure backend server is running on port 5000
- Check browser console for CORS errors
- Try accessing `http://127.0.0.1:5000/` directly

## 📊 Expected Test Results

When running `python backend/test_api.py`, you should see:
- ✅ Health Check - Confirms server is up
- ✅ Submit Goal - Planner creates 3-5 step plan
- ✅ Execute Research - Analyzes suppliers, generates insights
- ✅ Approve Findings - Drafts 3-5 professional emails
- ✅ Text Report - Natural language status update
- ✅ Voice Report - MP3 audio file generated
- ✅ Reset - Workflow cleared

## 🎨 Using the Dashboard

The `dashboard.html` provides a visual interface:
1. Enter a goal in the text box
2. Click "🚀 Submit Goal" 
3. Wait for plan to appear
4. Click "🔍 Execute Research"
5. Review findings and click "✅ Approve"
6. See email drafts
7. Click "🔊 Get Voice Report" anytime

## 📝 Notes

- The system uses Claude 3.5 Sonnet for all agent interactions
- ElevenLabs generates voice reports with realistic speech
- State is stored in-memory (resets when server restarts)
- Dashboard polls for updates every 3 seconds

## 🆘 Need Help?

If you see errors:
1. Check the backend terminal for detailed error messages
2. Run `python backend/check_health.py` to diagnose issues
3. Verify API keys are valid and have credits
4. Make sure all files are in the correct locations
