# Project Title: Mapping Air Pollution and Exposure Inequality in Germany from Satellite Imagery

## Project Description

This project applies Convolutional Neural Networks (CNNs) to satellite imagery to estimate ground-level particulate matter (PM2.5/PM10) across Germany, and to study who is most exposed. Air-quality measurements are spatially uneven: dense in some cities and regions, sparse in other areas. Students will train models where coverage is good and test whether they can predict pollution in a **held-out German federal state (Land) with little coverage**, while comparing a CNN built **from scratch** against one built on a **pretrained backbone**. The resulting maps are then used to study environmental-justice questions of unequal exposure. For similar studies, refer to:
https://arxiv.org/abs/2108.13902
https://jsss.copernicus.org/articles/8/317/2019/

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Obtain daytime satellite imagery (e.g. Sentinel-2 RGB/multispectral; optionally Sentinel-5P/TROPOMI columns as additional context).
- Obtain ground-level pollution measurements. See for instance:
  - **Sensor.Community / luftdaten.info** — a large citizen-science network of low-cost PM2.5/PM10 sensors, very dense in Germany, with an open historical archive.
  - **Umweltbundesamt (UBA) / EEA** official reference stations — fewer, but high quality; useful as a calibration and validation anchor.
- Consider whether to train at a **national (Germany-only)** or **global** scale: the worldwide Sensor.Community network provides far more data, but pollution regimes and environments differ across regions. The right choice depends on the dataset size and data availability, and is itself worth discussing.
- Collect district-level (Kreis) socioeconomic data (income, population density, etc.) from Destatis / INKAR for the exposure analysis.

#### Data Cleaning
- Compute **annual averages** per sensor to suppress short-term noise, and apply a **data-completeness filter** (e.g. keep only sensors with enough valid days in the year).
- Consider **calibrating** low-cost sensors against nearby reference stations, and note that low-cost PM sensors carry a systematic humidity bias that averaging does *not* remove.
- Co-locate image patches with sensor coordinates, remove cloudy/corrupted tiles, and standardize resolution and bands.

#### Preliminary Data Analysis and Visualization
- Map sensor coverage per Land to make the **under-covered regions explicit**, and choose a held-out Land that is sparse but still has enough sensors to evaluate on.
- Analyze the distribution of PM across urban/rural areas and visualize sample patches for high- vs. low-pollution sites.

### Part 2: Deep Learning Model (10 points)

#### Build CNN Models
- This project requires **two models, to be compared**:
  1. A **CNN trained from scratch** (a compact custom architecture is recommended over a very deep one).
  2. A model built on a **pretrained CNN backbone** (transfer learning), with frozen or fine-tuned weights and a small regression head.
- Both take a satellite image patch and predict the local pollutant concentration (regression).
- Pollution at a location depends not only on its immediate surroundings but also on the **wider spatial context**, so try to take this into account. There are several possible approaches — for example, using a larger input tile, feeding the network both a detailed local patch and a coarser wide-area patch, or adding contextual inputs such as Sentinel-5P columns. Students are free to choose and motivate one.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Train both models on the covered regions, holding out the chosen **sparse Land entirely** — i.e. evaluate spatial generalization, not interpolation.
- Compare the two models using regression metrics (RMSE, MAE, R²), reporting performance both overall and **specifically on the held-out Land**.
- Optionally, study how the gap between the two models changes with training-set size (a data-size ablation).

#### Deployment and Testing
- Apply the better model to the held-out Land and to a dense grid to produce a continuous pollution map.
- Discuss where predictions are reliable and where they are not, and what the from-scratch vs. pretrained comparison reveals about transfer learning for satellite imagery.

### Part 3: Environmental Justice Analysis (10 points)

#### Analysis Using the Predictive Model
- Overlay predicted pollution with district-level socioeconomic data to test whether exposure is **unequally distributed**.
- Consider that citizen-sensor coverage is itself uneven (denser in wealthier, more engaged areas), and discuss what that means for whose air gets measured.

#### Presentation and Report
- Summarize findings on spatial generalization, the from-scratch vs. pretrained comparison, and exposure inequality.
- Discuss limitations (sensor noise and bias, sparse-region uncertainty) and the ethics of acting on predicted rather than measured pollution.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of imagery, sensor, and socioeconomic datasets, including annual averaging, completeness filtering, and sensor–image co-location.
- Clear visualization of coverage per Land and pollution distribution, and justified choice of the held-out Land.

### Deep Learning Model (10 points)
- Sound implementation of both the from-scratch and pretrained models, and a fair comparison between them.
- Correct use of a **held-out-Land** evaluation rather than random splitting.
- Comprehensive documentation and reproducibility.

### Environmental Justice Analysis and Report Writing (10 points)
- Depth of the exposure-inequality analysis.
- Report writing.
