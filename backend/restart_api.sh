#!/bin/bash
# filepath: c:\Users\nsala\OneDrive\Documents\ESSEC\Hackaton\SourceBot\restart_api.sh

set -e  # Exit on any error

echo "🔄 API Restart Script Starting..."

# Function to check if process is running on port
check_port() {
    local port=$1
    if command -v netstat >/dev/null 2>&1; then
        netstat -tuln | grep ":$port " >/dev/null 2>&1
    elif command -v ss >/dev/null 2>&1; then
        ss -tuln | grep ":$port " >/dev/null 2>&1
    else
        return 1
    fi
}

# Function to kill Python processes
kill_python_processes() {
    echo "🔪 Killing existing Python processes..."
    
    # Kill by process name
    pkill -f "orchestrator.py" 2>/dev/null || true
    pkill -f "python.*backend" 2>/dev/null || true
    
    # Wait a moment
    sleep 2
    
    # Force kill if still running
    pkill -9 -f "orchestrator.py" 2>/dev/null || true
    pkill -9 -f "python.*backend" 2>/dev/null || true
    
    sleep 1
    echo "✅ Python processes terminated"
}

# Function to clear cache
clear_cache() {
    echo "🧹 Clearing cache..."
    
    # Clear Python cache
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true
    find . -name "*.pyo" -delete 2>/dev/null || true
    
    # Clear any temp files
    rm -rf /tmp/sourcebot_* 2>/dev/null || true
    rm -rf temp/ 2>/dev/null || true
    rm -rf .cache/ 2>/dev/null || true
    
    echo "✅ Cache cleared"
}

# Function to reload environment
reload_env() {
    echo "🔧 Reloading environment variables..."
    
    if [ -f "api.env" ]; then
        echo "📝 Loading api.env..."
        export $(grep -v '^#' api.env | xargs)
        echo "✅ Environment variables loaded"
    else
        echo "⚠️  Warning: api.env file not found"
    fi
    
    if [ -f ".env" ]; then
        echo "📝 Loading .env..."
        export $(grep -v '^#' .env | xargs)
    fi
}

# Function to validate API key
validate_api_key() {
    if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ] && [ -z "$GOOGLE_API_KEY" ]; then
        echo "❌ Error: No API keys found in environment"
        echo "Please check your api.env file"
        exit 1
    fi
    
    if [ ! -z "$OPENAI_API_KEY" ]; then
        echo "✅ OpenAI API key detected"
    fi
    
    if [ ! -z "$ANTHROPIC_API_KEY" ]; then
        echo "✅ Anthropic API key detected"
    fi
    
    if [ ! -z "$GOOGLE_API_KEY" ]; then
        echo "✅ Google API key detected"
    fi
}

# Function to start orchestrator
start_orchestrator() {
    echo "🚀 Starting orchestrator..."
    
    # Check if backend directory exists
    if [ ! -f "backend/orchestrator.py" ]; then
        echo "❌ Error: backend/orchestrator.py not found"
        exit 1
    fi
    
    # Start in background
    nohup python backend/orchestrator.py > orchestrator.log 2>&1 &
    ORCHESTRATOR_PID=$!
    
    echo "📝 Orchestrator started with PID: $ORCHESTRATOR_PID"
    echo "📄 Logs: tail -f orchestrator.log"
    
    # Wait for service to be ready
    echo "⏳ Waiting for service to start..."
    for i in {1..30}; do
        if check_port 5001; then
            echo "✅ Service is ready on port 5001"
            return 0
        fi
        echo "   Attempt $i/30 - waiting..."
        sleep 1
    done
    
    echo "❌ Error: Service failed to start after 30 seconds"
    echo "📄 Check logs: cat orchestrator.log"
    exit 1
}

# Function to test API
test_api() {
    echo "🧪 Testing API..."
    
    if [ -f "backend/test_api.py" ]; then
        python backend/test_api.py
        if [ $? -eq 0 ]; then
            echo "✅ API tests passed"
        else
            echo "❌ API tests failed"
            exit 1
        fi
    else
        # Simple HTTP test
        echo "📡 Testing HTTP endpoint..."
        if command -v curl >/dev/null 2>&1; then
            response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5001/ || echo "000")
            if [ "$response" = "200" ] || [ "$response" = "404" ]; then
                echo "✅ HTTP endpoint responding"
            else
                echo "❌ HTTP endpoint not responding (code: $response)"
                exit 1
            fi
        else
            echo "⚠️  curl not available, skipping HTTP test"
        fi
    fi
}

# Main execution
main() {
    echo "=================================="
    echo "🤖 SourceBot API Restart Script"
    echo "=================================="
    
    # Change to script directory
    cd "$(dirname "$0")"
    
    # Step 1: Kill existing processes
    kill_python_processes
    
    # Step 2: Clear cache
    clear_cache
    
    # Step 3: Reload environment
    reload_env
    
    # Step 4: Validate API keys
    validate_api_key
    
    # Step 5: Start orchestrator
    start_orchestrator
    
    # Step 6: Test API
    test_api
    
    echo "=================================="
    echo "🎉 API restart completed successfully!"
    echo "🌐 Service running on: http://localhost:5001"
    echo "📄 Logs: tail -f orchestrator.log"
    echo "🛑 To stop: pkill -f orchestrator.py"
    echo "=================================="
}

# Handle script arguments
case "${1:-}" in
    "stop")
        echo "🛑 Stopping services..."
        kill_python_processes
        echo "✅ Services stopped"
        exit 0
        ;;
    "logs")
        echo "📄 Showing logs..."
        tail -f orchestrator.log 2>/dev/null || echo "No log file found"
        exit 0
        ;;
    "status")
        echo "📊 Checking service status..."
        if check_port 5001; then
            echo "✅ Service is running on port 5001"
        else
            echo "❌ Service is not running"
        fi
        exit 0
        ;;
    "test")
        echo "🧪 Running tests only..."
        test_api
        exit 0
        ;;
    *)
        main
        ;;
esac