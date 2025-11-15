"""
Planner Agent - Creates a step-by-step plan from the manager's goal
"""
import anthropic
import os
import json

def create_plan(goal, api_key, model="claude-sonnet-4-5-20250929"):
    """
    Takes a goal and returns a structured plan with steps
    
    Args:
        goal (str): The goal submitted by the manager
        api_key (str): Anthropic API key
        model (str): Claude model to use
    
    Returns:
        list: Array of plan steps
    """
    if not api_key:
        return {
            "success": False,
            "error": "ANTHROPIC_API_KEY is missing. Add it to api.env to use real planning.",
        }

    client = anthropic.Anthropic(api_key=api_key)
    
    prompt = f"""You are a strategic planning assistant for supplier relationship management.

The manager has submitted this goal: "{goal}"

Create a detailed, actionable plan to achieve this goal. Break it down into clear steps.
Your plan should include:
1. Researching supplier data from the CRM
2. Analyzing the data to identify relevant insights
3. Drafting communications to suppliers if needed
4. Any other relevant steps

Return your response as a JSON array of steps. Each step should have:
- "step_number": integer
- "title": brief title
- "description": detailed description of what needs to be done
- "status": "pending" (all steps start as pending)

Example format:
[
  {{"step_number": 1, "title": "Research Suppliers", "description": "Gather supplier data from CRM", "status": "pending"}},
  {{"step_number": 2, "title": "Analyze Data", "description": "Review ratings and categories", "status": "pending"}}
]

Only return the JSON array, no other text."""

    try:
        message = client.messages.create(
            model=model,
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        # Extract the text content
        response_text = message.content[0].text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]  # Remove ```json
        elif response_text.startswith("```"):
            response_text = response_text[3:]  # Remove ```
        
        if response_text.endswith("```"):
            response_text = response_text[:-3]  # Remove trailing ```
        
        response_text = response_text.strip()
        
        # Parse JSON from response
        plan = json.loads(response_text)
        
        return {
            "success": True,
            "plan": plan
        }
        
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"JSON parsing error: {str(e)}. Response was: {response_text[:200]}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": f"Planner call failed: {e}",
        }
