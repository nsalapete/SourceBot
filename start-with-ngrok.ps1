# SourceBot - Quick Start with Ngrok

Write-Host "🚀 SourceBot - Starting with Ngrok..." -ForegroundColor Cyan

# Check if .env exists
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Created .env file. Please edit it with your ngrok URL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Steps:" -ForegroundColor Cyan
    Write-Host "1. Run 'ngrok http 5000' in a separate terminal" -ForegroundColor White
    Write-Host "2. Copy the https://... URL from ngrok" -ForegroundColor White
    Write-Host "3. Edit .env and set VITE_NGROK_URL=your-ngrok-url" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    exit
}

# Check if ngrok is running
Write-Host "🔍 Checking ngrok status..." -ForegroundColor Cyan
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    $tunnelUrl = $ngrokApi.tunnels[0].public_url
    Write-Host "✅ ngrok is running: $tunnelUrl" -ForegroundColor Green
} catch {
    Write-Host "⚠️  ngrok not detected on localhost:4040" -ForegroundColor Yellow
    Write-Host "Make sure to run: ngrok http 5000" -ForegroundColor White
}

# Check if backend is running
Write-Host "🔍 Checking Flask backend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -TimeoutSec 3 -ErrorAction Stop
    Write-Host "✅ Flask backend is running on port 5000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Flask backend not detected on port 5000" -ForegroundColor Yellow
    Write-Host "Start it with: python backend/orchestrator.py" -ForegroundColor White
}

Write-Host ""
Write-Host "🎨 Starting Lovable frontend..." -ForegroundColor Cyan
Write-Host ""

# Start the frontend
npm run dev
