"""
Quick API checker - verifies server is running and dependencies are installed
"""
import sys
import subprocess
import importlib

def check_dependencies():
    """Check if all required packages are installed"""
    print("🔍 Checking Dependencies...")
    print("-" * 60)
    
    required_packages = {
        'flask': 'Flask',
        'flask_cors': 'flask-cors',
        'anthropic': 'anthropic',
        'dotenv': 'python-dotenv',
        'requests': 'requests'
    }
    
    missing = []
    
    for module, package in required_packages.items():
        try:
            importlib.import_module(module)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - NOT INSTALLED")
            missing.append(package)
    
    if missing:
        print("\n⚠️  Missing packages detected!")
        print("\nTo install missing packages, run:")
        print(f"pip install {' '.join(missing)}")
        return False
    else:
        print("\n✅ All dependencies installed!")
        return True

def check_env_file():
    """Check if api.env file exists and has required keys"""
    print("\n🔍 Checking Environment Configuration...")
    print("-" * 60)
    
    import os
    from pathlib import Path
    
    env_path = Path(__file__).parent.parent / 'api.env'
    
    if not env_path.exists():
        print(f"❌ api.env file not found at: {env_path}")
        return False
    
    print(f"✅ api.env file found")
    
    # Load and check keys
    from dotenv import load_dotenv
    load_dotenv(env_path)
    
    required_keys = ['ANTHROPIC_API_KEY', 'ELEVENLABS_API_KEY']
    missing_keys = []
    
    for key in required_keys:
        value = os.getenv(key)
        if value:
            print(f"✅ {key}: {value[:20]}...")
        else:
            print(f"❌ {key}: NOT SET")
            missing_keys.append(key)
    
    if missing_keys:
        print(f"\n⚠️  Missing API keys: {', '.join(missing_keys)}")
        return False
    
    print("\n✅ All API keys configured!")
    return True

def check_server():
    """Check if Flask server is running"""
    print("\n🔍 Checking Server Status...")
    print("-" * 60)
    
    try:
        import requests
        response = requests.get('http://127.0.0.1:5000/api/health', timeout=5)
        
        if response.status_code == 200:
            print("✅ Server is running on http://127.0.0.1:5000")
            print(f"Response: {response.json()}")
            return True
        else:
            print(f"⚠️  Server responded with status code: {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Server is NOT running")
        print("\nTo start the server, run:")
        print("cd backend")
        print("python orchestrator.py")
        return False
    except Exception as e:
        print(f"❌ Error checking server: {str(e)}")
        return False

def check_data_file():
    """Check if suppliers data file exists"""
    print("\n🔍 Checking Data Files...")
    print("-" * 60)
    
    from pathlib import Path
    data_path = Path(__file__).parent.parent / 'data' / 'suppliers.json'
    
    if not data_path.exists():
        print(f"❌ suppliers_data.json not found at: {data_path}")
        return False
    
    print(f"✅ suppliers_data.json found")
    
    # Check if it's valid JSON
    import json
    try:
        with open(data_path, 'r') as f:
            data = json.load(f)
        print(f"✅ Valid JSON with {len(data)} suppliers")
        return True
    except Exception as e:
        print(f"❌ Invalid JSON: {str(e)}")
        return False

def main():
    print("\n🤖 SourceBot Backend Health Check")
    print("=" * 60)
    
    checks = {
        "Dependencies": check_dependencies(),
        "Environment": check_env_file(),
        "Data Files": check_data_file(),
        "Server": check_server()
    }
    
    print("\n" + "=" * 60)
    print("  HEALTH CHECK SUMMARY")
    print("=" * 60)
    
    for check_name, passed in checks.items():
        status = "✅ OK" if passed else "❌ FAIL"
        print(f"{status} - {check_name}")
    
    all_passed = all(checks.values())
    
    print("\n" + "=" * 60)
    if all_passed:
        print("✅ ALL CHECKS PASSED - System is ready!")
        print("\nYou can now:")
        print("1. Open dashboard.html in your browser")
        print("2. Run full tests: python backend/test_api.py")
    else:
        print("⚠️  SOME CHECKS FAILED - Please fix the issues above")
    print("=" * 60)
    
    return all_passed

if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Fatal error: {str(e)}")
        sys.exit(1)
