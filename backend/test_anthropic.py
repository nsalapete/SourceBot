"""
Test Anthropic/Claude Integration
"""
import anthropic
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent / 'api.env'
load_dotenv(env_path)

def test_anthropic():
    """Test Anthropic Claude API"""
    
    api_key = os.getenv('ANTHROPIC_API_KEY')
    model = os.getenv('CLAUDE_MODEL', 'claude-3-5-sonnet-20240620')
    
    if not api_key:
        print("❌ ANTHROPIC_API_KEY not found in environment")
        return False
    
    print("🔍 Testing Anthropic/Claude Integration...")
    print("-" * 60)
    print(f"API Key: {api_key[:20]}...")
    print(f"Model: {model}")
    
    try:
        # Initialize client
        client = anthropic.Anthropic(api_key=api_key)
        print("✅ Client initialized")
        
        # Test prompt
        test_prompt = "Respond with exactly: 'Claude API is working correctly!'"
        
        print(f"\n📝 Sending test message to Claude...")
        
        # Create message
        message = client.messages.create(
            model=model,
            max_tokens=100,
            messages=[
                {"role": "user", "content": test_prompt}
            ]
        )
        
        response_text = message.content[0].text
        
        print(f"✅ Response received!")
        print(f"\nClaude says: {response_text}")
        print(f"\nMessage ID: {message.id}")
        print(f"Model used: {message.model}")
        print(f"Tokens used: input={message.usage.input_tokens}, output={message.usage.output_tokens}")
        
        return True
        
    except anthropic.AuthenticationError as e:
        print(f"❌ Authentication Error: {str(e)}")
        print("   Check that your API key is valid")
        return False
    except anthropic.BadRequestError as e:
        print(f"❌ Bad Request Error: {str(e)}")
        print("   Check that the model name is correct")
        return False
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_planner_agent():
    """Test the Planner agent"""
    print("\n🔍 Testing Planner Agent...")
    print("-" * 60)
    
    try:
        from planner import create_plan
        
        api_key = os.getenv('ANTHROPIC_API_KEY')
        model = os.getenv('CLAUDE_MODEL', 'claude-3-5-sonnet-20240620')
        
        goal = "Find top 3 electronics suppliers for partnership"
        
        print(f"Goal: {goal}")
        print("Calling planner agent...")
        
        result = create_plan(goal, api_key, model)
        
        if result.get('success'):
            plan = result['plan']
            print(f"✅ Planner created {len(plan)} steps!")
            for step in plan:
                print(f"   {step['step_number']}. {step['title']}")
            return True
        else:
            print(f"❌ Planner failed: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_researcher_agent():
    """Test the Researcher agent"""
    print("\n🔍 Testing Researcher Agent...")
    print("-" * 60)
    
    try:
        from researcher import load_suppliers_from_file, analyze_suppliers
        
        api_key = os.getenv('ANTHROPIC_API_KEY')
        model = os.getenv('CLAUDE_MODEL', 'claude-3-5-sonnet-20240620')
        
        # Load suppliers
        suppliers_file = Path(__file__).parent.parent / 'data' / 'suppliers.json'
        suppliers_result = load_suppliers_from_file(str(suppliers_file))
        
        if not suppliers_result.get('success'):
            print(f"❌ Failed to load suppliers: {suppliers_result.get('error')}")
            return False
        
        suppliers = suppliers_result['suppliers']
        print(f"Loaded {len(suppliers)} suppliers")
        
        goal = "Find high-rated electronics suppliers"
        print(f"Goal: {goal}")
        print("Analyzing suppliers...")
        
        result = analyze_suppliers(goal, suppliers, api_key, model)
        
        if result.get('success'):
            findings = result['findings']
            print(f"✅ Research completed!")
            print(f"   Summary: {findings.get('summary', 'N/A')[:100]}...")
            print(f"   Key findings: {len(findings.get('key_findings', []))}")
            print(f"   Relevant suppliers: {len(findings.get('relevant_suppliers', []))}")
            return True
        else:
            print(f"❌ Research failed: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_communicator_agent():
    """Test the Communicator agent"""
    print("\n🔍 Testing Communicator Agent...")
    print("-" * 60)
    
    try:
        from communicator import draft_emails
        
        api_key = os.getenv('ANTHROPIC_API_KEY')
        model = os.getenv('CLAUDE_MODEL', 'claude-3-5-sonnet-20240620')
        
        goal = "Partner with top electronics suppliers"
        findings = {
            "summary": "Found 3 highly-rated electronics suppliers",
            "key_findings": ["High ratings", "Good prices"]
        }
        relevant_suppliers = [
            {"id": "SUP-001", "name": "Test Supplier", "contact": {"email": "test@example.com"}}
        ]
        
        print("Drafting emails...")
        
        result = draft_emails(goal, findings, relevant_suppliers, api_key, model)
        
        if result.get('success'):
            drafts = result['drafts']
            print(f"✅ Emails drafted!")
            if 'emails' in drafts:
                print(f"   Number of emails: {len(drafts['emails'])}")
                if drafts['emails']:
                    print(f"   First email subject: {drafts['emails'][0].get('subject', 'N/A')}")
            return True
        else:
            print(f"❌ Email drafting failed: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_reporter_agent():
    """Test the Reporter agent"""
    print("\n🔍 Testing Reporter Agent...")
    print("-" * 60)
    
    try:
        from reporter import generate_status_report
        
        api_key = os.getenv('ANTHROPIC_API_KEY')
        model = os.getenv('CLAUDE_MODEL', 'claude-3-5-sonnet-20240620')
        
        state = {
            "goal": "Test goal",
            "status": "completed",
            "current_step": 4,
            "plan": [{"step_number": 1, "title": "Test step"}]
        }
        
        print("Generating status report...")
        
        result = generate_status_report(state, api_key, model)
        
        if result.get('success'):
            report = result['report']
            print(f"✅ Status report generated!")
            print(f"   Report length: {len(report)} characters")
            print(f"   Preview: {report[:150]}...")
            return True
        else:
            print(f"❌ Report generation failed: {result.get('error')}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("\n🤖 Anthropic/Claude Integration Test Suite")
    print("=" * 60)
    
    results = {
        "Basic API Connection": test_anthropic(),
        "Planner Agent": test_planner_agent(),
        "Researcher Agent": test_researcher_agent(),
        "Communicator Agent": test_communicator_agent(),
        "Reporter Agent": test_reporter_agent()
    }
    
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
    
    if passed == total:
        print("✅ All Anthropic/Claude integrations working!")
    else:
        print("⚠️  Some tests failed - check errors above")
    print("=" * 60)
