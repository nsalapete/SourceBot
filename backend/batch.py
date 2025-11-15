import anthropic

client = anthropic.Anthropic(
  # defaults to os.environ.get("ANTHROPIC_API_KEY")
  api_key="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",
)

message_batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": "first-prompt-in-my-batch",
            "params": {
                "model": "claude-haiku-4-5-20251001",
                "max_tokens": 100,
                "messages": [
                    {
                        "role": "user",
                        "content": "Hey Claude, tell me a short fun fact about video games!",
                    }
                ],
            },
        },
        {
            "custom_id": "second-prompt-in-my-batch",
            "params": {
                "model": "claude-sonnet-4-5-20250929",
                "max_tokens": 100,
                "messages": [
                    {
                        "role": "user",
                        "content": "Hey Claude, tell me a short fun fact about bees!",
                    }
                ],
            },
        },
    ]
)
print(message_batch)