# Project Title: Environmental Risk Discourse Evolution in SEC 10-K Filings

## Project Description

This project tracks how companies discuss environmental risks in SEC 10-K Risk Factors sections from 2005-2024, analyzing the evolution of corporate environmental awareness and communication strategies. For similar studies, refer to:
https://www.nature.com/articles/s41599-024-04169-w
https://link.springer.com/article/10.1007/s11142-022-09687-z

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Obtain SEC 10-K filings Section 1A (Risk Factors) from SEC EDGAR database for S&P 500 companies (2005-2024) or from similar sources.
- Collect environmental regulations database and climate event timeline for context.
- Consider the possibility of building a dictionary of words related to climate risk and environmental problems.

#### Data Cleaning
- Clean datasets by extracting Risk Factors sections, standardizing company identifiers, and filtering environmental content.
- Implement preprocessing including text segmentation and temporal alignment.

#### Preliminary Data Analysis and Visualization
- Analyze temporal trends in environmental risk disclosure and language evolution.
- Visualize disclosure patterns using time-series analysis and cross-industry comparisons.

### Part 2: Deep Learning Model (10 points)

#### Fine-tune Language Model
- Fine-tune BERT or similar model using PyTorch for environmental risk classification and sentiment analysis.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train models for environmental risk detection and discourse analysis across temporal periods.
- Validate through manual annotation.
- You can use a dictionary approach to understand the rise in environmental risk interest (see for instance https://www.nature.com/articles/s41562-025-02136-2)

#### Deployment and Testing
- Test model performance on recent filings and cross-industry risk discourse analysis.
- Analyze correlation between disclosure patterns and major climate events/regulations.

### Part 3: Corporate Environmental Analysis (10 points)

#### Analysis Using the Classification Model
- Analyze evolution of corporate environmental risk communication and strategic positioning.
- Evaluate relationship between disclosure patterns and regulatory/climate events.

#### Presentation and Report
- Summarize findings regarding corporate environmental discourse evolution.
- Discuss implications for environmental finance and corporate sustainability analysis.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of SEC filing datasets and temporal alignment.
- Clear visualization of environmental discourse trends.
- Analysis of corporate risk communication patterns.

### Deep Learning Model (10 points)
- Accuracy of environmental risk classification and sentiment analysis.
- Effective fine-tuning approach for financial text analysis.
- Quality documentation and reproducibility.

### Corporate Environmental Analysis (10 points)
- Analysis regarding corporate environmental communication evolution.
- Discussion of applications for environmental finance and policy analysis.
- Report writing.
