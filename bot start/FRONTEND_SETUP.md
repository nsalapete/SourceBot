# SourceBot Frontend Setup Guide

## Quick Start

### 1. Install Dependencies

```powershell
cd frontend
npm install
```

### 2. Start the Backend Server

In one terminal:
```powershell
cd backend
pip install -r requirements.txt
python orchestrator.py
```

The backend will run on `http://localhost:5000`

### 3. Start the Frontend

In another terminal:
```powershell
cd frontend
npm start
```

The frontend will automatically open at `http://localhost:3000`

## Features

### 🎯 Goal Submission
- Enter your business goal in the text area
- Click "Start Workflow" to begin the multi-agent process
- The system automatically progresses through planning and research phases

### 📊 Visual Workflow Tracking
- **Status Badge**: Shows current workflow state with color coding
- **Action Plan**: Visual progress through each step
- **Statistics Dashboard**: Key metrics displayed in cards

### 🔍 Research Findings
- **Summary**: High-level overview of findings
- **Key Findings**: Bulleted list of important discoveries
- **Relevant Suppliers**: Cards showing matched suppliers with reasons
- **Recommendations**: AI-generated action items

### ✅ Human-in-the-Loop Approval
- Review research findings before proceeding
- Approve or reject to continue/stop the workflow
- Clear approval buttons when findings are ready

### ✉️ Email Drafts
- View personalized email drafts for each supplier
- Professional formatting with subject and body
- Context-aware content based on research

### 🎙️ Voice Reports
- Generate audio status updates at any time
- Text-to-speech powered by ElevenLabs
- Download MP3 files
- Fallback to text reports if audio fails

### 🔄 Workflow Control
- Reset button to start fresh
- Real-time state updates
- Error handling with user-friendly messages

## UI Components

### Dashboard.js
Main container managing the entire workflow:
- Goal submission form
- Orchestrates API calls
- State management
- Error handling

### StatusView.js
Displays workflow progress and data:
- Status badge with color coding
- Plan steps visualization
- Research findings display
- Email drafts presentation
- Approval interface

### VoiceReport.js
Audio reporting functionality:
- Voice report generation
- Audio player with controls
- Text report fallback
- Download capability

## API Integration

The frontend communicates with these backend endpoints:

```javascript
POST /api/submit-goal        // Submit new goal
POST /api/execute-research   // Run research phase
POST /api/approve-findings   // Approve/reject findings
GET  /api/get-voice-report   // Generate audio report
GET  /api/get-text-report    // Get text-only report
GET  /api/state              // Get current state
POST /api/reset              // Reset workflow
```

## Styling

The application uses:
- **Gradient backgrounds**: Purple/blue theme
- **Card-based layout**: Clean, modern design
- **Responsive design**: Works on mobile and desktop
- **Animations**: Smooth transitions and feedback
- **Color coding**: Status-based visual indicators

## Status Colors

- **Idle**: Gray (#6c757d)
- **Planning**: Yellow (#ffc107)
- **Planned**: Cyan (#17a2b8)
- **Researching**: Blue (#007bff)
- **Awaiting Approval**: Orange (#fd7e14)
- **Drafting**: Teal (#20c997)
- **Completed**: Green (#28a745)
- **Error**: Red (#dc3545)

## Example Usage Flow

1. **Start**: User enters goal like "Find top electronics suppliers"
2. **Planning**: System creates 4-step plan automatically
3. **Research**: Loads and analyzes 100+ suppliers
4. **Review**: User sees findings with stats, insights, recommendations
5. **Approve**: User clicks "Approve & Continue"
6. **Drafting**: System generates personalized emails
7. **Report**: User can request voice status update anytime

## Troubleshooting

### Frontend won't start
```powershell
rm -r node_modules
npm install
npm start
```

### Can't connect to backend
- Ensure backend is running on port 5000
- Check `package.json` has proxy: `"http://localhost:5000"`
- Verify no CORS errors in browser console

### Voice reports fail
- Check ElevenLabs API key in `api.env`
- Verify API key has credits
- Use text report as alternative

### State not updating
- Check browser console for errors
- Verify backend is processing requests
- Try resetting the workflow

## Development

To modify the UI:
1. Edit component files in `src/components/`
2. Update styles in corresponding `.css` files
3. Changes auto-reload with hot module replacement

To add new features:
1. Add new component in `src/components/`
2. Import and use in `Dashboard.js`
3. Create corresponding `.css` file
4. Connect to backend API endpoints

## Production Build

```powershell
npm run build
```

Creates optimized production build in `build/` folder.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
