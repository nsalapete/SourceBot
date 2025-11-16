# Example Sourcing Questions for SourceBot

Based on the actual retail inventory and sales data, here are realistic sourcing questions you can ask the AI agent:

## Format
"Source [number] units of [product type/category] from [supplier] by [date]"

## Examples Based on Actual Data

### Dental Products (Supplier: Uniphar)
- "Source 500 units of Dental products from Uniphar by 15/11/2025"
- "Source 1000 units of Colgate toothbrush from Uniphar by 20/11/2025"
- "Source 250 units of Dental care products from Uniphar by 01/12/2025"

### Baby Gifts (Supplier: Sifco)
- "Source 300 units of Baby Gifts from Sifco by 20/11/2025"
- "Source 150 units of Baby Poem Photo Plaques from Sifco by 25/11/2025"
- "Source 600 units of Baby gift items from Sifco by 10/12/2025"

### Fragrance Products (Supplier: Delisted Products)
- "Source 200 units of Fragrance products from Delisted Products by 01/12/2025"
- "Source 100 units of Calvin Klein perfume from Delisted Products by 15/12/2025"
- "Source 400 units of Luxury fragrances from Delisted Products by 20/12/2025"

### Seasonal Gifts (Supplier: Sifco)
- "Source 500 units of Seasonal Gifts from Sifco by 10/12/2025"
- "Source 200 units of Christmas gift items from Sifco by 15/12/2025"
- "Source 800 units of Holiday decorations from Sifco by 01/12/2025"

### OTC Products (Various Suppliers)
- "Source 300 units of Analgesics from Uniphar by 18/11/2025"
- "Source 500 units of Cold & Flu products from Uniphar by 22/11/2025"
- "Source 150 units of Family Planning products from Uniphar by 30/11/2025"

### Vitamins & Supplements
- "Source 400 units of Revive Active supplements from Uniphar by 25/11/2025"
- "Source 250 units of Vitamin products from Uniphar by 02/12/2025"
- "Source 600 units of Nutritional supplements from Uniphar by 15/12/2025"

### Skincare Products
- "Source 300 units of Elave skincare products from Uniphar by 20/11/2025"
- "Source 200 units of Dermo skincare items from Uniphar by 28/11/2025"
- "Source 500 units of SPF products from Uniphar by 05/12/2025"

### Female Hygiene (Supplier: Uniphar)
- "Source 400 units of Female Hygiene products from Uniphar by 17/11/2025"
- "Source 250 units of Tampons from Uniphar by 24/11/2025"
- "Source 600 units of Feminine care items from Uniphar by 08/12/2025"

## Multi-Supplier Complex Questions

- "Source 1000 units of Health & Beauty products from Uniphar and Sifco by 01/12/2025"
- "Source 500 units of Gift items from Sifco and 300 units of Fragrances from Delisted Products by 15/12/2025"
- "Source 2000 units of Pharmacy products from multiple suppliers by 20/12/2025"

## Analysis Questions (Beyond Simple Sourcing)

- "Identify top-performing suppliers for Dental products in November 2025"
- "Analyze profit margins for Vitamin products from Uniphar"
- "Compare pricing strategies for Gift items from Sifco vs other suppliers"
- "Evaluate stock levels and reorder points for fast-moving OTC products"
- "Generate supplier performance report for Uniphar based on sales data from September to October 2025"

## What the Agent Will Do

When you submit any of these questions, the SourceBot multi-agent system will:

1. **Planning Agent**: Create a detailed step-by-step plan to fulfill the sourcing request
2. **Researcher Agent**: Analyze both inventory (500 products) and sales data (1000 transactions)
3. **Communicator Agent**: Draft professional emails to suppliers
4. **Reporter Agent**: Generate voice and text reports summarizing findings

## Example Workflow

Submit: "Source 500 units of Dental products from Uniphar by 15/11/2025"

The system will:
- ✅ Create a 10-15 step procurement plan
- ✅ Analyze current stock levels of dental products
- ✅ Review sales history for demand patterns
- ✅ Calculate required quantities and pricing
- ✅ Draft supplier communication
- ✅ Generate voice report with findings

## Notes

- **Dates**: Use format DD/MM/YYYY (e.g., 15/11/2025)
- **Units**: Can be in cases (Case Size column) or individual units
- **Suppliers**: Main suppliers in data are Uniphar, Sifco, Delisted Products
- **Categories**: Dental, Gifts, Fragrance, Vitamins, OTC, Skincare, Seasonal
- **Data Range**: Sales data covers 01/09/2023 to 31/10/2025
