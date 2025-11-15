"""
Quick System Check - Verifies all components are properly configured
"""
import os
from pathlib import Path
import importlib.util

print("="*70)
print("SOURCEBOT SYSTEM CHECK".center(70))
print("="*70)

# Check 1: Environment file
print("\n[1/6] Checking api.env...")
env_file = Path("api.env")
if env_file.exists():
    print("  ✓ api.env found")
    with open(env_file, 'r') as f:
        content = f.read()
        keys_found = []
        if 'ANTHROPIC_API_KEY' in content:
            keys_found.append('ANTHROPIC_API_KEY')
        if 'ELEVENLABS_API_KEY' in content:
            keys_found.append('ELEVENLABS_API_KEY')
        if 'CLAUDE_MODEL' in content:
            keys_found.append('CLAUDE_MODEL')
        print(f"  ✓ Found keys: {', '.join(keys_found)}")
else:
    print("  ✗ api.env NOT FOUND")

# Check 2: Backend files
print("\n[2/6] Checking backend files...")
backend_files = [
    'backend/orchestrator.py',
    'backend/planner.py',
    'backend/researcher.py',
    'backend/communicator.py',
    'backend/reporter.py',
    'backend/notification_system.py'
]
for file in backend_files:
    if Path(file).exists():
        print(f"  ✓ {file}")
    else:
        print(f"  ✗ {file} NOT FOUND")

# Check 3: Data files
print("\n[3/6] Checking data files...")
data_files = [
    'data/suppliers.json',
    'data/suppliers_data.json'
]
for file in data_files:
    if Path(file).exists():
        file_size = Path(file).stat().st_size
        print(f"  ✓ {file} ({file_size} bytes)")
    else:
        print(f"  ✗ {file} NOT FOUND")

# Check 4: Frontend files
print("\n[4/6] Checking frontend files...")
frontend_files = [
    'dashboard.html',
    'notification_dashboard.html'
]
for file in frontend_files:
    if Path(file).exists():
        print(f"  ✓ {file}")
    else:
        print(f"  ✗ {file} NOT FOUND")

# Check 5: Python packages
print("\n[5/6] Checking Python packages...")
required_packages = {
    'flask': 'Flask',
    'flask_cors': 'Flask-CORS',
    'anthropic': 'Anthropic',
    'elevenlabs': 'ElevenLabs',
    'dotenv': 'python-dotenv'
}

for module_name, display_name in required_packages.items():
    try:
        spec = importlib.util.find_spec(module_name)
        if spec:
            print(f"  ✓ {display_name}")
        else:
            print(f"  ✗ {display_name} NOT INSTALLED")
    except:
        print(f"  ✗ {display_name} NOT INSTALLED")

# Check 6: Port availability
print("\n[6/6] Checking port availability...")
import socket

def check_port(port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', port))
    sock.close()
    return result != 0  # True if port is available

ports = {
    5000: 'Orchestrator',
    5001: 'Notification System'
}

for port, service in ports.items():
    if check_port(port):
        print(f"  ✓ Port {port} available for {service}")
    else:
        print(f"  ⚠ Port {port} already in use (may need to stop existing {service})")

# Summary
print("\n" + "="*70)
print("SYSTEM CHECK COMPLETE".center(70))
print("="*70)

print("\n🚀 Ready to start SourceBot!")
print("\nTo start the complete system:")
print("  python start_sourcebot.py")
print("\nOr start services individually:")
print("  Terminal 1: python backend/notification_system.py")
print("  Terminal 2: python backend/orchestrator.py")
print("  Then open: dashboard.html and notification_dashboard.html")

print("\n" + "="*70)
