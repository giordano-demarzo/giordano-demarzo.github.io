import os
import json
import networkx as nx
import matplotlib.pyplot as plt
import numpy as np

# -----------------------------------------------------------------------------
# 0. PLOT A SAMPLE DIFFUSION TREE
# -----------------------------------------------------------------------------
def plot_sample_tree(source, label, data_dir, max_nodes=20):
    """
    Loads one JSON file from the given source+label folder and plots its diffusion tree.
    If the tree is very large, you may want to limit or sample nodes for clarity (via max_nodes).
    """
    folder_path = os.path.join(data_dir, f"{source}{label}")
    json_files = [f for f in os.listdir(folder_path) if f.endswith(".json")]
    if not json_files:
        print(f"No JSON files found in {folder_path}. Cannot plot sample tree.")
        return

    # Just pick the first JSON file for demonstration. 
    file_path = os.path.join(folder_path, json_files[0])
    with open(file_path, 'r') as f:
        data = json.load(f)

    # Build a DiGraph from the JSON structure
    G = nx.DiGraph()

    def add_edges(node):
        if 'children' in node:
            for child in node['children']:
                G.add_edge(node['id'], child['id'])
                add_edges(child)

    add_edges(data)

    # If it's very large, you could consider subgraphing or sampling here. 
    if G.number_of_nodes() > max_nodes:
        print(f"Tree has {G.number_of_nodes()} nodes. Only plotting the first {max_nodes} for clarity.")
        # Just pick a subset of nodes, for example:
        nodes_subset = list(G.nodes())[:max_nodes]
        G = G.subgraph(nodes_subset).copy()

    # Plot
    plt.figure(figsize=(10, 8))
    pos = nx.spring_layout(G, k=0.8, seed=42)  # spring_layout for clarity
    nx.draw_networkx_nodes(
        G, 
        pos,
        nodelist=pos.keys(),  # Only draw nodes that have a position
        node_size=300, 
        node_color="lightblue"
    )    
    nx.draw_networkx_edges(G, pos, arrowstyle='->', arrowsize=10)
    plt.title(f"Sample Diffusion Tree: {source}{label}")
    plt.axis("off")
    plt.show()


# -----------------------------------------------------------------------------
# 1. BASIC SETUP
# -----------------------------------------------------------------------------
data_dir = ""  # Replace with your actual dataset path
sources = ["politifact_", "gossipcop_"]
labels = ["fake", "real"]

# As an example, plot one tree from the first source/label combination:
plot_sample_tree(sources[0], labels[0], data_dir)

# -----------------------------------------------------------------------------
# 2. HELPER FUNCTIONS FOR BASIC ANALYSIS
# -----------------------------------------------------------------------------
def compute_tree_depth(graph):
    """Compute depth (longest path) in a directed acyclic graph."""
    if graph.number_of_nodes() == 0:
        return 0
    return nx.dag_longest_path_length(graph)

def compute_branching_factor(graph):
    """
    Compute the average out-degree over all nodes that actually have children 
    (i.e., out_degree > 0). This can exceed 1 if there's a 'viral' style branching.
    """
    internal_nodes = [n for n in graph.nodes() if graph.out_degree(n) > 0]
    if not internal_nodes:
        return 0.0
    return sum(graph.out_degree(n) for n in internal_nodes) / len(internal_nodes)

def analyze_diffusion_trees(source, label):
    """
    Loads all JSON files in `source+label` folder, builds Nx graphs,
    and returns three lists:
        depth_list         -> list of tree depths
        retweet_counts     -> list of total node counts
        branching_factors  -> list of branching factors
    """
    folder_path = os.path.join(data_dir, f"{source}{label}")
    depth_list = []
    retweet_counts = []
    branching_factors = []

    for file in os.listdir(folder_path):
        if file.endswith(".json"):
            file_path = os.path.join(folder_path, file)
            with open(file_path, 'r') as f:
                data = json.load(f)
                
                # Build a DiGraph from the JSON
                G = nx.DiGraph()
                
                def add_edges(node):
                    if 'children' in node:
                        for child in node['children']:
                            G.add_edge(node['id'], child['id'])
                            add_edges(child)

                add_edges(data)

                # Compute metrics
                depth_list.append(compute_tree_depth(G))
                retweet_counts.append(len(G.nodes()))
                branching_factors.append(compute_branching_factor(G))

    return depth_list, retweet_counts, branching_factors

