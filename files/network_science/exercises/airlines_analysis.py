# Import libraries and data
import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

# Define column names
airport_columns = ["Airport ID", "Nome", "City", "Paese", "IATA", "ICAO",
                   "Latitudine", "Longitudine", "Altitude", "Timezone",
                   "Ora Legale", "Tz database timezone", "Tipo", "Source"]
route_columns = ["Compagnia aerea", "Airline ID", "Source airport", "Source airport ID",
                 "Destination airport", "Destination airport ID", "Codeshare",
                 "Stops", "Equipment"]

# Load datasets without headers
airports_df = pd.read_csv("airports.csv", names=airport_columns, encoding="utf-8")
routes_df = pd.read_csv("routes.csv", names=route_columns, encoding="utf-8")

# Ensure IDs in both datasets are strings for consistency
airports_df['Airport ID'] = airports_df['Airport ID'].astype(str)
routes_df['Source airport ID'] = routes_df['Source airport ID'].astype(str)
routes_df['Destination airport ID'] = routes_df['Destination airport ID'].astype(str)

# Create a dictionary for airport data with Airport ID as the key
airport_map = {
    row['Airport ID']: (row['Nome'], row['IATA'], row['Latitudine'], row['Longitudine'])
    for _, row in airports_df.iterrows() if row['Tipo'] == 'airport'
}

# Filter out routes that don’t map to valid airports in both source and destination
routes_df_filtered = routes_df[
    routes_df['Source airport ID'].isin(airport_map.keys()) &
    routes_df['Destination airport ID'].isin(airport_map.keys())
]

#%% Create the Graph

# Create the Network Graph
G = nx.DiGraph()

# Add nodes with airport information
for airport_id, (name, code, lat, lon) in airport_map.items():
    G.add_node(airport_id, name=name, code=code, latitude=lat, longitude=lon)

# Add edges for valid routes
for _, row in routes_df_filtered.iterrows():
    source_id = row['Source airport ID']
    destination_id = row['Destination airport ID']
    G.add_edge(source_id, destination_id)

# Remove isolated nodes
isolated_nodes = [node for node, degree in dict(G.degree()).items() if degree == 0]
G.remove_nodes_from(isolated_nodes)


#%% Filter nodes for better plot 

# Calculate degree for all nodes and filter to keep only the top 500 by degree
degree_dict = dict(G.degree)
top_200_nodes = sorted(degree_dict, key=degree_dict.get, reverse=True)[:200]
G_sub = G.subgraph(top_200_nodes).copy()  # Subgraph with only top 500 nodes
 
# Identify the top 10 most connected airports within the top 500 for special coloring
top_10_airports = sorted(degree_dict, key=degree_dict.get, reverse=True)[:10]
top_10_colors = ["#FFD1DC", "#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9",
                 "#BAE1FF", "#DCC8FF", "#C2FFDB", "#FFDAC8", "#FFC0CB"]

# Mapping for color assignment
node_colors = []
node_sizes = []
for node in G_sub.nodes():
    if node in top_10_airports:
        node_colors.append(top_10_colors[top_10_airports.index(node)])
        node_sizes.append(100)
    else:
        node_colors.append("skyblue")
        node_sizes.append(10)


# Create a legend for the top 10 airports
legend_elements = [Line2D([0], [0], marker='o', color='w', label=G.nodes[node]['name'],
                          markersize=10, markerfacecolor=top_10_colors[idx])
                   for idx, node in enumerate(top_10_airports)]

#%%


#%%Plot 1: Geographical Coordinates

plt.figure(figsize=(12, 8))

# Position dictionary for geographic plotting
pos_geo = {node: (data['longitude'], data['latitude']) for node, data in G_sub.nodes(data=True)}

# Draw nodes and edges
nx.draw_networkx_nodes(G_sub, pos_geo, node_size=node_sizes, node_color=node_colors, alpha=0.7)
nx.draw_networkx_edges(G_sub, pos_geo, edge_color='gray', alpha=0.5, width=0.5)

# Add legend
plt.legend(handles=legend_elements, loc='lower left', title="Top 10 Airports")
plt.title("Top 200 Most Connected Airports and Routes (Geographical Coordinates)")
plt.xlabel("Longitude")
plt.ylabel("Latitude")
plt.savefig('airports_network_geo.png', dpi=300, bbox_inches='tight')
plt.show()

#%%Plot 2: Force-Directed Layout with Reduced Node Size

plt.figure(figsize=(12, 12))
pos_spring = nx.spring_layout(G_sub, seed=1)

