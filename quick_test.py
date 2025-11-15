"""Quick test of Anthropic connection"""
import anthropic
import os
from dotenv import load_dotenv

load_dotenv('api.env')

print("🔍 Testing Anthropic Claude API connection...")
print("-" * 60)

api_key = os.getenv('ANTHROPIC_API_KEY')
model = os.getenv('CLAUDE_MODEL', 'claude-sonnet-4-5-20250929')

print(f"API Key: {api_key[:20]}...")
print(f"Model: {model}")
print("\nSending test message...")

try:
    client = anthropic.Anthropic(api_key=api_key)
    
    message = client.messages.create(
        model=model,
        max_tokens=100,
        messages=[
            {"role": "user", "content": "Say 'Hello, SourceBot is working!' and nothing else."}
        ]
    )
    
    response = message.content[0].text
    
    print(f"\n✅ SUCCESS!")
    print(f"Claude responded: {response}")
    print(f"Tokens used: {message.usage.input_tokens} in, {message.usage.output_tokens} out")
    print("\n" + "=" * 60)
    print("✅ Anthropic connection is working perfectly!")
    print("=" * 60)
    
except Exception as e:
    print(f"\n❌ FAILED: {e}")
    print("=" * 60)