# -----------------------------------------------------------------------------
# 3. GATHER DATA AND ANALYZE
# -----------------------------------------------------------------------------
analysis_results = {}
# For each (source, label), store a tuple of lists:
#   (depth_list, retweet_counts, branching_factors)
for source in sources:
    for label in labels:
        key = f"{source}{label}"
        depth_list, retweet_counts, branching_factors = analyze_diffusion_trees(source, label)
        analysis_results[key] = (depth_list, retweet_counts, branching_factors)
        print(f"Processed {key} -> #Trees: {len(depth_list)}")

# -----------------------------------------------------------------------------
# 4. PLOT DISTRIBUTION OF NUMBER OF RETWEETS (TREE SIZE) ON LOG-LOG
# -----------------------------------------------------------------------------
def log_binning(data, num_bins=10):
    """
    Helper to produce log-spaced bins and histogram for a single dataset.
    Returns (bin_centers, hist_density).
    """
    # Remove zero or invalid (log(0) is undefined)
    data = [x for x in data if x > 0]  
    if len(data) == 0:
        return None, None

    # Log-spaced bins from min to max
    bins = np.logspace(np.log10(min(data)), np.log10(max(data)), num_bins)
    
    # np.histogram with density=True -> Probability density function
    hist, bin_edges = np.histogram(data, bins=bins, density=True)
    
    # Geometric center of each bin for the x-axis
    bin_centers = np.sqrt(bin_edges[:-1] * bin_edges[1:])
    return bin_centers, hist

def plot_log_log_distribution(data_dict, title, xlabel):
    """
    data_dict is { key_label -> list_of_values }.
    We'll log-bin each dataset, then plot on a log-log scale.
    """
    plt.figure(figsize=(8, 6))
    for key, values in data_dict.items():
        bin_centers, hist = log_binning(values)
        if bin_centers is not None and hist is not None:
            plt.loglog(bin_centers, hist, 'o-', label=key)
    plt.xlabel(xlabel)
    plt.ylabel('Probability Density')
    plt.title(title)
    plt.legend()
    plt.grid(True, which="both", linestyle="--", alpha=0.5)
    plt.show()

# Plot distribution of the number of retweets (tree sizes) - log-log
plot_log_log_distribution(
    {k: v[1] for k, v in analysis_results.items()},  # v[1] is the retweet_counts
    "Log-Log Distribution of Number of Retweets (Tree Size)",
    "Number of Retweets"
)

# -----------------------------------------------------------------------------
# 5. PLOT DEPTH DISTRIBUTION AND BRANCHING FACTOR DISTRIBUTION (LINE HIST)
# -----------------------------------------------------------------------------
def plot_line_distribution(data_dict, title, xlabel, log_y=False):
    """
    Plots (on one figure) line-based histograms (using density=True) for each dataset in data_dict.
    Instead of bars, we plot points/lines of the histogram.
    """
    plt.figure(figsize=(8, 6))

    for key, values in data_dict.items():
        counts, bins = np.histogram(values, bins=8, density=True)
        bin_centers = 0.5 * (bins[1:] + bins[:-1])
        plt.plot(bin_centers, counts, '-o', label=key, alpha=0.7)

    if log_y:
        plt.yscale('log')

    plt.xlabel(xlabel)
    plt.ylabel('Density' if not log_y else 'Density (log scale)')
    plt.title(title)
    plt.legend()
    plt.grid(True, linestyle="--", alpha=0.5)
    plt.show()

# Depth distribution (using lines; log-scale on the y-axis)
plot_line_distribution(
    {k: v[0] for k, v in analysis_results.items()},  # v[0] = depth_list
    title="Depth Distribution of Tree Depth",
    xlabel="Tree Depth",
    log_y=True
)

# -----------------------------------------------------------------------------
# 6. PLOT BRANCHING FACTOR WITH LOG BINNING ON A LOG-LOG SCALE
# -----------------------------------------------------------------------------
def plot_log_log_branching_factor_distribution(data_dict, title="Branching Factor (Log-Log)"):
    """
    Plot branching factor distributions (for multiple datasets) on a log-log scale,
    using log_binning.
    """
    plt.figure(figsize=(8, 6))
    for key, values in data_dict.items():
        bin_centers, hist = log_binning(values)  # Reuse your log_binning function
        if bin_centers is not None and hist is not None:
            plt.loglog(bin_centers, hist, 'o-', label=key)
    plt.xlabel("Branching Factor")
    plt.ylabel("Probability Density")
    plt.title(title)
    plt.legend()
    plt.grid(True, which="both", linestyle="--", alpha=0.5)
    plt.show()

