#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Dec 10 01:37:12 2024

@author: giordano
"""

#%%STEP 1: DATA IMPORT 

import pandas as pd
import numpy as np
import networkx as nx
import matplotlib.pyplot as plt
from bicm import BipartiteGraph
from community import community_louvain
import matplotlib.colors as mcolors


# Import the biadjacency matrix with no header
export_df = pd.read_csv('exportmatrix2022.csv', header=None)
export_matrix = export_df.values

# Import country and product lists (no header)
countries_df = pd.read_csv('countries.csv', header=None)
products_df = pd.read_csv('products.csv', header=None)

countries = countries_df[0].tolist()
products = products_df[0].tolist()

num_countries = len(countries)
num_products = len(products)

#%% BINARIZATION USING RCA 

# Compute totals
X_c = export_matrix.sum(axis=1, keepdims=True)  # country totals (row sums)
X_p = export_matrix.sum(axis=0, keepdims=True)  # product totals (col sums)
X_tot = export_matrix.sum()

# Compute RCA
# RCA_{cp} = (x_{cp}/X_c) / (X_p/X_tot)
RCA = (export_matrix / X_c) / (X_p / X_tot)

# Binarize the RCA matrix: 1 if RCA > 1, else 0
binary_matrix = (RCA > 1).astype(int)

#%% NAIVE NETWORK PROJECTION
# Project to country-country network via naive approach:
# Countries are connected if they share at least one product.

country_adj_naive = np.zeros((num_countries, num_countries), dtype=int)
for i in range(num_countries):
    for j in range(i+1, num_countries):
        shared_products = (binary_matrix[i] * binary_matrix[j]).sum()
        if shared_products > 0:
            country_adj_naive[i, j] = 1
            country_adj_naive[j, i] = 1

G_naive = nx.from_numpy_array(country_adj_naive)
# Map node indices to country names
mapping = {i: countries[i] for i in range(num_countries)}
G_naive = nx.relabel_nodes(G_naive, mapping)

# Plot the naive network
plt.figure(figsize=(10,10))
pos = nx.spring_layout(G_naive, seed=42)
nx.draw_networkx_nodes(G_naive, pos, node_size=50)
nx.draw_networkx_edges(G_naive, pos, alpha=0.5)
nx.draw_networkx_labels(G_naive, pos, font_size=8)
plt.title("Naive Country Network Projection")
plt.axis('off')
plt.show()

#%% BICM PROJECTION

myGraph = BipartiteGraph()
myGraph.set_biadjacency_matrix(binary_matrix)
myGraph.compute_projection(rows=True, alpha=0.02, method='poisson', threads_num=4, progress_bar=True)

rows_edges = myGraph.get_rows_projection(fmt='edgelist')  # list of edges (i,j) among row nodes (countries)

G_bicm = nx.Graph()
G_bicm.add_nodes_from(range(num_countries))
G_bicm.add_edges_from(rows_edges)
G_bicm = nx.relabel_nodes(G_bicm, mapping)

# Visualize the BICM network
plt.figure(figsize=(10,10))
pos_bicm = nx.spring_layout(G_bicm, seed=1)
nx.draw_networkx_nodes(G_bicm, pos_bicm, node_size=50)
nx.draw_networkx_edges(G_bicm, pos_bicm, alpha=0.5)
nx.draw_networkx_labels(G_bicm, pos_bicm, font_size=8)
plt.title("Country Network Projection via BICM")
plt.axis('off')
plt.show()

#%% STEP 5: COMMUNITY DETECTION (LOUVAIN)

partition = community_louvain.best_partition(G_bicm)
communities = set(partition.values())

colors = list(mcolors.TABLEAU_COLORS.keys())
node_colors = [colors[comm % len(colors)] for comm in partition.values()]

plt.figure(figsize=(10,10))
nx.draw_networkx_nodes(G_bicm, pos_bicm, node_size=100, node_color=node_colors)
nx.draw_networkx_edges(G_bicm, pos_bicm, alpha=0.5)

# Label a subset of countries identified by their ISO3 codes
iso3_labels_to_show = ["CHN", "USA", "DEU", "JPN", "BRA"]
label_nodes = {n: n for n in G_bicm.nodes if n in iso3_labels_to_show}

nx.draw_networkx_labels(G_bicm, pos_bicm, labels=label_nodes, font_size=10)

plt.title("Louvain Communities in the Country Network (ISO3 Codes)")
plt.axis('off')
plt.show()

#%% BONUS: GET COMMUNITIES NAMES WITH CHAT GPT 

from collections import defaultdict

# Group countries by their community
community_dict = defaultdict(list)
for node, comm_id in partition.items():
    community_dict[comm_id].append(node)

# Generate textual descriptions
community_descriptions = []
for comm_id, members in community_dict.items():
    # Sort members alphabetically for neatness
    members = sorted(members)
    num_countries = len(members)
    
    # Create a textual summary
    text = f"Community {comm_id}:\n"
    text += f"Number of countries: {num_countries}\n"
    text += "Countries: " + ", ".join(members) + "\n"
   
    community_descriptions.append(text)

# Print out or store the descriptions
for desc in community_descriptions:
    print(desc)
    print("-" * 50)

#%% BONUS: PLOT WITH COMMUNITY NAMES

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import networkx as nx

# Assuming the following variables are already defined:
# G_bicm: the country network graph
# pos_bicm: positions of nodes for plotting
# partition: dictionary {node: community_id}

# Define community categories and colors
community_info = {
    0: ("Emerging Industrial and Agrarian Exporters", "tab:blue"),
    1: ("Advanced Industrial and Technology-Intensive Exporters", "tab:green"),
    2: ("Energy and Resource-Oriented Exporters", "tab:red"),
    3: ("Primary Commodity and Mixed-Resource Exporters", "tab:purple")
}

plt.figure(figsize=(12, 12))
nx.draw_networkx_edges(G_bicm, pos_bicm, edge_color='lightgray', alpha=0.8)

# Draw each community separately
legend_handles = []
for comm_id, (comm_name, comm_color) in community_info.items():
    # Get the nodes in this community
    comm_nodes = [n for n, c in partition.items() if c == comm_id]
    # Draw them
    node_collection = nx.draw_networkx_nodes(
        G_bicm,
        pos_bicm,
        nodelist=comm_nodes,
        node_color=comm_color,
        node_size=50,
        label=comm_name
    )
    # Prepare a legend handle (a patch with the color and name)
    patch = mpatches.Patch(color=comm_color, label=comm_name)
    legend_handles.append(patch)

# Optionally label a subset of nodes if you like (ISO3 codes already in nodes)
iso3_labels_to_show = ["CHN", "USA", "DEU", "JPN", "BRA", "UGA", "SAU", "RUS", "SEN", "IND", "PAK"]
label_nodes = {n: n for n in G_bicm.nodes if n in iso3_labels_to_show}
nx.draw_networkx_labels(G_bicm, pos_bicm, labels=label_nodes, font_size=22)

plt.legend(handles=legend_handles, loc='best', fontsize = 15)
plt.axis('off')
plt.savefig('country_communities.png', dpi=300, bbox_inches='tight')
plt.show()