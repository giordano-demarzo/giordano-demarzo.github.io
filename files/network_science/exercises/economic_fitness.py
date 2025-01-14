import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Import data
cou = pd.read_csv('countries.csv', header=None)[0].tolist()
matrix = pd.read_csv('exportmatrix2021.csv', header=None).to_numpy()

# Function to calculate RCA and binarize the matrix
def rca_matrix(mat, binarization=True):
    u = np.sum(mat, axis=0)
    d = np.sum(mat, axis=1)
    t = np.sum(mat)
    RCA = np.nan_to_num((mat * t / u).T / d).T
    if binarization:
        RCA[RCA >= 1] = 1
        RCA[RCA < 1] = 0
    return RCA

# RCA and binarization
RCA = rca_matrix(matrix)
M = RCA.copy()

# Compute ubiquity and diversification
ubi = np.sum(M, axis=0)
div = np.sum(M, axis=1)

# Remove rows and columns with zero values
cou_to_remove = div == 0
prod_to_remove = ubi == 0

M = np.delete(M, cou_to_remove, axis=0)
M = np.delete(M, prod_to_remove, axis=1)
ubi = np.sum(M, axis=0)
div = np.sum(M, axis=1)

# Reorder matrix
ordered_countries = np.argsort(div)
ordered_products = np.argsort(ubi)[::-1]
M_ordered = M[np.ix_(ordered_countries, ordered_products)]

# Plot nested structure
plt.figure(figsize=(10, 6))
plt.imshow(M_ordered, aspect='auto', cmap='Greys', origin='lower')
plt.colorbar(label='Presence (1) / Absence (0)')
plt.xlabel('Products (high to low ubiquity)')
plt.ylabel('Countries (low to high diversification)')
plt.title('Nested Export Matrix')
plt.show()

# Compute fitness and complexity
N_c, N_p = M.shape
F = np.ones(N_c)
Q = np.ones(N_p)

for _ in range(100):
    F_new = M @ Q
    Q_new = 1 / (M.T @ (1 / F_new))
    F, Q = F_new / np.mean(F_new), Q_new / np.mean(Q_new)

df_fitness = pd.DataFrame({'countries': [c for i, c in enumerate(cou) if not cou_to_remove[i]], 'fitness': F})
df_fitness = df_fitness.sort_values(by='fitness', ascending=False)

# Display top and bottom countries by fitness
print("Top countries by fitness:\n", df_fitness.head(5))
print("Bottom countries by fitness:\n", df_fitness.tail(5))

# Import GDP data
gdp_data = pd.read_csv('gdp_ppp.csv', usecols=["Country Code", "2021 [YR2021]"])
gdp_data.columns = ['country_code', 'gdp_pc']

# Merge GDP with fitness
df_merged = df_fitness.merge(gdp_data, left_on='countries', right_on='country_code')

# Handle missing or invalid GDP values
df_merged = df_merged[df_merged['gdp_pc'].notna()]
df_merged['gdp_pc'] = df_merged['gdp_pc'].replace('..', np.nan).astype(float)

# Plot log fitness vs log GDP pc
plt.figure(figsize=(10, 6))
plt.scatter(np.log(df_merged['fitness']), np.log(df_merged['gdp_pc']), alpha=0.7)

# Highlight specific countries
highlight_countries = ['IND', 'CHN', 'USA', 'NGA', 'BRA', 'RUS', 'SAU', 'DEU', 
                       'ZAF', 'JPN', 'MEX', 'IDN', 'EGY', 'VNM', 'BGD', 'QAT']

for _, row in df_merged[df_merged['countries'].isin(highlight_countries)].iterrows():
    plt.text(np.log(row['fitness']), np.log(row['gdp_pc']), row['countries'], fontsize=8)

plt.xlabel('Log Fitness')
plt.ylabel('Log GDP per Capita')
plt.title('Log Fitness vs Log GDP per Capita')
plt.xlim([-10, 5])
plt.grid(True, alpha=0.5)
plt.show()