# Now plot branching factor on log-log
plot_log_log_branching_factor_distribution(
    {k: v[2] for k, v in analysis_results.items()},
    title="Branching Factor Distribution (Log-Log)"
)

# -----------------------------------------------------------------------------
# 7. DIFFUSION SPEED ANALYSIS (LOG-LOG)
# -----------------------------------------------------------------------------
def build_graph_and_times(data):
    """
    Build a DiGraph and gather timestamps of each node.
    Returns:
      G: DiGraph
      times: dict { node_id: timestamp }
      root_time: the smallest non-null timestamp among all nodes, or None if no valid times
    """
    G = nx.DiGraph()
    times = {}

    def recurse_add_edges(node):
        node_id = node['id']
        node_time = node.get('time', None)
        times[node_id] = node_time

        for child in node.get('children', []):
            G.add_edge(node_id, child['id'])
            recurse_add_edges(child)

    recurse_add_edges(data)

    valid_times = [t for t in times.values() if t is not None]
    root_time = min(valid_times) if valid_times else None
    return G, times, root_time

def analyze_diffusion_speed(source, label, num_time_bins=50):
    """
    Compute how many nodes are 'infected' at each log-spaced time bin,
    shifting earliest time to t=1.
    """
    folder_path = os.path.join(data_dir, f"{source}{label}")
    all_trees_time_diffs = []
    max_time_diff = 0.0

    for file in os.listdir(folder_path):
        if file.endswith(".json"):
            file_path = os.path.join(folder_path, file)
            with open(file_path, 'r') as f:
                data = json.load(f)
                G, times, root_time = build_graph_and_times(data)
                
                if root_time is None:
                    continue

                time_diffs = []
                for node_id, t in times.items():
                    if t is not None:
                        dt = t - root_time
                        if dt < 0:
                            dt = 0
                        # shift so earliest node has t=1
                        dt += 1
                        time_diffs.append(dt)

                time_diffs.sort()
                if time_diffs:
                    # Track max to set upper bound of log bins
                    if time_diffs[-1] > max_time_diff:
                        max_time_diff = time_diffs[-1]

                    all_trees_time_diffs.append(time_diffs)

    if not all_trees_time_diffs:
        return None, (None, None)

    # Ensure we have a range for log-space bins
    if max_time_diff <= 1:
        max_time_diff = 2.0

    time_bins = np.logspace(np.log10(1.0), np.log10(max_time_diff), num=num_time_bins)

    diffusion_curves = []
    for time_diffs in all_trees_time_diffs:
        idx = 0
        n_nodes = len(time_diffs)
        cumulative_counts = []
        for tb in time_bins:
            while idx < n_nodes and time_diffs[idx] <= tb:
                idx += 1
            cumulative_counts.append(idx)
        diffusion_curves.append(cumulative_counts)

    diffusion_curves = np.array(diffusion_curves)
    avg_curve = diffusion_curves.mean(axis=0)
    std_curve = diffusion_curves.std(axis=0)

    return time_bins, (avg_curve, std_curve)

def plot_diffusion_speeds(results_dict, title="Diffusion Speed (Log-Log)"):
    plt.figure(figsize=(8, 6))
    for key, (time_bins, (avg_curve, std_curve)) in results_dict.items():
        if time_bins is None or avg_curve is None:
            continue
        plt.plot(time_bins, avg_curve, label=key)
    plt.xscale('log')
    plt.yscale('log')
    plt.xlabel("Time since earliest node (shifted +1) [log scale]")
    plt.ylabel("Avg. # of infected nodes (log scale)")
    plt.title(title)
    plt.legend()
    plt.grid(True, which="both", linestyle="--", alpha=0.5)
    plt.show()

# -----------------------------------------------------------------------------
# 8. RUN AND PLOT DIFFUSION SPEED
# -----------------------------------------------------------------------------
analysis_speed_results = {}
for source in sources:
    for label in labels:
        key = f"{source}{label}"
        time_bins, (avg_curve, std_curve) = analyze_diffusion_speed(source, label, num_time_bins=50)
        analysis_speed_results[key] = (time_bins, (avg_curve, std_curve))

plot_diffusion_speeds(analysis_speed_results)
