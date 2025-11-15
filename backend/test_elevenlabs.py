"""
Test ElevenLabs Integration
"""
from elevenlabs.client import ElevenLabs
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent / 'api.env'
load_dotenv(env_path)

def test_elevenlabs():
    """Test ElevenLabs text-to-speech"""
    
    api_key = os.getenv('ELEVENLABS_API_KEY')
    
    if not api_key:
        print("❌ ELEVENLABS_API_KEY not found in environment")
        return False
    
    print("🔍 Testing ElevenLabs Integration...")
    print("-" * 60)
    print(f"API Key: {api_key[:20]}...")
    
    try:
        # Initialize client
        client = ElevenLabs(api_key=api_key)
        print("✅ Client initialized")
        
        # Test text
        test_text = "Hello! This is a test of the SourceBot voice reporting system. The multi-agent orchestration is working correctly."
        
        print(f"\n📝 Converting text to speech...")
        print(f"Text: {test_text[:50]}...")
        
        # Convert to speech
        audio = client.text_to_speech.convert(
            text=test_text,
            voice_id="JBFqnCBsd6RMkjVDRZzb",  # George voice
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128"
        )
        
        # Collect audio data
        audio_data = b"".join(audio)
        
        print(f"✅ Audio generated!")
        print(f"Audio size: {len(audio_data)} bytes ({len(audio_data)/1024:.2f} KB)")
        
        # Save to file
        output_file = Path(__file__).parent.parent / 'test_elevenlabs.mp3'
        with open(output_file, 'wb') as f:
            f.write(audio_data)
        
        print(f"✅ Audio saved to: {output_file}")
        print("\nYou can play this file to verify the audio works!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("\n🎙️ ElevenLabs Integration Test")
    print("=" * 60)
    
    success = test_elevenlabs()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ ElevenLabs integration is working!")
    else:
        print("❌ ElevenLabs integration failed")
    print("=" * 60)
