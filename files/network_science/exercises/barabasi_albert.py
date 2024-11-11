#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Nov 11 21:00:25 2024

@author: giordano
"""

import numpy as np
import networkx as nx
import matplotlib.pyplot as plt

# Step 1: Define the BA Model as a Function
def barabasi_albert(n, m):
    """
    Generates an adjacency matrix for a Barabási-Albert (BA) network.
    
    Parameters:
    - n: total number of nodes in the network.
    - m: number of edges each new node will connect to (should be <= initial nodes).
    
    Returns:
    - adj_matrix: adjacency matrix of the BA network.
    - degrees: list of node degrees.
    """
    adj_matrix = np.zeros((n, n), dtype=int)
    degrees = [m] * (m + 1)
    
    # Initialize fully connected subgraph of m+1 nodes
    for i in range(m + 1):
        for j in range(i + 1, m + 1):
            adj_matrix[i][j] = 1
            adj_matrix[j][i] = 1
    
    # Add each new node with preferential attachment
    for new_node in range(m + 1, n):
        targets = []
        prob_distribution = np.cumsum(degrees) / np.sum(degrees)
        
        while len(targets) < m:
            rand_val = np.random.rand()
            selected = np.searchsorted(prob_distribution, rand_val)
            if selected not in targets:
                targets.append(selected)
        
        for target in targets:
            adj_matrix[new_node][target] = 1
            adj_matrix[target][new_node] = 1
            degrees[target] += 1
        degrees.append(m)
    
    return adj_matrix, degrees

# Parameters for the Barabási-Albert model
n_total = 1000  # Total number of nodes
m = 2           # Number of edges each new node will connect to
snapshots = [200, 500, 1000]  # Snapshots of network sizes to visualize

# Generate the BA network with a large number of nodes
adj_matrix, degrees = barabasi_albert(n_total, m)

# Create figure to visualize snapshots side by side
fig, axes = plt.subplots(1, 3, figsize=(18, 6))
fig.suptitle("Barabási-Albert Network Snapshots at Different Growth Stages")

for idx, size in enumerate(snapshots):
    # Extract subgraph for the current snapshot size
    subgraph_nodes = range(size)
    subgraph = nx.from_numpy_matrix(adj_matrix[:size, :size])

    # Define node properties
    subgraph_degrees = degrees[:size]
    node_size = 500 * np.array(subgraph_degrees) / np.max(subgraph_degrees)
    node_color = np.arange(size)  # Color by age (node addition order)

    # Plot the subgraph in a subplot
    pos = nx.spring_layout(subgraph, seed=42)  # Use same seed for consistent layout
    nx.draw(subgraph, pos, ax=axes[idx], node_color=node_color, node_size=node_size, 
            cmap=plt.cm.viridis, edge_color="gray", alpha=0.7, with_labels=False)
    axes[idx].set_title(f"Network with N = {size}")

# Add color bar for node age across all subplots
sm = plt.cm.ScalarMappable(cmap=plt.cm.viridis)
plt.colorbar(sm, ax=axes, orientation="horizontal", label="Node Age")
plt.savefig('barabasi_albert_m=2_various_N.png', dpi=300, bbox_inches='tight')
plt.show()

# Step 4: Degree Distribution Analysis
plt.figure(figsize=(8, 6))

# Logarithmic Binning - Plot Degree Distribution in Log-Log Scale
log_bins = np.logspace(np.log10(min(degrees)), np.log10(max(degrees)), num=20)

# Plot degree distributions for all nodes in the final network (N = 1000)
counts, edges = np.histogram(degrees, bins=log_bins)
bin_centers = (edges[:-1] + edges[1:]) / 2
plt.plot(bin_centers, counts / np.diff(log_bins), marker='o', linestyle='none', label="Empirical Distribution")

# Theoretical scaling for comparison
theoretical_k = np.linspace(min(bin_centers), max(bin_centers), 100)
theoretical_y = 10000 * theoretical_k ** -3  # Adjust factor to fit plot
plt.plot(theoretical_k, theoretical_y, linestyle='--', color="black", label="Theoretical 1/k^3")

# Set log-log scale and labels
plt.yscale('log')
plt.xscale('log')
plt.xlabel("Degree")
plt.ylabel("Frequency Density")
plt.title("Degree Distribution (Logarithmic Binning)")
plt.legend()
plt.show()

#%%

# Step 5: Clustering and Average Path Length Scaling on Network Snapshots

# Define the different sizes of snapshots to analyze
# These are logarithmically spaced sizes, representing network growth points
network_sizes = [50, 100, 200, 500, 1000, 2000, 5000]

# Lists to store the average clustering coefficient and average path length for each snapshot size
avg_clustering = []
avg_path_length = []

# Loop over each network size to analyze the network at different growth stages
for size in network_sizes:
    # Create a subgraph that includes only the first 'size' nodes of the network
    subgraph_nodes = range(size)
    subgraph = nx.from_numpy_matrix(adj_matrix[:size, :size])
    
    # Calculate the average clustering coefficient for the subgraph
    clustering = nx.average_clustering(subgraph)
    avg_clustering.append(clustering)
    
    # Calculate the average shortest path length for the subgraph
    # Check if the subgraph is connected (path length is undefined for disconnected graphs)
    path_length = nx.average_shortest_path_length(subgraph)
    avg_path_length.append(path_length)

#%%

# Barabási-Albert theoretical scaling for average path length (diameter): ln(N) / ln(ln(N))
ba_theoretical_path_length = [np.log(size) / np.log(np.log(size)) for size in network_sizes]

# Barabási-Albert theoretical scaling for clustering coefficient: (ln(N))^2 / N
ba_theoretical_clustering = [(np.log(size) ** 2) / size for size in network_sizes]

# Random network theoretical scaling for average path length: ln(N)
random_theoretical_path_length = [np.log(size) for size in network_sizes]

# Random network theoretical scaling for clustering coefficient: 1 / N
random_theoretical_clustering = [1 / size for size in network_sizes]

# Plot Clustering and Path Length with Theoretical Scalings

plt.figure(figsize=(12, 5))

# Plot clustering coefficient scaling
plt.subplot(1, 2, 1)
plt.plot(network_sizes, avg_clustering, marker='o', label="Empirical Clustering")
plt.plot(network_sizes, 0.5*np.array(ba_theoretical_clustering), marker='s', linestyle='--', color='red', label="BA Theoretical Clustering $(\ln(N))^2 / N$")
plt.plot(network_sizes, 10*np.array(random_theoretical_clustering), marker='^', linestyle='--', color='blue', label="Random Network Clustering $1 / N$")
plt.xscale('log')
plt.yscale('log')
plt.xlabel("Network Size")
plt.ylabel("Average Clustering Coefficient")
plt.title("Clustering Coefficient Scaling")
plt.legend()

# Plot average path length (diameter) scaling
plt.subplot(1, 2, 2)
plt.plot(network_sizes, avg_path_length, marker='o', label="Empirical Path Length")
plt.plot(network_sizes, 1.15*np.array(ba_theoretical_path_length), marker='s', linestyle='--', color='red', label="BA Theoretical Path Length $\ln(N) / \ln(\ln(N))$")
plt.plot(network_sizes,  0.66*np.array(random_theoretical_path_length), marker='^', linestyle='--', color='blue', label="Random Network Path Length $\ln(N)$")
plt.xscale('log')
plt.yscale('log')
plt.xlabel("Network Size")
plt.ylabel("Average Path Length")
plt.title("Path Length Scaling")
plt.legend()

plt.show()

#%%

import numpy as np
import networkx as nx
import matplotlib.pyplot as plt

# Define the Nonlinear Preferential Attachment Model as a Function
def nonlinear_barabasi_albert(n, m, alpha):
    """
    Generates an adjacency matrix for a nonlinear Barabási-Albert (BA) network with preferential attachment.
    
    Parameters:
    - n: Total number of nodes in the network.
    - m: Number of edges each new node will connect to.
    - alpha: Nonlinear attachment exponent.
    
    Returns:
    - adj_matrix: Adjacency matrix of the network.
    - degrees: List of node degrees.
    """
    adj_matrix = np.zeros((n, n), dtype=int)
    degrees = [m] * (m + 1)
    
    # Initialize fully connected subgraph of m+1 nodes
    for i in range(m + 1):
        for j in range(i + 1, m + 1):
            adj_matrix[i][j] = 1
            adj_matrix[j][i] = 1
    
    # Add each new node with nonlinear preferential attachment
    for new_node in range(m + 1, n):
        targets = []
        
        # Compute the nonlinear preferential attachment probability
        modified_degrees = np.array(degrees) ** alpha
        prob_distribution = np.cumsum(modified_degrees) / np.sum(modified_degrees)
        
        # Select m unique target nodes
        while len(targets) < m:
            rand_val = np.random.rand()
            selected = np.searchsorted(prob_distribution, rand_val)
            if selected not in targets:
                targets.append(selected)
        
        # Add edges to the new node and update degrees
        for target in targets:
            adj_matrix[new_node][target] = 1
            adj_matrix[target][new_node] = 1
            degrees[target] += 1
        degrees.append(m)
    
    return adj_matrix, degrees

# Parameters for the model
n = 2000  # Total number of nodes
m = 3     # Number of edges each new node will connect to
alphas = [0.5, 1, 2]  # Different values for alpha

# Plot networks side by side
fig, axes = plt.subplots(1, 3, figsize=(18, 6))

# Store degrees for each alpha to use in the degree distribution plot
all_degrees = []

for idx, alpha in enumerate(alphas):
    # Generate the network
    adj_matrix, degrees = nonlinear_barabasi_albert(n, m, alpha)
    G = nx.from_numpy_matrix(adj_matrix)
    all_degrees.append(degrees)
    
    # Plot the network in a subplot
    pos = nx.spring_layout(G, seed=42)
    node_size = 500 * np.array(degrees) / np.max(degrees)  # Scale node size based on degree
    nx.draw(G, pos, node_color=np.arange(n), node_size=node_size, cmap=plt.cm.viridis, 
            edge_color="gray", alpha=0.7, with_labels=False, ax=axes[idx])
    axes[idx].set_title(fr"Attachment exponent $\alpha = {alpha}$)")

plt.colorbar(plt.cm.ScalarMappable(cmap=plt.cm.viridis), ax=axes, label="Node Age", orientation="horizontal")
plt.savefig('barabasi_albert_nonlinear_various_exponents.png', dpi=300, bbox_inches='tight')
plt.show()

# Plot degree distributions on the same plot with theoretical scaling
plt.figure(figsize=(8, 6))

# Logarithmic binning for degree distribution and theoretical power-law line
log_bins = np.logspace(np.log10(min(min(all_degrees))), np.log10(max(max(all_degrees))), num=20)

for idx, degrees in enumerate(all_degrees):
    counts, edges = np.histogram(degrees, bins=log_bins)
    bin_centers = (edges[:-1] + edges[1:]) / 2
    plt.plot(bin_centers, counts / np.diff(log_bins), marker='o', linestyle='none', label=f"Alpha = {alphas[idx]}")

# Plot theoretical scaling 1/k^3
theoretical_k = np.linspace(min(bin_centers), max(bin_centers), 100)
theoretical_y = 10**4*theoretical_k ** -3
plt.plot(theoretical_k, theoretical_y, linestyle='--', color="black", label="Theoretical 1/k^3")

# Set log-log scale and labels
plt.yscale('log')
plt.xscale('log')
plt.xlabel("Degree")
plt.ylabel("Frequency Density")
plt.title("Degree Distribution for Different Alpha Values")
plt.legend()
plt.show()