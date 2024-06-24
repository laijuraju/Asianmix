import json
import pandas as pd

# Load existing Excel file
excel_path = 'products.xlsx'
df = pd.read_excel(excel_path)

# Load new products from the JSON input
with open('products.json') as f:
    new_products = json.load(f)

# Convert new products to DataFrame and append to existing data
new_df = pd.DataFrame(new_products)
df = df.append(new_df, ignore_index=True)

# Save the updated DataFrame back to the Excel file
df.to_excel(excel_path, index=False)
