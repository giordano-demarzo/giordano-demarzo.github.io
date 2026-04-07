# Project Title: Gentrification Detection from Street View Images

## Project Description

This project uses CNNs to detect and predict neighborhood gentrification patterns by analyzing visual changes in Google Street View images over time. Students will develop models to identify early indicators of gentrification, creating early warning systems for displacement risk assessment. For similar studies, refer to:
https://www.pnas.org/doi/10.1073/pnas.1700035114

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Collect Street View images using Google Street View Static API and census demographic data for target neighborhoods.
- Obtain real estate price data and historical gentrification studies datasets for validation.

#### Data Cleaning
- Clean datasets by removing corrupted images, standardizing image parameters, and aligning temporal data across different sources.
- Implement preprocessing including image normalization and demographic data encoding.

#### Preliminary Data Analysis and Visualization
- Analyze visual patterns associated with different gentrification stages.
- Visualize data using time-series plots of neighborhood changes and sample images from different gentrification phases.

### Part 2: Deep Learning Model (10 points)

#### Build CNN Model
- Develop a CNN model using PyTorch for multi-class classification of gentrification stages (stable/early/advanced gentrification).
- Incorporate temporal analysis capabilities and transfer learning from pre-trained models.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train the model using appropriate train/validation splits with attention to temporal consistency.
- Validate performance using classification metrics and temporal prediction accuracy.

#### Deployment and Testing
- Test the model on neighborhoods with known gentrification histories.
- Visualize results showing gentrification risk predictions across different areas.
- Apply the model to study areas you are interested in

### Part 3: Urban Policy Analysis (10 points)

#### Analysis Using the Predictive Model
- Analyze how the model could inform urban planning and anti-displacement policies.
- Evaluate the social implications of gentrification prediction systems.

#### Presentation and Report
- Summarize findings in a comprehensive report discussing model performance and limitations.
- Address ethical considerations regarding gentrification prediction and potential community impacts.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of Street View imagery and demographic datasets.
- Quality and clarity of temporal visualizations.
- Preliminary analysis of gentrification indicators.

### Deep Learning Model (10 points)
- Accuracy and robustness of the CNN classification model.
- Documentation quality and code reproducibility.

### Urban Policy Analysis (10 points)
- Depth of analysis regarding policy applications.
- Discussion of ethical implications and community impact considerations.
- Report writing.

