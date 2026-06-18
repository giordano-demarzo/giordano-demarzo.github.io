# Project Title: Mapping Natural-Disaster Damage from Satellite Imagery

## Project Description

This project applies Convolutional Neural Networks (CNNs) to satellite imagery to assess the damage caused by natural disasters such as hurricanes, wildfires, and floods. The core idea is **change detection**: by comparing imagery from *before* and *after* an event, a model can learn to classify how badly buildings or land parcels have been affected (e.g. no damage / minor / major / destroyed). Students will compare a CNN built **from scratch** against one built on a **pretrained backbone**, and study a question that matters operationally: **does a model trained on one type of disaster transfer to another?** A network that learns "hurricane damage" may or may not recognise "wildfire damage", and understanding this gap is central to whether such tools can be deployed quickly when a new, unseen disaster strikes. The resulting damage maps are then used to study how impact and recovery are distributed across communities. For similar studies, refer to:
https://arxiv.org/abs/1911.09296
https://arxiv.org/abs/2004.05525

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- The natural starting point is the **xBD / xView2 dataset**, which provides pre- and post-disaster high-resolution image pairs with building footprints and a four-level damage scale, spanning multiple disaster types (hurricanes, wildfires, floods, earthquakes, volcanic eruptions). See https://xview2.org/.
- Additional or alternative imagery can come from **Maxar Open Data** (rapid releases after major disasters), **Copernicus EMS / Emergency Management Service** rapid mapping products, and **Sentinel-2** (free, but coarser at 10 m).
- For the impact analysis in Part 3, collect socioeconomic and demographic data for the affected regions (income, population density, housing) from census or open statistical sources.

#### Data Cleaning
- Co-register the pre- and post-event tiles so that the same pixel corresponds to the same location in both images, and crop image patches around each building or grid cell.
- Remove cloudy, smoke-obscured, or corrupted tiles, standardize resolution and bands, and normalize.
- Note that the damage classes are typically **heavily imbalanced** (most buildings are undamaged); decide how to handle this (class weighting, resampling) and justify the choice.

#### Preliminary Data Analysis and Visualization
- Visualize the class distribution overall and **per disaster type**, and show example pre/post patches for each damage level.
- Discuss how visually different the damage signatures are across disaster types — this motivates the cross-disaster transfer question.

### Part 2: Deep Learning Model (10 points)

#### Build CNN Models
- This project requires **two models, to be compared**:
  1. A **CNN trained from scratch** (a compact custom architecture is recommended over a very deep one).
  2. A model built on a **pretrained CNN backbone** that is adapted and **fine-tuned** (transfer learning), with a small classification head.
- Both take the **pre- and post-event patches** and predict the damage level. A common design is a **siamese / two-branch architecture** that processes both images and compares their features, but students are free to choose and motivate an approach (e.g. stacking the two images as extra channels).
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train both models, and evaluate **generalization to an unseen disaster type**: train on one or more disaster types (e.g. hurricanes, floods) and **hold out a different type entirely** (e.g. wildfires) for testing — not a random split.
- Compare the two models using classification metrics (accuracy, per-class precision/recall, F1, confusion matrix), reporting performance both on **seen** disaster types and **specifically on the held-out** type.
- Optionally, study whether adding even a small amount of data from the held-out disaster type closes the gap (a few-shot / domain-adaptation ablation).

#### Deployment and Testing
- Apply the better model to a held-out event to produce a continuous **damage map** over the affected area.
- Discuss where predictions are reliable and where they fail, what the from-scratch vs. pretrained comparison reveals about transfer learning for satellite imagery, and what the cross-disaster results reveal about deploying such a system on a *new* disaster before any labels are available.

### Part 3: Impact and Recovery Analysis (10 points)

#### Analysis Using the Predictive Model
- Overlay predicted damage with socioeconomic data to test whether damage and recovery are **unequally distributed** across communities.
- Discuss how rapid automated damage maps could support humanitarian response and aid targeting, and the risk of acting on predicted rather than verified damage.

#### Presentation and Report
- Summarize findings on change detection, cross-disaster generalization, and the distribution of impact.
- Discuss limitations (label noise, cloud/smoke occlusion, imagery availability after an event) and the ethics of automated damage assessment.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of pre/post imagery, co-registration, and the damage labels, including class imbalance.
- Clear visualization of the class distribution per disaster type and example damage patches.

### Deep Learning Model (10 points)
- Sound implementation of both the from-scratch and pretrained change-detection CNNs, and a fair comparison between them.
- Correct use of a **held-out-disaster-type** evaluation rather than random splitting.
- Comprehensive documentation and reproducibility.

### Impact and Recovery Analysis and Report Writing (10 points)
- Depth of the impact / recovery analysis.
- Report writing.
