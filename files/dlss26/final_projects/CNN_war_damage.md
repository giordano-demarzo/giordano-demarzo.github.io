# Project Title: Quantifying War Damage from Satellite Imagery

## Project Description

This project applies Convolutional Neural Networks (CNNs) to satellite imagery to detect and quantify the destruction of buildings caused by armed conflict. Reliable data on war damage is scarce, incomplete, and often politically contested: it usually relies on eyewitness reports or slow manual annotation. Deep learning offers a way to produce damage estimates with much greater scope, resolution, and frequency. Students will build models that classify whether buildings have been destroyed by comparing imagery over time — comparing a CNN built **from scratch** against one built on a **pretrained backbone** — validate them against authoritative damage assessments, and study a central challenge of this setting: **damage labels are extremely sparse**, so the project is as much about learning from limited and noisy supervision as about the model itself. The resulting damage estimates are then linked to questions about displacement and reconstruction needs. For similar studies, refer to:
https://www.pnas.org/doi/10.1073/pnas.2025400118


## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Focus on one or more well-documented conflicts (e.g. **Ukraine** or **Syria**), where imagery and reference assessments are available.
- For **ground-truth damage labels**, use authoritative assessments such as **UNOSAT / UNITAR** damage analyses, **REACH**, or Copernicus EMS — these provide georeferenced points or polygons of damaged/destroyed buildings.
- For imagery, options include **Maxar Open Data** (high resolution, rapid post-event releases), **Sentinel-2** (free optical), and **Sentinel-1 SAR**. Note that **SAR** is valuable here because it sees through clouds and smoke and is widely used for damage detection via coherence loss — students may discuss or experiment with it as an alternative or complement to optical imagery.
- Obtain building footprints (e.g. OpenStreetMap, Microsoft/Google building footprints) to anchor patches on structures.
- For Part 3, collect data on population, displacement, or refugee flows for the studied region.

#### Data Cleaning
- Co-register pre- and post-event imagery and crop patches around buildings.
- Align the UNOSAT/EMS labels with image patches and acknowledge their limitations: assessments are made at specific dates, may miss damage, and cover only parts of a city.
- Remove cloudy/corrupted tiles, standardize resolution and bands, normalize.

#### Preliminary Data Analysis and Visualization
- Map the spatial distribution of labelled damage and make the **label sparsity explicit**.
- Show example pre/post patches for destroyed vs. intact buildings, and discuss how subtle the signal can be.

### Part 2: Deep Learning Model (10 points)

#### Build CNN Models
- This project requires **two models, to be compared**:
  1. A **CNN trained from scratch** (a compact custom architecture is recommended over a very deep one).
  2. A model built on a **pretrained CNN backbone** that is adapted and **fine-tuned** (transfer learning).
- Both take **pre- and post-event patches** of a building (or grid cell) and predict whether it is damaged/destroyed. A siamese / two-branch design or channel-stacking are both reasonable; motivate the choice.
- Given the scarcity of positive labels, consider techniques that exploit structure in the data — for example, **label augmentation** and **spatial/temporal smoothing** (destruction is spatially clustered and, once destroyed, buildings tend to stay destroyed), as in the reference study. The from-scratch vs. pretrained gap is expected to be especially large in this low-data regime, which is itself worth discussing.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train both models and evaluate **spatial generalization**: train on some cities or districts and **hold out a different city/district entirely** for testing, rather than a random split.
- Because of imbalance, compare the two models using precision, recall, F1, and the precision–recall curve / AUC rather than accuracy alone, and validate predictions against the UNOSAT/EMS reference.
- Optionally compare optical vs. SAR inputs, or study how the gap between the two models depends on the amount of labelled data.

#### Deployment and Testing
- Apply the better model across a held-out city and over time to reconstruct the **evolution of damage**, producing maps and time series.
- Discuss where the model is reliable and where it is not, what the from-scratch vs. pretrained comparison reveals about transfer learning under sparse supervision, and how spatial/temporal smoothing affects results.

### Part 3: Conflict and Reconstruction Analysis (10 points)

#### Analysis Using the Predictive Model
- Relate estimated damage to displacement, population loss, or reconstruction needs for the affected areas.
- Discuss how such estimates could support humanitarian relief, human-rights monitoring, and reconstruction planning.

#### Presentation and Report
- Summarize findings on damage detection, spatial generalization, and the temporal evolution of destruction.
- Discuss limitations (sparse and dated labels, attribution of cause, dual-use concerns) and the ethics of producing war-damage estimates.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of imagery and reference damage labels, including co-registration and label sparsity.
- Clear visualization of damage distribution and example patches.

### Deep Learning Model (10 points)
- Sound implementation of both the from-scratch and pretrained change-detection CNNs under sparse, imbalanced supervision, and a fair comparison between them.
- Correct use of a **held-out-region** evaluation and metrics appropriate to imbalance.
- Comprehensive documentation and reproducibility.

### Conflict and Reconstruction Analysis and Report Writing (10 points)
- Depth of the analysis linking damage to displacement / reconstruction.
- Report writing.
