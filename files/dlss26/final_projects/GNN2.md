# Project Title: Income Inequality Prediction Through Country Similarity Networks

## Project Description

This project builds country similarity networks to predict income inequality (GINI coefficients) for countries with missing data. Students will analyze how economic structures and country relationships influence inequality patterns using GNNs. For similar studies, refer to:
https://arxiv.org/html/2405.14135v3

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Obtain UN Comtrade export data, World Bank GINI coefficients, and country development indicators.
- Collect geographic data (borders, distances) and cultural similarity indices.

#### Data Cleaning
- Clean datasets by standardizing country codes, handling missing values, and aligning temporal data.
- Implement preprocessing including similarity measure calculation and network construction.

#### Preliminary Data Analysis and Visualization\
- Construct one or more networks using borders, cultural similarity, export.
- Analyze patterns in missing GINI data and country similarity relationships.
- Visualize country networks and inequality distributions using network graphs and geographical maps.

### Part 2: Deep Learning Model (10 points)

#### Build GNN Model
- Develop a GNN model using PyTorch Geometric for GINI coefficient prediction.
- Incorporate multiple similarity networks (economic, geographic, cultural) with appropriate node features.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train the model using countries with available GINI data for supervision.
- Validate performance using cross-validation on known values and prediction accuracy metrics.

#### Deployment and Testing
- Test predictions on countries with recently released GINI data not used in training.
- Compare different similarity network approaches and their prediction effectiveness.
- Use the model to compute the GINI index for poorly covered countries.

### Part 3: Development Economics Analysis (10 points)

#### Analysis Using the Predictive Model
- Analyze which country characteristics and relationships drive inequality patterns.
- Evaluate policy implications of inequality prediction and country similarity insights.

#### Presentation and Report
- Summarize findings regarding inequality drivers and prediction accuracy.
- Discuss applications for development policy and international cooperation.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of multi-source country datasets.
- Clear visualization of similarity networks and inequality patterns.
- Analysis of missing data patterns and network structures.

### Deep Learning Model (10 points)
- Accuracy of GINI coefficient predictions.
- Effective integration of multiple similarity measures.
- Comprehensive documentation and reproducibility.

### Development Economics Analysis (10 points)
- Analysis regarding inequality determinants.
- Discussion of policy implications and development applications.
- Report writing.
