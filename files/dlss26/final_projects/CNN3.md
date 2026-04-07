# Project Title: Solar Energy Expansion Monitoring from Satellite Imagery

## Project Description

This project applies CNNs to detect solar panel installations from satellite imagery, tracking renewable energy adoption patterns across different regions and socioeconomic areas. Students will develop models to monitor utility-scale and rooftop solar deployment, providing insights for energy policy and infrastructure planning. For similar studies, refer to:
https://www.nature.com/articles/s41586-021-03957-7

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Obtain satellite imagery from Google Earth Engine or similar and solar installation databases from OpenStreetMap and Energy Information Administration.
- Collect regional energy statistics and socioeconomic data for correlation analysis.

#### Data Cleaning
- Clean datasets by standardizing image resolution, removing cloudy images, and validating solar installation coordinates.
- Implement preprocessing including image enhancement and installation data verification.

#### Preliminary Data Analysis and Visualization
- Analyze spatial distribution patterns of solar installations across different regions.
- Visualize data using maps showing solar deployment density and temporal adoption trends.

### Part 2: Deep Learning Model (10 points)

#### Build CNN Model
- Develop a CNN model using PyTorch for solar panel detection and classification (utility-scale vs. rooftop).
- Incorporate object detection capabilities and multi-scale analysis.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train the model using annotated satellite imagery with appropriate data augmentation.
- Validate performance using detection accuracy metrics and false positive/negative analysis.

#### Deployment and Testing
- Test the model on new geographical regions to assess generalization.
- Visualize detection results and compare with known installation databases.

### Part 3: Energy Policy Analysis (10 points)

#### Analysis Using the Predictive Model
- Analyze solar adoption patterns across different socioeconomic areas and policy environments.
- Evaluate the model's utility for renewable energy monitoring and policy assessment.

#### Presentation and Report
- Summarize findings regarding solar deployment trends and model performance.
- Discuss implications for energy transition monitoring and policy evaluation.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of satellite imagery and energy datasets.
- Clear visualization of solar installation patterns.
- Preliminary analysis of deployment trends.

### Deep Learning Model (10 points)
- Accuracy of solar panel detection and classification.
- Quality of model architecture and implementation.
- Comprehensive documentation and reproducibility.

### Energy Policy Analysis (10 points)
- Analysis regarding policy implications.
- Discussion of renewable energy monitoring applications.
- Report writing.
