# Project Title: Wikipedia Article Quality Prediction through Citation Networks

## Project Description

This project uses Graph Neural Networks (GNNs) to predict Wikipedia article quality ratings by analyzing citation networks and article features. Students will develop models to understand how quality signals propagate through knowledge networks, providing insights for collaborative content quality assessment. For similar studies, refer to:
https://dl.acm.org/doi/10.1145/3308558.3313618
https://arxiv.org/abs/2007.02901

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Obtain Wikipedia dumps including article content, pagelinks, and quality assessments from Wikipedia databases.
- Collect pageview statistics and edit history data using Wikipedia API.
- Get other features, potentially also including the text of the articles.

#### Data Cleaning
- Clean datasets by removing redirects, disambiguations, and articles without quality ratings.
- Implement preprocessing including text feature extraction and network construction.

#### Preliminary Data Analysis and Visualization
- Analyze citation network structure and quality rating distributions.
- Visualize network properties and quality propagation patterns using network graphs.

### Part 2: Deep Learning Model (10 points)

#### Build GNN Model
- Develop a GNN model using PyTorch Geometric for multi-class quality prediction (FA/GA/B/C/Start/Stub).
- Incorporate Graph Convolutional Networks or Graph Attention Networks with appropriate node and edge features.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train the model addressing class imbalance in quality ratings.
- Validate performance using classification metrics and network-based evaluation approaches.

#### Deployment and Testing
- Test the model on articles with recent quality assessments.
- Analyze prediction patterns and network position effects on quality assessment.

### Part 3: Knowledge Network Analysis (10 points)

#### Analysis Using the Predictive Model
- Analyze how citation relationships influence article quality predictions.
- Evaluate the model's insights for collaborative knowledge quality assessment.

#### Presentation and Report
- Summarize findings regarding quality propagation in citation networks.
- Discuss implications for encyclopedia content curation and quality improvement.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of Wikipedia network datasets.
- Clear visualization of citation networks and quality distributions.
- Analysis of network structural properties.

### Deep Learning Model (10 points)
- Accuracy of quality prediction across different classes.
- Appropriate GNN architecture design and implementation.
- Quality documentation and code reproducibility.

### Knowledge Network Analysis (10 points)
- Analysis regarding quality propagation mechanisms.
- Discussion of applications for collaborative content systems.
- Report writing.

