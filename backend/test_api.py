"""
Test script to verify the backend API and all agent functionality
"""
import requests
import json
import time

API_URL = "http://127.0.0.1:5000"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_health_check():
    print_section("1. Testing Health Check")
    try:
        response = requests.get(f"{API_URL}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_root_endpoint():
    print_section("2. Testing Root Endpoint")
    try:
        response = requests.get(f"{API_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_get_state():
    print_section("3. Testing Get State")
    try:
        response = requests.get(f"{API_URL}/api/state")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_submit_goal():
    print_section("4. Testing Submit Goal (Planner Agent)")
    goal = "Identify top-rated electronics suppliers for potential partnership"
    
    try:
        response = requests.post(
            f"{API_URL}/api/submit-goal",
            json={"goal": goal},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"✅ Goal submitted successfully!")
            print(f"Status: {data['state']['status']}")
            print(f"Plan Steps: {len(data['state']['plan'])}")
            for step in data['state']['plan']:
                print(f"  - Step {step['step_number']}: {step['title']}")
            return True
        else:
            print(f"❌ Error: {data.get('error')}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_execute_research():
    print_section("5. Testing Execute Research (Researcher Agent)")
    
    try:
        response = requests.post(f"{API_URL}/api/execute-research")
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"✅ Research completed successfully!")
            print(f"Status: {data['state']['status']}")
            
            findings = data['state'].get('findings', {})
            if findings:
                print(f"\nFindings Summary: {findings.get('summary', 'N/A')}")
                print(f"Key Findings: {len(findings.get('key_findings', []))}")
                print(f"Relevant Suppliers: {len(findings.get('relevant_suppliers', []))}")
            return True
        else:
            print(f"❌ Error: {data.get('error')}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_approve_findings():
    print_section("6. Testing Approve Findings (Communicator Agent)")
    
    try:
        response = requests.post(
            f"{API_URL}/api/approve-findings",
            json={"approved": True},
            headers={"Content-Type": "application/json"}
        )
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"✅ Findings approved and emails drafted!")
            print(f"Status: {data['state']['status']}")
            
            drafts = data['state'].get('drafts', {})
            if drafts and 'emails' in drafts:
                print(f"Email Drafts Created: {len(drafts['emails'])}")
                for email in drafts['emails'][:2]:  # Show first 2
                    print(f"  - To: {email['supplier_name']} ({email['to']})")
                    print(f"    Subject: {email['subject']}")
            return True
        else:
            print(f"❌ Error: {data.get('error')}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_text_report():
    print_section("7. Testing Text Report (Reporter Agent)")
    
    try:
        response = requests.get(f"{API_URL}/api/get-text-report")
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"✅ Text report generated!")
            print(f"\nReport Preview:")
            print("-" * 60)
            print(data.get('report', 'N/A')[:300] + "...")
            print("-" * 60)
            return True
        else:
            print(f"❌ Error: {data.get('error')}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_voice_report():
    print_section("8. Testing Voice Report (Reporter Agent + ElevenLabs)")
    
    try:
        response = requests.get(f"{API_URL}/api/get-voice-report")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            audio_size = len(response.content)
            print(f"✅ Voice report generated!")
            print(f"Audio file size: {audio_size} bytes ({audio_size/1024:.2f} KB)")
            
            # Save the audio file
            with open("test_voice_report.mp3", "wb") as f:
                f.write(response.content)
            print(f"Audio saved to: test_voice_report.mp3")
            return True
        else:
            data = response.json()
            print(f"❌ Error: {data.get('error')}")
            print(f"Details: {data.get('details')}")
            if 'text_report' in data:
                print(f"Text fallback available")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_reset():
    print_section("9. Testing Reset Workflow")
    
    try:
        response = requests.post(f"{API_URL}/api/reset")
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"✅ Workflow reset successfully!")
            print(f"Status: {data['state']['status']}")
            return True
        else:
            print(f"❌ Error: {data.get('error')}")
            return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def run_all_tests():
    print("\n")
    print("🤖 SourceBot Backend API Test Suite")
    print("=" * 60)
    
    results = {
        "Health Check": test_health_check(),
        "Root Endpoint": test_root_endpoint(),
        "Get State": test_get_state(),
        "Submit Goal (Planner)": test_submit_goal(),
    }
    
    # Wait a bit for async processing
    print("\n⏳ Waiting 2 seconds before research...")
    time.sleep(2)
    
    results["Execute Research (Researcher)"] = test_execute_research()
    
    print("\n⏳ Waiting 2 seconds before approval...")
    time.sleep(2)
    
    results["Approve Findings (Communicator)"] = test_approve_findings()
    
    print("\n⏳ Waiting 2 seconds before reports...")
    time.sleep(2)
    
    results["Text Report (Reporter)"] = test_text_report()
    results["Voice Report (Reporter + ElevenLabs)"] = test_voice_report()
    results["Reset Workflow"] = test_reset()
    
    # Summary
    print("\n" + "=" * 60)
    print("  TEST SUMMARY")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    total = len(results)
    passed = sum(results.values())
    print("\n" + "=" * 60)
    print(f"Results: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    print("=" * 60)
    
    return passed == total

if __name__ == "__main__":
    try:
        success = run_all_tests()
        exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
        exit(1)
    except Exception as e:
        print(f"\n\n❌ Fatal error: {str(e)}")
        exit(1)
