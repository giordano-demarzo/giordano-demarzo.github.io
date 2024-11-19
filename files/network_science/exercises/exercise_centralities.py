#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Nov 19 01:01:55 2024

@author: giordano
"""

import json
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

# File paths
edgelist_file = "formatted_congress.edgelist"  # The cleaned edgelist file
json_file = "congress_network_data.json"       # The JSON file with username data

# Import the network from the cleaned edgelist
G = nx.read_weighted_edgelist(edgelist_file, create_using=nx.DiGraph(), nodetype=int)

# Load the username list from the JSON file
with open(json_file, 'r') as f:
    data = json.load(f)
    
usernames = data[0]['usernameList']

#%%PLOT WITH NODE SIZE PROPORTIONAL TO STRENGTH 

# Compute out_strength
out_strength = {node: sum(data['weight'] for _, _, data in G.out_edges(node, data=True)) for node in G.nodes()}

# Normalize out-strength for node size
strength_values = np.array(list(out_strength.values()))
normalized_node_sizes = 100 * strength_values / strength_values.mean()

# Sort nodes by strength and select top 15
top_10_nodes = sorted(out_strength.items(), key=lambda x: x[1], reverse=True)[:10]
top_10_labels = {node: usernames[node] for node, _ in top_10_nodes}

# Generate a spring layout
pos = nx.spring_layout(G, seed=42)

# Normalize edge widths so the maximum width is 25
max_width = 5
edge_weights = np.array([data['weight'] for _, _, data in G.edges(data=True)])
normalized_edge_widths = max_width * edge_weights / edge_weights.max()

# Plot with size proportional to strength and single color
plt.figure(figsize=(8, 8))
nx.draw(
    G, pos,
    with_labels=False,
    node_size=normalized_node_sizes,  # Node size scales with strength
    node_color="skyblue",  # Uniform color
    edge_color="gray",
    width=normalized_edge_widths,  # Scaled edge widths
    alpha=0.7,
    arrowsize=10
)
# Highlight labels for the top 10 nodes
nx.draw_networkx_labels(G, pos, labels=top_10_labels, font_size=10, font_color="red")

plt.title("Node Size: Scaled by Strength, Edge Width Scaled by Weight")
plt.savefig('network_strength_and_edge_width_scaled.png', dpi=300, bbox_inches='tight', transparent=False)
plt.show()

#%%COMPUTE OTHER CENTRALITY MEASURES

# Compute PageRank on the reversed graph
# Reverse the graph for PageRank computation
G_reversed = G.reverse()
pagerank = nx.pagerank(G_reversed, alpha=0.85, weight='weight')
pagerank_values = np.array(list(pagerank.values()))

# Compute betweenness centrality
betweenness = nx.betweenness_centrality(G, weight='weight', normalized=True)
betweenness_values = np.array(list(betweenness.values()))

#%%TABLE WITH TOP NODES BY CENTRALITY 
import pandas as pd

# Extract top nodes by each centrality measure
top_out_strength = sorted(out_strength.items(), key=lambda x: x[1], reverse=True)[:10]
top_pagerank = sorted(pagerank.items(), key=lambda x: x[1], reverse=True)[:10]
top_betweenness = sorted(betweenness.items(), key=lambda x: x[1], reverse=True)[:10]

# Create a DataFrame
table_data = {
    "Rank": range(1, 11),
    "Top Out-Strength Nodes": [usernames[node] for node, _ in top_out_strength],
    "Top PageRank Nodes": [usernames[node] for node, _ in top_pagerank],
    "Top Betweenness Nodes": [usernames[node] for node, _ in top_betweenness]
}

centrality_table = pd.DataFrame(table_data)

# Display the table for the students
print(centrality_table)
centrality_table.to_csv("centrality_table.csv", index=False)  # Save to a CSV file

#%%SCATTER PLOT STRENGTH VS OTHER CENTRALITIES 

import matplotlib.pyplot as plt

# Convert centralities to arrays for scatter plot
strength_values = np.array(list(out_strength.values()))
pagerank_values = np.array(list(pagerank.values()))
betweenness_values = np.array(list(betweenness.values()))

# Scatter plot: Strength vs PageRank
plt.figure(figsize=(8, 6))
plt.scatter(strength_values, pagerank_values, alpha=0.7, edgecolors='k')
plt.xlabel("Out-Strength")
plt.ylabel("PageRank (Reversed)")
plt.title("Out-Strength vs PageRank")
plt.grid(True)
plt.savefig('strength_vs_pagerank.png', dpi=300, bbox_inches='tight')
plt.show()

# Scatter plot: Strength vs Betweenness Centrality
plt.figure(figsize=(8, 6))
plt.scatter(strength_values, betweenness_values, alpha=0.7, edgecolors='k')
plt.xlabel("Out-Strength")
plt.ylabel("Betweenness Centrality")
plt.title("Out-Strength vs Betweenness Centrality")
plt.grid(True)
plt.savefig('strength_vs_betweenness.png', dpi=300, bbox_inches='tight')
plt.show()
# Compute out-strength (sum of outgoing edge weights) for each node



#%%PLOT WITH COLORS GIVEN BY STRENGTH

# Normalize out-strength for colormap (0–1 normalization)
normalized_out_strength = (strength_values - strength_values.min()) / (strength_values.max() - strength_values.min())

# Plot Out-Strength with color scaling
plt.figure(figsize=(8, 8))
nx.draw(
    G, pos,
    with_labels=False,
    node_size=150,  # Fixed size
    node_color=normalized_out_strength,  # Color by normalized out-strength
    cmap=plt.cm.plasma,
    edge_color="gray",
    width=normalized_edge_widths,  # Scaled edge widths
    alpha=0.7,
    arrowsize=10
)
plt.title("Node Color: Out-Strength")
plt.colorbar(
    plt.cm.ScalarMappable(cmap=plt.cm.plasma, norm=plt.Normalize(vmin=0, vmax=1)),  # Unified scale
    label="Normalized Out-Strength"
)
plt.savefig('network_out_strength_normalized.png', dpi=150, bbox_inches='tight', transparent=False)
plt.show()

#%%PLOT WITH COLORS GIVEN BY PAGERANK

# Normalize PageRank for colormap (0–1 normalization)
normalized_pagerank = (pagerank_values - pagerank_values.min()) / (pagerank_values.max() - pagerank_values.min())

# Plot PageRank (Reversed)
plt.figure(figsize=(8, 8))
nx.draw(
    G, pos,
    with_labels=False,
    node_size=150,  # Fixed size
    node_color=normalized_pagerank,  # Color by normalized PageRank
    cmap=plt.cm.plasma,  # Same colormap for all plots
    edge_color="gray",
    width=normalized_edge_widths,  # Scaled edge widths
    alpha=0.7,
    arrowsize=10
)
plt.title("Node Color: PageRank Centrality (Reversed)")
plt.colorbar(
    plt.cm.ScalarMappable(cmap=plt.cm.plasma, norm=plt.Normalize(vmin=0, vmax=1)),  # Unified scale
    label="Normalized PageRank"
)
plt.savefig('network_pagerank_reversed_normalized.png', dpi=150, bbox_inches='tight', transparent=False)
plt.show()

#%%PLOT WITH COLORS GIVEN BY BETWEENNESS

# Normalize betweenness centrality for colormap (0–1 normalization)
normalized_betweenness = (betweenness_values - betweenness_values.min()) / (betweenness_values.max() - betweenness_values.min())

# Plot Betweenness Centrality
plt.figure(figsize=(8, 8))
nx.draw(
    G, pos,
    with_labels=False,
    node_size=150,  # Fixed size
    node_color=normalized_betweenness,  # Color by normalized betweenness
    cmap=plt.cm.plasma,  # Same colormap for all plots
    edge_color="gray",
    width=normalized_edge_widths,  # Scaled edge widths
    alpha=0.7,
    arrowsize=10
)
plt.title("Node Color: Betweenness Centrality")
plt.colorbar(
    plt.cm.ScalarMappable(cmap=plt.cm.plasma, norm=plt.Normalize(vmin=0, vmax=1)),  # Unified scale
    label="Normalized Betweenness Centrality"
)
plt.savefig('network_betweenness_normalized.png', dpi=150, bbox_inches='tight', transparent=False)
plt.show()



