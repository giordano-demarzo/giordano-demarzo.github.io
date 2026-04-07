# Project Title: Education Investment Forecasting for Regional Economic Development

## Project Description

This project uses RNNs to analyze time-series data on education expenditures and predict regional economic outcomes 10-15 years ahead. Students will investigate how foundational education investments drive long-term economic growth and workforce development. For similar studies, refer to:
https://www.mdpi.com/2227-7390/11/14/3085?utm_source=chatgpt.com
https://www.nber.org/system/files/working_papers/w21770/w21770.pdf?utm_source=chatgpt.com


## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Obtain K-12 education expenditure data (or similar data) from NCES school finance surveys and teacher salary databases.
- Collect regional economic indicators from Bureau of Economic Analysis and employment statistics from Bureau of Labor Statistics.

#### Data Cleaning
- Clean datasets by standardizing geographical units, handling missing values, and aligning temporal sequences.
- Implement preprocessing including expenditure categorization and economic indicator normalization.

#### Preliminary Data Analysis and Visualization
- Analyze long-term relationships between education spending and economic outcomes.
- Visualize time-series trends and cross-regional comparisons using appropriate plots.

### Part 2: Deep Learning Model (10 points)

#### Build RNN Model
- Develop an LSTM model or similar architecture using PyTorch for long-term sequence prediction (10-15 year lags).
- Incorporate multi-variate time series modeling.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train the model using historical education-economic outcome pairs with appropriate sequence lengths.
- Validate performance using temporal cross-validation and long-term prediction accuracy metrics.

#### Deployment and Testing
- Test the model on recent education investment patterns to predict future economic outcomes.
- Analyze which education expenditure categories most strongly predict economic growth.

### Part 3: Education Policy Analysis (10 points)

#### Analysis Using the Predictive Model
- Analyze optimal education investment strategies for regional economic development.
- Evaluate policy implications of long-term education-economy relationships.

#### Presentation and Report
- Summarize findings regarding education investment effectiveness and economic returns.
- Discuss applications for education policy planning and regional development strategies.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of long-term time-series datasets.
- Clear visualization of education-economy relationships.
- Analysis of temporal patterns and regional variations.

### Deep Learning Model (10 points)
- Accuracy of long-term economic predictions.
- Appropriate LSTM architecture for extended temporal dependencies.
- Quality documentation and reproducibility.

### Education Policy Analysis (10 points)
- Analysis regarding education investment strategies.
- Discussion of policy applications for regional development.
- Report writing.
