# SourceBot - Multi-Agent Orchestration System

An intelligent multi-agent system for supplier relationship management using Claude AI and ElevenLabs voice synthesis.

## Architecture

The system implements a 4-agent workflow:

1. **Planner Agent** - Creates strategic plans from manager goals
2. **Researcher Agent** - Analyzes supplier data from CRM
3. **Communicator Agent** - Drafts professional emails to suppliers
4. **Reporter Agent** - Generates voice status reports

## Setup Instructions

### Backend Setup

1. **Install Python dependencies:**
```powershell
cd backend
pip install -r requirements.txt
```

2. **Configure API keys:**
   - The `api.env` file is already configured with your Claude and ElevenLabs API keys
   - Make sure it's in the root directory

3. **Run the orchestrator:**
```powershell
python orchestrator.py
```

The backend server will start on `http://localhost:5000`

## API Endpoints

### 1. Submit Goal
```
POST /api/submit-goal
Body: { "goal": "your goal here" }
```
Initiates the workflow by creating a plan.

### 2. Execute Research
```
POST /api/execute-research
```
Loads supplier data and analyzes it using Claude.

### 3. Approve Findings
```
POST /api/approve-findings
Body: { "approved": true }
```
Human-in-the-loop approval step. Triggers email drafting.

### 4. Get Voice Report
```
GET /api/get-voice-report
```
Returns an MP3 audio file with status update.

### 5. Get Text Report
```
GET /api/get-text-report
```
Returns text-only status report.

### 6. Get State
```
GET /api/state
```
Returns current workflow state.

### 7. Reset
```
POST /api/reset
```
Resets the workflow to start fresh.

## Workflow Example

```javascript
// 1. Submit goal
const response1 = await fetch('http://localhost:5000/api/submit-goal', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    goal: "Identify top-rated electronics suppliers for potential partnership" 
  })
});

// 2. Execute research
const response2 = await fetch('http://localhost:5000/api/execute-research', {
  method: 'POST'
});

// 3. Approve findings
const response3 = await fetch('http://localhost:5000/api/approve-findings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ approved: true })
});

// 4. Get voice report (anytime)
const audio = await fetch('http://localhost:5000/api/get-voice-report');
const audioBlob = await audio.blob();
const audioUrl = URL.createObjectURL(audioBlob);
// Play audio...
```

## State Management

The system maintains a global state object:

```javascript
{
  "goal": "Manager's submitted goal",
  "status": "idle|planning|planned|researching|awaiting_approval|drafting|completed|error",
  "current_step": 0-4,
  "plan": [...],           // Array of plan steps
  "findings": {...},       // Research findings
  "drafts": {...},         // Email drafts
  "suppliers_data": [...]  // Full supplier dataset
}
```

## Agent Details

### Planner Agent (`planner.py`)
- Uses Claude to break down goals into actionable steps
- Returns structured JSON plan
- Handles strategic thinking and task breakdown

### Researcher Agent (`researcher.py`)
- Loads supplier data from `data/suppliers_data.json`
- Analyzes 100+ suppliers based on goal
- Provides statistics, insights, and recommendations
- Identifies relevant suppliers for outreach

### Communicator Agent (`communicator.py`)
- Drafts personalized emails for each relevant supplier
- Creates professional, contextual communications
- Includes subject lines and full email bodies

### Reporter Agent (`reporter.py`)
- Generates natural language status reports
- Converts text to speech using ElevenLabs
- Returns MP3 audio for easy listening
- Can be called at any workflow stage

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad request (e.g., missing required data)
- `500` - Server error (API failures, processing errors)

Error responses include details:
```json
{
  "error": "Description of error",
  "details": "Technical details"
}
```

## Frontend Integration

The backend uses CORS to allow frontend connections. Connect your React dashboard to these endpoints to:
- Display workflow progress
- Show plan steps
- Present research findings
- Display email drafts
- Play voice reports

## Development Notes

- The system uses Claude Sonnet 3.5 by default
- Supplier data is loaded from JSON (simulating CRM)
- All agents use streaming-capable Claude API
- Voice synthesis uses ElevenLabs' Rachel voice
- State is stored in-memory (resets on server restart)

## Next Steps

To enhance the system:
1. Add database persistence for state
2. Implement actual email sending
3. Add authentication/authorization
4. Create frontend UI components
5. Add more sophisticated agent prompts
6. Implement agent memory and context