# Draw nodes with a reduced size based on degree
node_sizes = [degree_dict[node] * 1 for node in G_sub.nodes()]  # Reduced scaling factor for smaller nodes
nx.draw_networkx_nodes(G_sub, pos_spring, node_size=node_sizes, node_color=node_colors, alpha=0.7)

# Draw edges
nx.draw_networkx_edges(G_sub, pos_spring, edge_color='gray', alpha=0.5)

# Add legend
plt.legend(handles=legend_elements, loc='upper left', title="Top 10 Airports")
plt.title("Top 200 Most Connected Airports and Routes (Force-Directed Layout)")
plt.axis("off")
plt.savefig('airports_network_spring.png', dpi=300, bbox_inches='tight')
plt.show()

#%% Analyze Weakly Connected Components

weakly_connected_components = list(nx.weakly_connected_components(G))
largest_weak_component = max(weakly_connected_components, key=len)

print("Number of Weakly Connected Components:", len(weakly_connected_components))
print("Relative Size of Largest Weakly Connected Component:", len(largest_weak_component)/len(G.nodes))

#%% Analyze Strongly Connected Components

strongly_connected_components = list(nx.strongly_connected_components(G))
largest_strong_component = max(strongly_connected_components, key=len)

print("Number of Strongly Connected Components:", len(weakly_connected_components))
print("Relative Size of Largest Strong Connected Component:", len(largest_weak_component)/len(G.nodes))


#%% Filter the Graph for Largest Connected Component

G = G.subgraph(largest_strong_component).copy()

#%% Compute density

density = nx.density(G)
print("Density:", density) 

#%% Compute Reciprocity

reciprocity = nx.reciprocity(G)
print("Reciprocity:", reciprocity)


#%% Compute Network Size 

path_lengths = dict(nx.shortest_path_length(G))
all_lengths = [length for target_dict in path_lengths.values() for length in target_dict.values()]

# Plot the distribution of path lengths
plt.figure(figsize=(10, 6))
plt.hist(all_lengths, bins=10, color="skyblue", edgecolor="black")
plt.xlabel("Path Length")
plt.ylabel("Frequency")
plt.title("Distribution of Shortest Path Lengths")
plt.show()

# Compute Average Path Length
average_path_length_directed = nx.average_shortest_path_length(G)
print("Average Path Length (Directed):", average_path_length_directed)

# Compute Diameter
diameter_directed = nx.diameter(G)
print("Diameter (Directed):", diameter_directed)

#%% Identify Top Hubs by In-Degree and Out-Degree

top_in_hubs = sorted(G.in_degree(), key=lambda x: x[1], reverse=True)[:5]
top_out_hubs = sorted(G.out_degree(), key=lambda x: x[1], reverse=True)[:5]

# Retrieve names for in-degree hubs
top_in_hub_names = [G.nodes[node]["name"] for node, degree in top_in_hubs]
top_out_hub_names = [G.nodes[node]["name"]for node, degree in top_out_hubs]

print("Top 5 Hubs by In-Degree (Name, Degree):", top_in_hub_names)
print("Top 5 Hubs by Out-Degree (Name, Degree):", top_out_hub_names)

#%% Compute Global Clustering Coefficient

# For a directed graph, we compute the transitivity, which is the global clustering coefficient
global_clustering = nx.transitivity(G)
print("Global Clustering Coefficient:", global_clustering)

#%% Compute In-Degree Distribution

import numpy as np

# Calculate in-degree and plot the probability distribution
in_degree_sequence = [in_degree for node, in_degree in G.in_degree()]
in_degree_counts = np.bincount(in_degree_sequence)
in_degree_prob = in_degree_counts / sum(in_degree_counts)  # Normalize to get probability distribution

# Plot the in-degree distribution
plt.figure(figsize=(10, 6))
plt.plot(range(len(in_degree_prob)), in_degree_prob, marker="o", linestyle="None")
plt.xlabel("In-Degree")
plt.ylabel("Probability")
plt.title("In-Degree Probability Distribution")
plt.yscale("log")
plt.xscale("log")
plt.show()


#%% Compute Out-Degree Distribution

import numpy as np

# Calculate in-degree and plot the probability distribution
out_degree_sequence = [out_degree for node, out_degree in G.out_degree()]
out_degree_counts = np.bincount(out_degree_sequence)
out_degree_prob = out_degree_counts / sum(out_degree_counts)  # Normalize to get probability distribution

# Plot the in-degree distribution
plt.figure(figsize=(10, 6))
plt.plot(range(len(out_degree_prob)), out_degree_prob, marker="o", linestyle="None")
plt.xlabel("Out-Degree")
plt.ylabel("Probability")
plt.title("Out-Degree Probability Distribution")
plt.yscale("log")
plt.xscale("log")
plt.show()

