import os
import sys
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), '..', 'api.env')
load_dotenv(env_path)

from planner import create_plan

api_key = os.getenv('ANTHROPIC_API_KEY')
model = os.getenv('CLAUDE_MODEL', 'claude-sonnet-4-5-20250929')

print(f"API Key: {api_key[:20] if api_key else 'None'}...")
print(f"Model: {model}")
print(f"Env file path: {env_path}")
print(f"Env file exists: {os.path.exists(env_path)}")

result = create_plan('Identify top-rated electronics suppliers for potential partnership', api_key, model)
print(f"\nSuccess: {result.get('success')}")
if result.get('success'):
    print(f"Plan steps: {len(result.get('plan', []))}")
else:
    print(f"Error: {result.get('error')}")
    if 'details' in result:
        print(f"Details: {result.get('details')}")
