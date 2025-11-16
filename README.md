# SourceBot - Multi-Agent Supplier Research Dashboard

A full-stack application that automates supplier research, evaluation, and outreach using multi-agent workflows and AI.

## Project Structure

```
SourceBot/
├── frontend/                          # React + Vite frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Pages/
│   │   │   │   └── app/
│   │   │   │       ├── SupplierDatabase.tsx    # Supplier database UI component
│   │   │   │       └── SupplierDatabase.css    # Supplier database styles
│   │   │   └── ... other shared components
│   │   ├── App.tsx                   # Main app component
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── package.json
│   ├── vite.config.ts                # Vite configuration with API proxy
│   └── tsconfig.json
├── backend/                           # Python backend services
│   ├── orchestrator.py                # Multi-agent orchestration
│   ├── planner.py                     # Research planning agent
│   ├── researcher.py                  # Research execution agent
│   ├── communicator.py                # Email drafting agent
│   ├── reporter.py                    # Report generation
│   └── requirements.txt               # Python dependencies
├── data/
│   └── Retail/
│       ├── inventory-analysis-results # Sample analysis outputs
│       └── *.csv                      # Sample datasets
├── server.js                          # Node.js Express API server (mock endpoints)
├── package.json                       # Root package.json (Node dependencies)
├── vite.config.ts                     # Vite config (root level)
├── dashboard.html                     # Legacy dashboard (optional)
└── README.md                          # This file
```

## Key Components

### Frontend (React + TypeScript + Vite)
- **SupplierDatabase**: Interactive supplier table with search, category/country filters, and ratings.
- **Vite Dev Server**: Runs on `http://localhost:5173` with hot module reload.
- **API Proxy**: Vite proxies `/api/*` requests to the backend (default: `http://localhost:5000`).

### Backend (Node.js + Express)
- **Mock API Server** (server.js): Provides endpoints for supplier data, research workflows, and state management.
- **Endpoints**:
  - `GET /api/state` — Current application state
  - `POST /api/submit-goal` — Submit a supplier research goal
  - `POST /api/execute-research` — Run research and generate findings
  - `POST /api/approve-findings` — Approve findings and generate email drafts
  - `POST /api/reset` — Reset application state
  - `GET /api/get-text-report` — Text summary report
  - `GET /api/get-voice-report` — WAV audio report

## Installation & Setup

### Prerequisites
- **Node.js** (v16+) and **npm** installed. Download from https://nodejs.org
- **Python** (v3.8+) for backend services (optional)

### 1. Install Backend Dependencies
```powershell
cd C:\Users\auphi\SourceBot
npm install
```

### 2. Install Frontend Dependencies
```powershell
cd C:\Users\auphi\SourceBot\frontend
npm install
```

### 3. Start the Backend Server
From project root:
```powershell
npm run start
# or for development with auto-reload:
npm run dev
```
The server will listen on `http://localhost:5000`.

### 4. Start the Frontend Dev Server
From frontend folder:
```powershell
npm run dev
```
The Vite app will start on `http://localhost:5173` and proxy API calls to the backend.

### 5. Open in Browser
Navigate to `http://localhost:5173` to access the SourceBot dashboard.

## Usage

### Frontend Workflow
1. **Enter Goal**: Type a supplier research goal (e.g., "Find electronics suppliers in APAC").
2. **View Plan**: The dashboard displays a multi-step research plan.
3. **Execute Research**: Click to run the research workflow and generate findings.
4. **Approve & Draft**: Review findings and approve to generate email drafts to suppliers.
5. **View Reports**: Export text or voice reports of the research summary.
6. **Supplier Database**: Browse, filter, and search the supplier database by category, country, and rating.

### API Integration (Python Example)
```python
import requests

# Fetch current state
response = requests.get('http://localhost:5000/api/state')
state = response.json()
print(state)

# Submit a research goal
goal_response = requests.post('http://localhost:5000/api/submit-goal', json={'goal': 'Find electronics suppliers'})
print(goal_response.json())

# Execute research
research_response = requests.post('http://localhost:5000/api/execute-research')
findings = research_response.json()
print(findings)
```

## Development

### File Modifications
- **Add UI Components**: Place new React components in `frontend/src/components/Pages/app/`.
- **Add API Endpoints**: Modify `server.js` to add new Express routes.
- **Styling**: Use component-level CSS (e.g., `SupplierDatabase.css`) or add to `frontend/src/index.css` for global styles.
- **Supplier Data**: Component pulls from `SAMPLE_SUPPLIERS` array in `SupplierDatabase.tsx`; wire to backend API as needed.

### Build for Production
```powershell
# Frontend
cd frontend
npm run build
# Output: frontend/dist/

# Backend
# Ensure server.js is configured for production (set NODE_ENV=production)
npm run start
```

## Troubleshooting

### npm not recognized
- Install Node.js from https://nodejs.org (LTS recommended).
- Add Node to PATH: `C:\Program Files\nodejs\`.
- Restart terminal and VS Code.
- If still failing in PowerShell, run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force`

### PowerShell Script Execution Error
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

### Port Already in Use
- Change port in `vite.config.ts` (frontend, default 5173) or `server.js` (backend, default 5000).

### API Proxy Not Working
- Ensure backend is running on `http://localhost:5000`.
- Check `vite.config.ts` proxy configuration points to correct target.

### Docker Issues
- Docker Desktop must be running to use Docker containers.
- For local development, install Node.js directly instead of using Docker.

## Environment Variables

### Frontend (.env in frontend/)
```
VITE_API_URL=http://localhost:5000
VITE_NGROK_URL=https://your-ngrok-url.ngrok.io  # Optional for remote access
```

### Backend (.env in root)
```
PORT=5000
NODE_ENV=development
```

## Components Added

### SupplierDatabase Component
- **Location**: `frontend/src/components/Pages/app/SupplierDatabase.tsx` and `.css`
- **Features**:
  - Search suppliers by name or email
  - Filter by category and country
  - Display rating, MOQ, lead time
  - Responsive table layout
  - Sample data with 5 electronics suppliers
- **Usage**: Import and render in any page component

## Future Enhancements
- Real supplier database integration (CRM sync).
- Multi-agent AI workflows (planning, research, drafting).
- Email service integration for automatic outreach.
- Advanced filtering and analytics dashboard.
- User authentication and data persistence.
- Pagination and sorting in SupplierDatabase component.

## License
MIT

## Support
For issues or questions, refer to the project documentation or contact the development team.