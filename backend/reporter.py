"""
Reporter Agent - Creates voice reports using Claude + ElevenLabs
"""
import anthropic
import json
from elevenlabs.client import ElevenLabs

def generate_status_report(state, api_key, model="claude-sonnet-4-5-20250929"):
    """
    Generates a text status report from the current state
    
    Args:
        state (dict): Current workflow state
        api_key (str): Anthropic API key
        model (str): Claude model to use
    
    Returns:
        dict: Status report text
    """
    client = anthropic.Anthropic(api_key=api_key)
    
    state_summary = json.dumps({
        "goal": state.get("goal"),
        "status": state.get("status"),
        "current_step": state.get("current_step"),
        "plan": state.get("plan", []),
        "has_findings": "findings" in state,
        "has_drafts": "drafts" in state
    }, indent=2)
    
    prompt = f"""You are a business assistant providing a status update to a manager.

Current Workflow State:
{state_summary}

Create a clear, concise status report that the manager can listen to. The report should:
1. Summarize the goal
2. Explain what has been completed so far
3. Highlight key findings or results
4. Mention what steps are remaining or pending approval

Keep it conversational and professional, suitable for text-to-speech conversion.
Limit to 2-3 paragraphs (about 200-300 words).

Return only the status report text, no JSON or formatting."""

    try:
        message = client.messages.create(
            model=model,
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        report_text = message.content[0].text
        
        return {
            "success": True,
            "report": report_text
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def generate_voice_report(report_text, elevenlabs_api_key, voice_id="JBFqnCBsd6RMkjVDRZzb"):
    """
    Converts text report to speech using ElevenLabs API
    
    Args:
        report_text (str): Text to convert to speech
        elevenlabs_api_key (str): ElevenLabs API key
        voice_id (str): Voice ID to use (default: George)
    
    Returns:
        dict: Audio data
    """
    try:
        # Initialize ElevenLabs client
        client = ElevenLabs(api_key=elevenlabs_api_key)
        
        # Convert text to speech
        audio = client.text_to_speech.convert(
            text=report_text,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128"
        )
        
        # Collect audio data from generator
        audio_data = b"".join(audio)
        
        return {
            "success": True,
            "audio_data": audio_data,
            "content_type": "audio/mpeg"
        }
            
    except Exception as e:
        return {
            "success": False,
            "error": f"ElevenLabs error: {str(e)}"
        }
