"""
Quick test script for voice notification generation.
Verifies ElevenLabs integration without running the full notification service.
"""
import os
import sys
from dotenv import load_dotenv

# Load environment
load_dotenv('../api.env')
sys.path.insert(0, os.path.dirname(__file__))

from voice_utils import generate_voice, format_notification_text

def test_voice_generation():
    """Test basic voice generation"""
    print("Testing voice generation...")
    
    api_key = os.getenv('ELEVENLABS_API_KEY')
    if not api_key:
        print("✗ ELEVENLABS_API_KEY not found in environment")
        return False
    
    print(f"✓ API key found: {api_key[:10]}...")
    
    # Test simple text
    audio = generate_voice("This is a test notification.", api_key=api_key)
    
    if audio:
        print(f"✓ Generated {len(audio)} bytes of audio")
        
        # Save to file
        with open('test_voice_notification.mp3', 'wb') as f:
            f.write(audio)
        print("✓ Saved to test_voice_notification.mp3")
        return True
    else:
        print("✗ Voice generation failed")
        return False


def test_notification_formatting():
    """Test notification text formatting"""
    print("\nTesting notification formatting...")
    
    notification = {
        "id": "test-123",
        "title": "Inventory Alert",
        "message": "Low stock detected",
        "priority": "critical",
        "data": {
            "inventory": {
                "current_stock": 25,
                "low_stock_items": ["Widget A", "Widget B"],
                "reorder_needed": True
            },
            "cashflow": {
                "balance": 15000,
                "status": "warning"
            }
        }
    }
    
    text = format_notification_text(notification)
    print(f"Formatted text: {text}")
    
    api_key = os.getenv('ELEVENLABS_API_KEY')
    if api_key:
        audio = generate_voice(text, api_key=api_key)
        if audio:
            with open('test_formatted_notification.mp3', 'wb') as f:
                f.write(audio)
            print(f"✓ Generated formatted notification ({len(audio)} bytes)")
            print("✓ Saved to test_formatted_notification.mp3")
            return True
    
    return False


if __name__ == "__main__":
    print("Voice Notification Test\n" + "="*50)
    
    success = True
    success = test_voice_generation() and success
    success = test_notification_formatting() and success
    
    if success:
        print("\n✓ All tests passed")
    else:
        print("\n✗ Some tests failed")
    
    sys.exit(0 if success else 1)
