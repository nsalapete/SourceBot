"""
Shared voice synthesis utilities using ElevenLabs API.
Consolidates text-to-speech logic used by reporter and notification system.
"""
from typing import Optional
import os
from elevenlabs.client import ElevenLabs


def generate_voice(
    text: str,
    api_key: Optional[str] = None,
    voice_id: Optional[str] = None,
    model_id: str = "eleven_multilingual_v2"
) -> Optional[bytes]:
    """
    Convert text to speech using ElevenLabs API.
    
    Args:
        text: Text content to synthesize
        api_key: ElevenLabs API key (defaults to env ELEVENLABS_API_KEY)
        voice_id: Voice ID to use (defaults to env ELEVENLABS_VOICE_ID or JBFqnCBsd6RMkjVDRZzb)
        model_id: ElevenLabs model (default: eleven_multilingual_v2)
        
    Returns:
        MP3 audio bytes or None if generation fails
    """
    api_key = api_key or os.getenv("ELEVENLABS_API_KEY")
    if not api_key:
        print("⚠ ElevenLabs API key not found")
        return None
    
    voice_id = voice_id or os.getenv("ELEVENLABS_VOICE_ID", "JBFqnCBsd6RMkjVDRZzb")
    
    try:
        client = ElevenLabs(api_key=api_key)
        
        audio_generator = client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id=model_id,
            output_format="mp3_44100_128"
        )
        
        # Collect audio chunks
        audio_chunks = []
        for chunk in audio_generator:
            if chunk:
                audio_chunks.append(chunk)
        
        audio_bytes = b"".join(audio_chunks)
        return audio_bytes
        
    except Exception as e:
        print(f"✗ ElevenLabs generation failed: {e}")
        return None


def format_notification_text(notification: dict) -> str:
    """
    Format notification data into natural speech text.
    
    Args:
        notification: Notification dict with title, message, priority, data
        
    Returns:
        Formatted text suitable for voice synthesis
    """
    priority = notification.get("priority", "medium")
    title = notification.get("title", "")
    message = notification.get("message", "")
    
    parts = []
    
    # Priority prefix
    if priority == "critical":
        parts.append("Urgent notification.")
    elif priority == "high":
        parts.append("Important notification.")
    
    # Main content
    if title:
        parts.append(title)
    if message:
        parts.append(message)
    
    # Business data formatting
    data = notification.get("data", {})
    
    if "inventory" in data:
        inv = data["inventory"]
        if "current_stock" in inv:
            parts.append(f"Current stock: {inv['current_stock']} units.")
        if "low_stock_items" in inv and inv["low_stock_items"]:
            items = ", ".join(inv["low_stock_items"][:3])
            parts.append(f"Low stock items: {items}.")
    
    if "cashflow" in data:
        cf = data["cashflow"]
        if "balance" in cf:
            parts.append(f"Cash balance: {cf['balance']} dollars.")
        if cf.get("status") == "warning":
            parts.append("Cash flow requires attention.")
        elif cf.get("status") == "critical":
            parts.append("Critical cash flow situation.")
    
    if "findings" in data:
        findings = data["findings"]
        if isinstance(findings, dict):
            if "supplier_count" in findings:
                parts.append(f"Found {findings['supplier_count']} suppliers.")
            if "summary" in findings:
                parts.append(findings["summary"])
    
    return " ".join(parts)
