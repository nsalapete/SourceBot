import os
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), '..', 'api.env')
load_dotenv(env_path)

api_key = os.getenv('ANTHROPIC_API_KEY')
print(f"Full API Key: '{api_key}'")
print(f"Length: {len(api_key) if api_key else 0}")
print(f"Starts with: {api_key[:20] if api_key else 'None'}")
print(f"Ends with: {api_key[-10:] if api_key else 'None'}")

# Check for whitespace
if api_key:
    if api_key != api_key.strip():
        print("⚠️ API key has whitespace!")
        print(f"After strip: '{api_key.strip()}'")
