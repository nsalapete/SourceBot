"""
Find working Claude model
"""
import anthropic
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent / 'api.env'
load_dotenv(env_path)

api_key = os.getenv('ANTHROPIC_API_KEY')
client = anthropic.Anthropic(api_key=api_key)

# Based on the example you provided, try these models
models = [
    "claude-sonnet-4-5-20250929",
    "claude-haiku-4-5-20251001", 
    "claude-3-5-sonnet-20241022",
    "claude-3-5-sonnet-20240620",
    "claude-3-sonnet-20240229",
    "claude-3-opus-20240229",
    "claude-3-haiku-20240307"
]

print("Testing Claude models...")
print("=" * 60)

for model in models:
    try:
        message = client.messages.create(
            model=model,
            max_tokens=20,
            messages=[{"role": "user", "content": "Hi"}]
        )
        print(f"✅ {model} - WORKS!")
        print(f"   Response: {message.content[0].text}")
        break
    except Exception as e:
        if "404" in str(e):
            print(f"❌ {model} - Not found")
        else:
            print(f"❌ {model} - Error: {str(e)[:50]}")
