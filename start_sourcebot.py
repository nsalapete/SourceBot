"""
SourceBot Complete System Startup Script
Launches all services: Notification System, Orchestrator, and Dashboard
"""
import subprocess
import sys
import time
import webbrowser
import os
from pathlib import Path

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(70)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*70}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKBLUE}→ {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

def check_env_file():
    """Check if api.env exists and has required keys"""
    env_file = Path("api.env")
    if not env_file.exists():
        print_error("api.env file not found!")
        print_info("Please create api.env with your API keys:")
        print("  ANTHROPIC_API_KEY=your_key")
        print("  ELEVENLABS_API_KEY=your_key")
        return False
    
    print_success("api.env file found")
    
    # Check for required keys
    with open(env_file, 'r') as f:
        content = f.read()
        
    missing_keys = []
    if 'ANTHROPIC_API_KEY' not in content:
        missing_keys.append('ANTHROPIC_API_KEY')
    if 'ELEVENLABS_API_KEY' not in content:
        missing_keys.append('ELEVENLABS_API_KEY')
    
    if missing_keys:
        print_warning(f"Missing API keys: {', '.join(missing_keys)}")
        print_info("Some features may not work without these keys")
    else:
        print_success("All required API keys found")
    
    return True

def start_service(name, command, port, wait_time=3):
    """Start a background service"""
    print_info(f"Starting {name} on port {port}...")
    
    try:
        # Start process in background
        if sys.platform == 'win32':
            process = subprocess.Popen(
                command,
                shell=True,
                creationflags=subprocess.CREATE_NEW_CONSOLE
            )
        else:
            process = subprocess.Popen(
                command,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
        
        # Wait for service to start
        time.sleep(wait_time)
        
        # Check if process is still running
        if process.poll() is None:
            print_success(f"{name} started successfully (PID: {process.pid})")
            print_info(f"   Running on http://localhost:{port}")
            return process
        else:
            print_error(f"{name} failed to start")
            return None
            
    except Exception as e:
        print_error(f"Error starting {name}: {e}")
        return None

def open_dashboards():
    """Open both dashboards in browser"""
    print_info("Opening dashboards in browser...")
    
    time.sleep(2)  # Wait for services to be fully ready
    
    try:
        # Open main workflow dashboard
        webbrowser.open('file://' + os.path.abspath('dashboard.html'))
        print_success("Opened workflow dashboard")
        
        time.sleep(1)
        
        # Open notification dashboard
        webbrowser.open('file://' + os.path.abspath('notification_dashboard.html'))
        print_success("Opened notification dashboard")
        
    except Exception as e:
        print_warning(f"Could not auto-open dashboards: {e}")
        print_info("Please open manually:")
        print(f"   - Workflow: file://{os.path.abspath('dashboard.html')}")
        print(f"   - Notifications: file://{os.path.abspath('notification_dashboard.html')}")

def main():
    print_header("SOURCEBOT - COMPLETE SYSTEM STARTUP")
    
    # Check environment
    if not check_env_file():
        print_error("\nCannot start without api.env file. Exiting...")
        return
    
    print("\n" + "="*70)
    print("Starting Services...")
    print("="*70 + "\n")
    
    processes = []
    
    # 1. Start Notification System (Port 5001)
    print_info("Service 1/2: Notification System")
    notification_process = start_service(
        "Notification System",
        "python backend/notification_system.py",
        5001,
        wait_time=4
    )
    if notification_process:
        processes.append(notification_process)
    
    # 2. Start Orchestrator (Port 5000)
    print_info("\nService 2/2: Orchestrator")
    orchestrator_process = start_service(
        "Orchestrator",
        "python backend/orchestrator.py",
        5000,
        wait_time=3
    )
    if orchestrator_process:
        processes.append(orchestrator_process)
    
    # Check if all services started
    if len(processes) < 2:
        print_error("\n⚠ Not all services started successfully!")
        print_info("Please check the error messages above and try again.")
        return
    
    # Open dashboards
    print("\n" + "="*70)
    print("Opening Dashboards...")
    print("="*70 + "\n")
    
    open_dashboards()
    
    # Print final status
    print("\n" + "="*70)
    print_header("SOURCEBOT IS READY!")
    
    print(f"{Colors.OKGREEN}All services are running:{Colors.ENDC}\n")
    print(f"  {Colors.OKCYAN}📡 Notification System:{Colors.ENDC}  http://localhost:5001")
    print(f"  {Colors.OKCYAN}🤖 Orchestrator:{Colors.ENDC}         http://localhost:5000")
    print(f"  {Colors.OKCYAN}📊 Workflow Dashboard:{Colors.ENDC}   dashboard.html")
    print(f"  {Colors.OKCYAN}🔔 Notifications:{Colors.ENDC}        notification_dashboard.html")
    
    print(f"\n{Colors.WARNING}What you can do now:{Colors.ENDC}")
    print("  1. Open workflow dashboard to submit goals and manage workflows")
    print("  2. Open notification dashboard to receive voice alerts")
    print("  3. Test the system with: python backend/notification_examples.py")
    
    print(f"\n{Colors.WARNING}To stop all services:{Colors.ENDC}")
    print("  - Close all the console windows that were opened")
    print("  - Or press Ctrl+C in each terminal")
    
    print(f"\n{Colors.OKBLUE}Services will continue running in background...{Colors.ENDC}")
    print(f"{Colors.OKBLUE}Keep this window open to see the status.{Colors.ENDC}\n")
    
    print("="*70)
    
    # Keep script running
    try:
        print("\nPress Ctrl+C to view shutdown instructions...")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print(f"\n\n{Colors.WARNING}To stop services:{Colors.ENDC}")
        print("  1. Close the notification_system console window")
        print("  2. Close the orchestrator console window")
        print("  Or run: taskkill /F /IM python.exe (kills all Python processes)")
        print("\nServices are still running in background.")

if __name__ == "__main__":
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    main()
