# Project Title: GNN to Detect Fake News

## Project Description

This project investigates the use of Graph Neural Networks (GNNs) to detect fake news by analyzing the relationships and structures within social media data. Utilizing advanced GNN architectures, students will develop models capable of identifying patterns and anomalies indicative of misinformation. This approach can be crucial for media companies, social platforms, and researchers in combating the spread of fake news. For reference, you can explore similar studies here:
https://arxiv.org/pdf/2007.03316
https://arxiv.org/pdf/1902.06673

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Obtain datasets of social media posts, news articles, and their metadata from sources such as the Fake News Challenge dataset (https://www.fakenewschallenge.org/) or BuzzFeed News.
- Collect information on user interactions, social networks, and article credibility ratings.

#### Data Cleaning
- Clean the datasets by removing duplicates, correcting errors, and filtering out irrelevant data. Implement preprocessing steps such as normalization of text data and encoding of categorical variables.

#### Preliminary Data Analysis and Visualization
- Conduct preliminary data analysis to understand the network structures and their correlations with fake news.
- Visualize the data using network graphs to illustrate connections between users, posts, and articles.

### Part 2: Deep Learning Model (10 points)

#### Build GNN Model
- Develop a GNN model using PyTorch Geometric. Incorporate layers suited for graph-based data analysis, such as Graph Convolutional Networks (GCNs) or Graph Attention Networks (GATs).
- Provide a detailed walkthrough of the code, which should be well-commented and available in a repository linked in the report.

#### Model Training and Validation
- Train the model on the prepared dataset, using a split of training and validation data to monitor for overfitting.
- Validate the model's performance using appropriate metrics such as accuracy, precision, recall, and F1-score. Adjust hyperparameters as needed to improve outcomes.

#### Deployment and Real-Time Testing
- Test the model on the test set.
- Visualize the results and assess the model's effectiveness in real-world scenarios.

### Part 3: Societal Impact Analysis (10 points)

#### Analysis Using the Predictive Model
- Analyze the results obtained from the GNN model to understand the spread and impact of fake news in social networks.
- Evaluate the implications of these findings on public discourse and media trustworthiness.

#### Presentation and Report
- Summarize the findings and methodologies in a comprehensive report. Reflect on the model's efficacy and areas for improvement.
- Discuss potential societal impacts, including both the benefits and challenges of using AI for fake news detection.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling and presentation of the dataset.
- Clarity and relevance of the visualizations.
- Thoroughness of the initial analytical findings.

### Deep Learning Model (10 points)
- Accuracy and robustness of the GNN model.
- Model architecture design and implementation.
- Detailed documentation and reproducibility of the model training process.

### Societal Impact Analysis (10 points)
- Depth and rigor of the analysis regarding the model's real-world applicability.
- Discussion of ethical considerations and potential biases.
