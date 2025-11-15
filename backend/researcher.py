"""
Researcher Agent - Analyzes supplier data from the CRM
"""
import anthropic
import json
import os

def analyze_suppliers(goal, suppliers_data, api_key, model="claude-sonnet-4-5-20250929"):
    """
    Analyzes retail inventory data based on the goal
    
    Args:
        goal (str): The original goal
        suppliers_data (list): List of product/inventory records from CSV
        api_key (str): Anthropic API key
        model (str): Claude model to use
    
    Returns:
        dict: Analysis results and findings
    """
    client = anthropic.Anthropic(api_key=api_key)
    
    # Convert inventory data to a readable format
    suppliers_summary = json.dumps(suppliers_data[:30], indent=2)  # Send first 30 for context
    
    prompt = f"""You are a retail inventory analyst specializing in product and supplier analysis.

Goal: {goal}

Here is a sample of retail inventory data:
{suppliers_summary}

The full dataset contains {len(suppliers_data)} product records.

CSV Columns: Product, Packsize, Headoffice ID, Barcode, OrderList (supplier), Case Size, Trade Price, RRP, Dept Fullname, Group Fullname, Branch Name, Branch Stock Level

Analyze this retail inventory data in the context of the goal. Provide:
1. Key findings and insights about products, suppliers (OrderList), pricing, stock levels
2. Specific products, suppliers, or departments that are relevant to the goal
3. Statistics and patterns (pricing trends, stock levels, product categories, supplier distribution)
4. Actionable recommendations based on the inventory data

Return your response as a JSON object with these fields:
{{
  "summary": "Brief summary of findings",
  "key_findings": ["finding 1", "finding 2", ...],
  "relevant_suppliers": [
    {{"supplier": "Supplier Name", "product": "Product Name", "reason": "why relevant"}},
    ...
  ],
  "statistics": {{
    "total_products": number,
    "unique_suppliers": number,
    "departments": {{}},
    "avg_trade_price": number,
    "avg_rrp": number
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
    Load inventory data from CSV file (retail inventory snapshot)
    
    Args:
        filepath (str): Path to retail inventory CSV file
    
    Returns:
        list: List of product/supplier records
    """
    try:
        import csv
        suppliers = []
        
        with open(filepath, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            # Load first 500 rows for performance
            for i, row in enumerate(reader):
                if i >= 500:
                    break
                suppliers.append(row)
        
        return {
            "success": True,
            "suppliers": suppliers
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
