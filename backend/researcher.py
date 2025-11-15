"""
Researcher Agent - Analyzes supplier data from the CRM
"""
import anthropic
import json
import os

def analyze_suppliers(goal, combined_data, api_key, model="claude-sonnet-4-5-20250929"):
    """
    Analyzes retail inventory and sales data based on the goal
    
    Args:
        goal (str): The original goal
        combined_data (dict): Combined inventory and sales data from CSV files
        api_key (str): Anthropic API key
        model (str): Claude model to use
    
    Returns:
        dict: Analysis results and findings
    """
    client = anthropic.Anthropic(api_key=api_key)
    
    # Extract inventory and sales data
    inventory_data = combined_data.get("inventory", [])
    sales_data = combined_data.get("sales", [])
    
    # Sample data for analysis
    inventory_sample = inventory_data[:30]
    sales_sample = sales_data[:50]
    
    # Convert to readable format
    data_summary = json.dumps({
        "inventory_sample": inventory_sample,
        "sales_sample": sales_sample,
        "total_inventory_records": len(inventory_data),
        "total_sales_records": len(sales_data)
    }, indent=2)
    
    prompt = f"""You are a retail analyst specializing in inventory and sales analysis.

Goal: {goal}

You have TWO datasets:

**INVENTORY DATA** (retail_inventory_snapshot_30_10_25_cleaned.csv):
Columns: Product, Packsize, Headoffice ID, Barcode, OrderList (supplier), Case Size, Trade Price, RRP, Dept Fullname, Group Fullname, Branch Name, Branch Stock Level

**SALES DATA** (retail_sales_data_01_09_2023_to_31_10_2025_cleaned.csv):
Columns: Product, Packsize, Headoffice ID, Branch Name, Dept Fullname, Group Fullname, Trade Price, RRP, Sale ID, Qty Sold, Turnover, Vat Amount, Sale VAT Rate, Turnover ex VAT, Disc Amount, Profit, Refund Value

Here is a sample from both datasets:
{data_summary}

Analyze BOTH the inventory and sales data together to provide comprehensive insights for the goal:

**FROM INVENTORY DATA, analyze:**
- Current stock levels and availability
- Product range and supplier diversity (OrderList field)
- Pricing structure (Trade Price vs RRP)
- Product categories and departments

**FROM SALES DATA, analyze:**
- Sales performance (Qty Sold, Turnover, Profit)
- Revenue trends and patterns
- Product profitability and margins
- Discount patterns and their impact
- Best-selling products and categories
- Sales by branch/location

**COMBINE INSIGHTS:**
- Match inventory stock levels with sales velocity
- Identify overstock/understock situations
- Find high-profit products with good availability
- Spot supplier performance patterns
- Recommend actions based on both current inventory and sales history

Return your response as a JSON object with these fields:
{{
  "summary": "Brief summary combining inventory and sales insights",
  "key_findings": ["finding 1 from sales/inventory", "finding 2", ...],
  "relevant_suppliers": [
    {{
      "supplier": "Supplier Name from OrderList column",
      "product": "Product name",
      "department": "Dept Fullname",
      "trade_price": number,
      "rrp": number,
      "stock_level": number,
      "qty_sold": number,
      "turnover": number,
      "profit": number,
      "reason": "why relevant based on sales/inventory data"
    }},
    ...
  ],
  "statistics": {{
    "total_products": number,
    "unique_suppliers": number,
    "total_departments": number,
    "total_sales_transactions": number,
    "total_revenue": number,
    "total_profit": number,
    "avg_trade_price": number,
    "avg_rrp": number,
    "avg_profit_margin": number,
    "top_selling_products": [{{"product": "name", "qty_sold": number, "turnover": number}}],
    "top_profitable_products": [{{"product": "name", "profit": number, "margin": number}}],
    "top_suppliers": [{{"supplier": "OrderList name", "product_count": number, "total_sales": number}}],
    "departments": {{"dept_name": product_count}}
  }},
  "recommendations": ["recommendation 1 based on sales+inventory", "recommendation 2", ...]
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


def load_suppliers_from_file(inventory_path, sales_path):
    """
    Load both inventory and sales data from CSV files
    
    Args:
        inventory_path (str): Path to retail inventory CSV file
        sales_path (str): Path to retail sales CSV file
    
    Returns:
        dict: Combined data with inventory and sales information
    """
    try:
        import csv
        inventory_data = []
        sales_data = []
        
        # Load inventory data (first 500 rows)
        with open(inventory_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                if i >= 500:
                    break
                inventory_data.append(row)
        
        # Load sales data (first 1000 rows for more sales insights)
        with open(sales_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader):
                if i >= 1000:
                    break
                sales_data.append(row)
        
        # Combine both datasets for analysis
        combined_data = {
            "inventory": inventory_data,
            "sales": sales_data,
            "inventory_count": len(inventory_data),
            "sales_count": len(sales_data)
        }
        
        return {
            "success": True,
            "combined_data": combined_data
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
