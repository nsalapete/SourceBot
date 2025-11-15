"""
Communicator Agent - Drafts emails to suppliers based on findings
"""
import anthropic
import json

def draft_emails(goal, findings, relevant_suppliers, api_key, model="claude-sonnet-4-5-20250929"):
    """
    Creates email drafts for suppliers based on research findings
    
    Args:
        goal (str): The original goal
        findings (dict): Research findings from the Researcher agent
        relevant_suppliers (list): List of relevant suppliers
        api_key (str): Anthropic API key
        model (str): Claude model to use
    
    Returns:
        dict: Email drafts for each supplier
    """
    client = anthropic.Anthropic(api_key=api_key)
    
    findings_summary = json.dumps(findings, indent=2)
    suppliers_summary = json.dumps(relevant_suppliers, indent=2)
    
    prompt = f"""You are a professional business communication specialist.

Goal: {goal}

Research Findings:
{findings_summary}

Relevant Suppliers:
{suppliers_summary}

Draft professional emails for the relevant suppliers based on the goal and findings.
Each email should be personalized, professional, and actionable.

Return your response as a JSON object:
{{
  "emails": [
    {{
      "supplier_id": "SUP-XXX",
      "supplier_name": "Company Name",
      "to": "email@example.com",
      "subject": "Email subject",
      "body": "Email body text"
    }},
    ...
  ],
  "summary": "Brief summary of communication strategy"
}}

Only return the JSON object, no other text."""

    try:
        message = client.messages.create(
            model=model,
            max_tokens=4000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        response_text = message.content[0].text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        elif response_text.startswith("```"):
            response_text = response_text[3:]
        
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        drafts = json.loads(response_text)
        
        return {
            "success": True,
            "drafts": drafts
        }
        
    except json.JSONDecodeError as e:
        return {
            "success": False,
            "error": f"JSON parsing error: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
