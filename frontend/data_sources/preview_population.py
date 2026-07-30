import pandas as pd

# Load population data
pop = pd.read_csv("KE_POPULATION/ke_population.csv")
print("=== POPULATION DATA ===")
print(f"Number of rows: {len(pop)}")
print(f"\nColumn names: {pop.columns.tolist()}")
print(f"\nFirst 5 rows:")
print(pop.head())