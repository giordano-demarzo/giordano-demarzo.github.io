# Project Title: Urban Poverty Mapping from Satellite Imagery

## Project Description

This project applies Convolutional Neural Networks (CNNs) to predict poverty levels in urban neighborhoods using satellite imagery. Students will develop models capable of identifying socioeconomic indicators from visual features in satellite data, creating tools for policy makers and development organizations to target interventions effectively. For similar studies, refer to:
https://www.science.org/doi/10.1126/science.aaf7894

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Obtain satellite imagery datasets (e.g. from Google Earth Engine) and poverty statistics from World Bank databases (https://data.worldbank.org/).
- Collect census data and socioeconomic indicators for target regions.

#### Data Cleaning
- Clean datasets by standardizing image resolution, removing corrupted images, and aligning poverty indices with corresponding geographical coordinates.
- Implement preprocessing steps including image normalization and poverty index categorization.

#### Preliminary Data Analysis and Visualization
- Conduct preliminary analysis to identify visual patterns correlating with poverty levels.
- Visualize data using geographical maps showing poverty distribution and sample satellite images across different poverty categories.

### Part 2: Deep Learning Model (10 points)

#### Build CNN Model
- Develop a CNN model using PyTorch for multi-class poverty level classification. Incorporate appropriate layers for image analysis and transfer learning from pre-trained models.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train the model using training/validation splits to monitor overfitting.
- Validate performance using appropriate metrics including accuracy, precision, recall, and F1-score. Optimize hyperparameters for improved outcomes.

#### Deployment and Testing
- Test the model on held-out geographical regions to assess generalization capability.
- Visualize prediction results on maps showing predicted vs. actual poverty levels.

### Part 3: Policy Impact Analysis (10 points)

#### Analysis Using the Predictive Model
- Analyze how the model's predictions could inform targeted poverty reduction interventions.
- Evaluate the implications and limitations of using satellite imagery for socioeconomic assessment.

#### Presentation and Report
- Summarize findings and methodologies in a comprehensive report. Reflect on model efficacy and improvement areas.
- Discuss societal impacts, including benefits and ethical considerations of AI-driven poverty mapping.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling and presentation of satellite imagery and poverty datasets.
- Clarity and relevance of visualizations.

### Deep Learning Model (10 points)
- Accuracy and robustness of the CNN model.
- Model architecture design and implementation quality.
- Detailed documentation and reproducibility of training process.

### Policy Impact Analysis (10 points)
- Depth and rigor of analysis regarding real-world applicability.
- Discussion of ethical considerations and potential biases.
- Report writing.s
