"""
Simple test to verify ElevenLabs voice generation is working
"""
import os
from dotenv import load_dotenv
from elevenlabs.client import ElevenLabs

# Load environment
load_dotenv('api.env')

ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
ELEVENLABS_VOICE_ID = os.getenv('ELEVENLABS_VOICE_ID', 'JBFqnCBsd6RMkjVDRZzb')
ELEVENLABS_MODEL = os.getenv('ELEVENLABS_MODEL', 'eleven_multilingual_v2')

print("=" * 60)
print("ELEVENLABS VOICE GENERATION TEST")
print("=" * 60)

if not ELEVENLABS_API_KEY:
    print("\n✗ ERROR: ELEVENLABS_API_KEY not found in api.env")
    print("Please add your ElevenLabs API key to api.env")
    exit(1)

print(f"\n✓ API Key found: {ELEVENLABS_API_KEY[:10]}...")
print(f"✓ Voice ID: {ELEVENLABS_VOICE_ID}")
print(f"✓ Model: {ELEVENLABS_MODEL}")

# Initialize client
print("\n→ Initializing ElevenLabs client...")
client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
print("✓ Client initialized")

# Test text
test_text = "Important notification. Inventory Low Stock Alert. Current inventory is 45 units. Low stock alert for USB Cables, Power Banks, HDMI Adapters. Reordering is required."

print(f"\n→ Generating voice for test text...")
print(f"   Text: {test_text[:80]}...")

try:
    # Generate audio
    audio_generator = client.text_to_speech.convert(
        voice_id=ELEVENLABS_VOICE_ID,
        output_format="mp3_44100_128",
        model_id=ELEVENLABS_MODEL,
        text=test_text
    )
    
    # Collect chunks
    print("→ Collecting audio chunks...")
    audio_chunks = []
    chunk_count = 0
    
    for chunk in audio_generator:
        if chunk:
            audio_chunks.append(chunk)
            chunk_count += 1
            print(f"   Chunk {chunk_count}: {len(chunk)} bytes")
    
    # Combine
    audio_bytes = b"".join(audio_chunks)
    
    print(f"\n✓ SUCCESS!")
    print(f"   Total chunks: {chunk_count}")
    print(f"   Total size: {len(audio_bytes)} bytes ({len(audio_bytes)/1024:.2f} KB)")
    
    # Save to file
    output_file = "test_voice_output.mp3"
    with open(output_file, 'wb') as f:
        f.write(audio_bytes)
    
    print(f"✓ Saved to: {output_file}")
    print(f"\nYou can now play this file to verify the audio works!")
    print(f"Command: start {output_file}")
    
except Exception as e:
    print(f"\n✗ ERROR: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 60)
