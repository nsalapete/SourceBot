"""
Researcher Agent - Analyzes supplier data from the CRM
"""
import anthropic
import json
import os

def analyze_suppliers(goal, suppliers_data, api_key, model="claude-sonnet-4-5-20250929"):
    """
    Analyzes supplier data based on the goal
    
    Args:
        goal (str): The original goal
        suppliers_data (list): List of supplier objects from JSON
        api_key (str): Anthropic API key
        model (str): Claude model to use
    
    Returns:
        dict: Analysis results and findings
    """
    client = anthropic.Anthropic(api_key=api_key)
    
    # Convert suppliers data to a readable format
    suppliers_summary = json.dumps(suppliers_data[:20], indent=2)  # Send first 20 for context
    
    prompt = f"""You are a data analyst specializing in supplier relationship management.

Goal: {goal}

Here is a sample of supplier data from our CRM:
{suppliers_summary}

The full dataset contains {len(suppliers_data)} suppliers.

Analyze this data in the context of the goal. Provide:
1. Key findings and insights
2. Specific suppliers or categories that are relevant
3. Statistics and patterns you notice (ratings, categories, active status)
4. Recommendations based on the data

Return your response as a JSON object with these fields:
{{
  "summary": "Brief summary of findings",
  "key_findings": ["finding 1", "finding 2", ...],
  "relevant_suppliers": [
    {{"id": "SUP-XXX", "name": "Company Name", "reason": "why relevant"}},
    ...
  ],
  "statistics": {{
    "total_suppliers": number,
    "average_rating": number,
    "by_category": {{}},
    "active_count": number
  }},
  "recommendations": ["recommendation 1", "recommendation 2", ...]
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
        
        findings = json.loads(response_text)
        
        return {
            "success": True,
            "findings": findings
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


def load_suppliers_from_file(filepath):
    """
    Load suppliers from JSON file (fake CRM connection)
    
    Args:
        filepath (str): Path to suppliers JSON file
    
    Returns:
        list: List of supplier objects
    """
    try:
        with open(filepath, 'r') as f:
            suppliers = json.load(f)
        return {
            "success": True,
            "suppliers": suppliers
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
