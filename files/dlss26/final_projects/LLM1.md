# Project Title: AI Politicians - Simulating Parliamentary Discourse

## Project Description

This project fine-tunes decoder models on parliamentary speeches to simulate individual politicians' speaking patterns. Fine tuned model will the be tested using standard survey methodologies.
For similar studies, refer to:
https://arxiv.org/html/2404.08699v3
https://arxiv.org/abs/2303.12057

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Collect parliamentary speech transcripts, voting records, and party manifestos from publicly available government databases or ParlaMint II dataset.
- Obtain politician biographies and political position data for context.
- Identify established political surveys (Political Compass, World Values Survey questions) for validation methodology.

#### Data Cleaning
- Clean datasets by removing procedural text, standardizing speaker identification, and filtering relevant political content.
- Implement preprocessing including speech segmentation and political position encoding.

#### Preliminary Data Analysis and Visualization
- Analyze speaking patterns, topic distributions, and political position consistency across politicians.
- Visualize political discourse patterns using word clouds, topic distributions, and temporal analysis.

### Part 2: Deep Learning Model (10 points)

#### Fine-tune Language Model
- Fine-tune a small decoder model using PyTorch for politician-specific text generation.
- Implement politician-specific conditioning with political position consistency training.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train models for individual politicians using their speech corpora.
- Validate through political Turing tests and consistency with actual voting patterns.

#### Deployment and Testing
- Test generated speeches against actual political positions and discourse patterns.
- Design survey questions based on established political positioning instruments 
- Present survey questions to fine-tuned models and collect responses in politician-specific style. Compare model responses with known political positions of the actual politicians.


### Part 3: Political Science Analysis (10 points)

#### Analysis Using the Generated Content
- Analyze model ability to capture individual political discourse styles and policy positions.
- Evaluate implications for political communication analysis and discourse studies.
- Discuss the ability of fine tuning to steer the political position of LLMs.

#### Presentation and Report
- Summarize findings regarding political discourse simulation accuracy.
- Discuss applications and ethical considerations for computational political science.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of parliamentary discourse datasets.
- Clear analysis of political speaking patterns and consistency.
- Quality visualization of political discourse characteristics.

### Deep Learning Model (10 points)
- Quality of politician-specific text generation.
- Effective fine-tuning approach and political conditioning.
- Comprehensive documentation and reproducibility.

### Political Science Analysis (10 points)
- Analysis regarding political discourse simulation.
- Discussion of applications and ethical considerations for political AI.
- Report writing. 

