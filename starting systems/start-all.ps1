# SourceBot - Complete Development Setup

Write-Host "🚀 SourceBot - Complete Setup" -ForegroundColor Cyan
Write-Host "This will start all components: Backend + ngrok + Frontend" -ForegroundColor White
Write-Host ""

# Function to start process in new window
function Start-InNewWindow {
    param(
        [string]$Title,
        [string]$Command
    )
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '$Title' -ForegroundColor Cyan; $Command"
}

# Check if ngrok is installed
Write-Host "🔍 Checking ngrok installation..." -ForegroundColor Cyan
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue
if (-Not $ngrokInstalled) {
    Write-Host "❌ ngrok not found. Please install it from https://ngrok.com/download" -ForegroundColor Red
    exit
}
Write-Host "✅ ngrok is installed" -ForegroundColor Green

# Check if Python is available
Write-Host "🔍 Checking Python..." -ForegroundColor Cyan
$pythonInstalled = Get-Command python -ErrorAction SilentlyContinue
if (-Not $pythonInstalled) {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit
}
Write-Host "✅ Python is installed" -ForegroundColor Green

# Check if Node.js is available
Write-Host "🔍 Checking Node.js..." -ForegroundColor Cyan
$nodeInstalled = Get-Command node -ErrorAction SilentlyContinue
if (-Not $nodeInstalled) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit
}
Write-Host "✅ Node.js is installed" -ForegroundColor Green

Write-Host ""
Write-Host "📦 Starting components..." -ForegroundColor Cyan
Write-Host ""

# Start Flask Backend
Write-Host "1️⃣  Starting Flask Backend..." -ForegroundColor Yellow
Start-InNewWindow "🐍 Flask Backend (Port 5000)" "cd '$PSScriptRoot'; python backend/orchestrator.py"
Start-Sleep -Seconds 3

# Start ngrok
Write-Host "2️⃣  Starting ngrok tunnel..." -ForegroundColor Yellow
Start-InNewWindow "🌐 ngrok Tunnel" "ngrok http 5000"
Start-Sleep -Seconds 3

# Get ngrok URL
Write-Host "3️⃣  Getting ngrok URL..." -ForegroundColor Yellow
try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -ErrorAction Stop
    $tunnelUrl = $ngrokApi.tunnels[0].public_url
    Write-Host "✅ ngrok URL: $tunnelUrl" -ForegroundColor Green
    
    # Update .env file
    if (Test-Path ".env") {
        $envContent = Get-Content ".env"
        $envContent = $envContent -replace "VITE_NGROK_URL=.*", "VITE_NGROK_URL=$tunnelUrl"
        $envContent | Set-Content ".env"
        Write-Host "✅ Updated .env with ngrok URL" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Could not get ngrok URL automatically" -ForegroundColor Yellow
}

# Start Frontend
Write-Host "4️⃣  Starting Frontend..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host ""
Write-Host "🎉 All components started!" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application at:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
if ($tunnelUrl) {
    Write-Host "  ngrok:    $tunnelUrl" -ForegroundColor White
}
Write-Host ""

# Start frontend in current window
npm run dev
