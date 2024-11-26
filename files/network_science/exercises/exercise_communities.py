#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Nov 26 12:58:02 2024

@author: giordano
"""

#%%IMPORT DATA AND VISUALIZE NETWORK

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

# Compute out_strength
out_strength = {node: sum(data['weight'] for _, _, data in G.out_edges(node, data=True)) for node in G.nodes()}

# Normalize out-strength for node size
strength_values = np.array(list(out_strength.values()))
normalized_node_sizes = 100 * strength_values / strength_values.mean()

# Generate a spring layout
pos = nx.spring_layout(G, seed=42)

# Normalize edge widths
max_width = 5
edge_weights = np.array([data['weight'] for _, _, data in G.edges(data=True)])
normalized_edge_widths = max_width * edge_weights / edge_weights.max()

# Plot the network
plt.figure(figsize=(8, 8))
nx.draw(
    G, pos,
    with_labels=False,
    node_size=normalized_node_sizes,
    node_color="skyblue",
    edge_color="gray",
    width=normalized_edge_widths,
    alpha=0.7,
    arrowsize=10
)
plt.title("Node Size: Scaled by Strength, Edge Width Scaled by Weight")
plt.savefig('network_strength_and_edge_width_scaled.png', dpi=300, bbox_inches='tight', transparent=False)
plt.show()

#%%GREEDY MODULARITY MAXIMIZATION 

from networkx.algorithms.community import greedy_modularity_communities
from matplotlib.cm import get_cmap

# Find communities using greedy modularity maximization
communities = list(greedy_modularity_communities(G))
print(nx.algorithms.community.quality.modularity(G, communities))

# Assign a community color to each node
community_colors = {}
cmap = get_cmap("tab20")
for idx, community in enumerate(communities):
    for node in community:
        community_colors[node] = cmap(idx)

# Plot the network with community coloring
plt.figure(figsize=(8, 8))
nx.draw(
    G, pos,
    with_labels=False,
    node_size=normalized_node_sizes,
    node_color=[community_colors[node] for node in G.nodes()],
    edge_color="gray",
    width=normalized_edge_widths,
    alpha=0.7,
    arrowsize=10
)
plt.title("Network Colored by Communities (Greedy Modularity)")
plt.savefig('network_community_greedy.png', dpi=300, bbox_inches='tight', transparent=False)
plt.show()

#%%SHOW TOP NODES FOR EACH COMMUNITY 

import pandas as pd

# Calculate node strengths
node_strengths = {node: sum(data['weight'] for _, _, data in G.out_edges(node, data=True)) for node in G.nodes()}

# Organize nodes into communities
community_nodes = {idx: [] for idx in range(len(communities))}
for idx, community in enumerate(communities):
    for node in community:
        community_nodes[idx].append(node)

# Get the top 5 nodes by strength for each community
top_nodes_by_community = {}
for community_idx, nodes in community_nodes.items():
    sorted_nodes = sorted(nodes, key=lambda x: node_strengths[x], reverse=True)[:3]
    top_nodes_by_community[community_idx] = [usernames[node] for node in sorted_nodes]

# Create a DataFrame
max_communities = max(top_nodes_by_community.keys()) + 1
columns = [f"Community {i}" for i in range(max_communities)]
data = {col: top_nodes_by_community.get(i, []) for i, col in enumerate(columns)}
top_nodes_table = pd.DataFrame(data)

# Display the table
print("Top 3 Nodes by Strength for Each Community")
print(top_nodes_table)


#%%LOUVAIN ALGORITHM 

import community as community_louvain

# Function to compute modularity
def compute_modularity_louvain(G, partition):
    """Convert partition to list of communities and compute modularity."""
    communities = [[] for _ in range(max(partition.values()) + 1)]
    for node, comm in partition.items():
        communities[comm].append(node)
    return nx.algorithms.community.quality.modularity(G, communities)


# Compute Louvain communities
partition = community_louvain.best_partition(G.to_undirected(), weight="weight")
modularity_score = compute_modularity_louvain(G.to_undirected(), partition)
print(modularity_score)

# Assign colors to nodes based on communities
louvain_colors = [partition[node] for node in G.nodes()]
pos = nx.spring_layout(G, seed=42)  # Reuse the layout from earlier

# Plot Louvain communities
plt.figure(figsize=(8, 8))
nx.draw(
    G, pos,
    with_labels=False,
    node_size=100,
    node_color=louvain_colors,
    cmap="tab20",
    edge_color="gray",
    width=0.5,
    alpha=0.7,
    arrowsize=10
)
plt.title(f"Louvain Communities\nModularity: {modularity_score:.3f}")
plt.savefig("louvain_communities.png", dpi=300, bbox_inches="tight", transparent=False)
plt.show()

#%%SHOW TOP NODES FOR EACH COMMUNITY 

import pandas as pd

# Calculate node strengths
node_strengths = {node: sum(data['weight'] for _, _, data in G.out_edges(node, data=True)) for node in G.nodes()}

# Organize nodes into communities from Louvain partition
louvain_community_nodes = {}
for node, community in partition.items():
    if community not in louvain_community_nodes:
        louvain_community_nodes[community] = []
    louvain_community_nodes[community].append(node)

# Get the top 5 nodes by strength for each community
top_nodes_by_community = {}
for community, nodes in louvain_community_nodes.items():
    sorted_nodes = sorted(nodes, key=lambda x: node_strengths[x], reverse=True)[:3]
    top_nodes_by_community[community] = [usernames[node] for node in sorted_nodes]

# Create a DataFrame
max_communities = max(top_nodes_by_community.keys()) + 1
columns = [f"Community {i}" for i in range(max_communities)]
data = {col: top_nodes_by_community.get(i, []) for i, col in enumerate(columns)}
top_nodes_table = pd.DataFrame(data)

import numpy as np
import pandas as pd
from scipy.optimize import linear_sum_assignment

# HELPER FUNCTION TO ALIGN COMMUNITIES
def align_communities(reference_partition, current_partition):
    """
    Align the community labels of the current_partition with the reference_partition.
    This solves the label correspondence problem between different runs.
    """
    ref_labels = list(reference_partition.values())
    cur_labels = list(current_partition.values())

    # Create a contingency matrix between the two partitions
    max_label_ref = max(ref_labels) + 1
    max_label_cur = max(cur_labels) + 1
    contingency_matrix = np.zeros((max_label_ref, max_label_cur))

    for node, ref_label in reference_partition.items():
        cur_label = current_partition[node]
        contingency_matrix[ref_label][cur_label] += 1

    # Solve the assignment problem to maximize the matching
    row_ind, col_ind = linear_sum_assignment(-contingency_matrix)  # Maximize overlap

    # Map current labels to reference labels
    label_mapping = {col: row for row, col in zip(row_ind, col_ind)}

    # Generate the aligned partition
    aligned_partition = {node: label_mapping[current_partition[node]] for node in current_partition}
    return aligned_partition

# Run Louvain 10 times and align community labels
n_trials = 10
node_assignments = {node: [] for node in G.nodes()}
first_partition = community_louvain.best_partition(G.to_undirected(), weight="weight", random_state=0)

for seed in range(n_trials):
    current_partition = community_louvain.best_partition(G.to_undirected(), weight="weight", random_state=seed)
    aligned_partition = align_communities(first_partition, current_partition)
    for node, aligned_label in aligned_partition.items():
        node_assignments[node].append(aligned_label)

# Calculate fluctuation percentages
fluctuations = {}
for node, assignments in node_assignments.items():
    unique, counts = np.unique(assignments, return_counts=True)
    fluctuation_percentage = 1 - max(counts) / n_trials  # Proportion of times the node changes community
    fluctuations[node] = fluctuation_percentage

# Sort nodes by fluctuation percentages
sorted_fluctuations = sorted(fluctuations.items(), key=lambda x: x[1], reverse=True)

# Top 10 fluctuating nodes
top_fluctuating = sorted_fluctuations[:10]
# Bottom 10 fluctuating nodes (least fluctuating)
least_fluctuating = sorted_fluctuations[-10:]

# Create tables
top_fluctuating_table = pd.DataFrame({
    "Name": [usernames[node] for node, _ in top_fluctuating],
    "Fluctuation (%)": [f"{fluc * 100:.2f}" for _, fluc in top_fluctuating]
})

least_fluctuating_table = pd.DataFrame({
    "Name": [usernames[node] for node, _ in least_fluctuating],
    "Fluctuation (%)": [f"{fluc * 100:.2f}" for _, fluc in least_fluctuating]
})

# Display tables
print("Top 10 Most Fluctuating Nodes")
print(top_fluctuating_table)
print("\nTop 10 Least Fluctuating Nodes")
print(least_fluctuating_table)


# Display the table
print("Top 3 Nodes by Strength for Each Louvain Community")
print(top_nodes_table)


#%% LOUVAIN COMMUNITY FLUCTUATIONS

import community as community_louvain
import numpy as np
import pandas as pd
from scipy.optimize import linear_sum_assignment

# HELPER FUNCTION TO ALIGN COMMUNITIES
def align_communities(reference_partition, current_partition):
    """
    Align the community labels of the current_partition with the reference_partition.
    This solves the label correspondence problem between different runs.
    """
    ref_labels = list(reference_partition.values())
    cur_labels = list(current_partition.values())

    # Create a contingency matrix between the two partitions
    max_label_ref = max(ref_labels) + 1
    max_label_cur = max(cur_labels) + 1
    contingency_matrix = np.zeros((max_label_ref, max_label_cur))

    for node, ref_label in reference_partition.items():
        cur_label = current_partition[node]
        contingency_matrix[ref_label][cur_label] += 1

    # Solve the assignment problem to maximize the matching
    row_ind, col_ind = linear_sum_assignment(-contingency_matrix)  # Maximize overlap

    # Map current labels to reference labels
    label_mapping = {col: row for row, col in zip(row_ind, col_ind)}

    # Generate the aligned partition
    aligned_partition = {node: label_mapping[current_partition[node]] for node in current_partition}
    return aligned_partition

# Run Louvain 10 times and align community labels
n_trials = 10
node_assignments = {node: [] for node in G.nodes()}
first_partition = community_louvain.best_partition(G.to_undirected(), weight="weight", random_state=0)

for seed in range(n_trials):
    current_partition = community_louvain.best_partition(G.to_undirected(), weight="weight", random_state=seed)
    aligned_partition = align_communities(first_partition, current_partition)
    for node, aligned_label in aligned_partition.items():
        node_assignments[node].append(aligned_label)

# Calculate fluctuation percentages
fluctuations = {}
for node, assignments in node_assignments.items():
    unique, counts = np.unique(assignments, return_counts=True)
    fluctuation_percentage = 1 - max(counts) / n_trials  # Proportion of times the node changes community
    fluctuations[node] = fluctuation_percentage

# Sort nodes by fluctuation percentages
sorted_fluctuations = sorted(fluctuations.items(), key=lambda x: x[1], reverse=True)

# Top 10 fluctuating nodes
top_fluctuating = sorted_fluctuations[:10]
# Bottom 10 fluctuating nodes (least fluctuating)
least_fluctuating = sorted_fluctuations[-10:]

# Create tables
top_fluctuating_table = pd.DataFrame({
    "Name": [usernames[node] for node, _ in top_fluctuating],
    "Fluctuation (%)": [f"{fluc * 100:.2f}" for _, fluc in top_fluctuating]
})

least_fluctuating_table = pd.DataFrame({
    "Name": [usernames[node] for node, _ in least_fluctuating],
    "Fluctuation (%)": [f"{fluc * 100:.2f}" for _, fluc in least_fluctuating]
})

# Display tables
print("Top 10 Most Fluctuating Nodes")
print(top_fluctuating_table)
print("\nTop 10 Least Fluctuating Nodes")
print(least_fluctuating_table)