#%% Scatter Plot for Assortativity Based on In-Degree

from scipy.stats import spearmanr

# Compute the assortativity by comparing in-degree with neighbors' average in-degree
average_neighbor_in_degree = nx.average_neighbor_degree(G, weight=None, source="in", target="in")
node_in_degrees = dict(G.in_degree())

# Create lists for plotting
x_in_degrees = []
y_avg_neighbor_in_degrees = []

for node, in_degree in node_in_degrees.items():
    x_in_degrees.append(in_degree)
    y_avg_neighbor_in_degrees.append(average_neighbor_in_degree[node])

# Scatter plot
plt.figure(figsize=(10, 6))
plt.scatter(x_in_degrees, y_avg_neighbor_in_degrees, alpha=0.6)
plt.xlabel("In-Degree")
plt.ylabel("Average Neighbor In-Degree")
plt.title("In-Degree Assortativity (In-Degree vs. Neighbor's In-Degree)")
plt.xscale("log")
plt.yscale("log")
plt.show()

spearman_corr, p = spearmanr(x_in_degrees, y_avg_neighbor_in_degrees)
print(spearman_corr, p)

#%% Assortativity Analysis Based on Latitude and Longitude

# Calculate the average latitude and longitude of neighbors for each airport
average_neighbor_latitude = {
    node: np.mean([G.nodes[neighbor]["latitude"] for neighbor in G.predecessors(node)])
    for node in G.nodes() if G.predecessors(node)
}

average_neighbor_longitude = {
    node: np.mean([G.nodes[neighbor]["longitude"] for neighbor in G.predecessors(node)])
    for node in G.nodes() if G.predecessors(node)
}

# Prepare data for latitude assortativity plot
node_latitudes = np.array([G.nodes[node]["latitude"] for node in G.nodes()])
avg_neighbor_latitudes = np.array(list(average_neighbor_latitude.values()))

# Prepare data for longitude assortativity plot
node_longitudes = np.array([G.nodes[node]["longitude"] for node in G.nodes()])
avg_neighbor_longitudes = np.array(list(average_neighbor_longitude.values()))

#%% Latitude Assortativity Plot with Binning and Boxplots

# Binning for latitude
num_bins = 10
latitude_bin_edges = np.linspace(node_latitudes.min(), node_latitudes.max(), num_bins + 1)
latitude_bin_indices = np.digitize(node_latitudes, latitude_bin_edges)
binned_latitude_values = [avg_neighbor_latitudes[latitude_bin_indices == i] for i in range(1, num_bins + 1)]

# Boxplot for latitude assortativity
plt.figure(figsize=(10, 6))
plt.boxplot(binned_latitude_values, positions=(latitude_bin_edges[:-1] + latitude_bin_edges[1:]) / 2, widths=1, manage_ticks=False)
plt.xlabel("Latitude")
plt.ylabel("Average Neighbor Latitude")
plt.title("Latitude Assortativity Analysis (Latitude vs. Average Neighbor Latitude)")

# Spearman correlation for latitude
spearman_corr_lat, _ = spearmanr(node_latitudes, avg_neighbor_latitudes)
plt.figtext(0.15, 0.8, f"Spearman Correlation (Latitude): {spearman_corr_lat:.2f}", fontsize=12, color="blue")

plt.show()

#%% Longitude Assortativity Plot with Binning and Boxplots

# Binning for longitude
longitude_bin_edges = np.linspace(node_longitudes.min(), node_longitudes.max(), num_bins + 1)
longitude_bin_indices = np.digitize(node_longitudes, longitude_bin_edges)
binned_longitude_values = [avg_neighbor_longitudes[longitude_bin_indices == i] for i in range(1, num_bins + 1)]

# Boxplot for longitude assortativity
plt.figure(figsize=(10, 6))
plt.boxplot(binned_longitude_values, positions=(longitude_bin_edges[:-1] + longitude_bin_edges[1:]) / 2, widths=1, manage_ticks=False)
plt.xlabel("Longitude")
plt.ylabel("Average Neighbor Longitude")
plt.title("Longitude Assortativity Analysis (Longitude vs. Average Neighbor Longitude)")

# Spearman correlation for longitude
spearman_corr_lon, _ = spearmanr(node_longitudes, avg_neighbor_longitudes)
plt.figtext(0.15, 0.8, f"Spearman Correlation (Longitude): {spearman_corr_lon:.2f}", fontsize=12, color="blue")

plt.show()



