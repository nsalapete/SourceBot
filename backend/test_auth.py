import anthropic

# Test with the exact key from batch.py
api_key = "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"

print(f"Testing API key: {api_key[:20]}...")

try:
    client = anthropic.Anthropic(api_key=api_key)
    
    message = client.messages.create(
        model="claude-sonnet-4-5-20250929",
        max_tokens=100,
        messages=[{
            "role": "user",
            "content": "Say 'API key works!' and nothing else."
        }]
    )
    
    print(f"✅ Success! Response: {message.content[0].text}")
    
except anthropic.AuthenticationError as e:
    print(f"❌ Authentication Error: {e}")
except Exception as e:
    print(f"❌ Error: {e}")
