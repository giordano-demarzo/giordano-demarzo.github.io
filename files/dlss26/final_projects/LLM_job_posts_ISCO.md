# Project Title: Classifying Online Job Postings into Occupations with LLMs

## Project Description

This project uses **generative large language models (LLMs)** to classify online job advertisements according to the **ISCO** occupational classification (the International Standard Classification of Occupations). Occupational coding is a labor-intensive task in official statistics and labor-market research, and it is a natural fit for LLMs: the ISCO/ESCO taxonomy comes with rich textual descriptions of each occupation (the "book of occupations"), and a small amount of human-labelled data can sharpen the model. The central methodological exercise is to **compare two strategies**: (1) an **in-context-learning** approach, where a model is given the relevant occupation definitions and examples in the prompt without any weight updates; and (2) a **two-step fine-tuned** model, where a base model is first further pretrained (next-token prediction) on the **ISCO classification book** to absorb the taxonomy, and then **instruction-fine-tuned** on a small set (~500) of hand-labelled job ads. The resulting labelled dataset is then used to study the labor market. The classification is also genuinely **hierarchical** (10 major groups → sub-major → minor → 4-digit unit groups), which raises the question of *how coarse or fine* a level the model can reliably reach. For similar studies, refer to:
https://arxiv.org/abs/2309.09708
https://arxiv.org/abs/2512.03195

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Obtain the **ISCO-08** classification, which provide structured occupation titles, codes, and detailed textual descriptions (the "book of occupations"). 
- Obtain a corpus of at least 10k **online job postings**. Options include open datasets, public job-board / portal data, or a small self-collected sample. Postings can be in English or German.
- Build a **manually curated gold-standard set**: around **500/1000 job ads** that the team labels by hand with ISCO codes. This is the backbone of the instruction-tuning step and of evaluation, so define clear coding guidelines and, ideally, measure inter-annotator agreement.

#### Data Cleaning
- Clean job-ad text (strip boilerplate, HTML, company info), handle language, and de-duplicate.

#### Preliminary Data Analysis and Visualization
- Describe the corpus (length, sectors, regions if available) and the **distribution of gold labels across ISCO major groups**, noting imbalance and any ambiguous cases.
- Discuss what makes occupational coding hard (vague titles, multi-role ads, marketing language).

### Part 2: Deep Learning Model (10 points)

#### Build the Classification Models
- This project requires **two approaches, to be compared**:
  1. **In-context learning (no weight updates):** prompt a generative LLM with the relevant ISCO occupation descriptions and a few labelled examples, and have it output a code. Because the taxonomy is large, a **retrieval step** (embed the ad and the occupation descriptions, retrieve the closest candidate occupations, then let the LLM choose among them) is recommended over putting the whole taxonomy in the prompt.
  2. **Two-step fine-tuning:** starting from a base generative model,
     - **Step 1 — continued pretraining:** further train the model with a **next-token-prediction** objective on the text of the **ISCO classification book** (the official document describing all groups and occupations), so it internalizes the taxonomy.
     - **Step 2 — instruction fine-tuning:** fine-tune the resulting model on the ~500 hand-labelled job ads, framed as instructions (job ad in → ISCO code out). 
     - A lightweight method such as **LoRA / QLoRA** is fine given the small data and compute budget.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Evaluate on a held-out portion of the gold set, reporting accuracy and other relevant metrics.
- Use a **hierarchy-aware** view of errors (a near-miss within the right major group is not the same as a completely wrong code) and report a confusion matrix over major groups.
- Compare the **in-context-learning** approach against the **two-step fine-tuned** model, and discuss the trade-off (data and compute cost vs. accuracy). Where feasible, an **ablation** isolating the contribution of Step 1 (continued pretraining on the ISCO book) vs. Step 2 alone is a strong addition.

#### Deployment and Testing
- Apply the best model to the **full job-postings corpus** to produce a labelled dataset.
- Sanity-check the automatic labels (spot-checking, comparison to any external occupational statistics) and discuss reliability by occupation.

### Part 3: Labor-Market Analysis (10 points)

#### Analysis Using the Labelled Dataset
- Use the labelled corpus to study the labor market: the occupational composition of demand, differences across sectors/regions, trends over time, or required skills by occupation.
- Discuss limitations of inferring labor-market structure from online ads (coverage bias toward certain occupations, duplicated/stale postings).

#### Presentation and Report
- Summarize findings on classification performance across hierarchy levels, the in-context-learning vs. two-step fine-tuning comparison, and the labor-market analysis.
- Discuss ethical and practical considerations of automated occupational coding in official statistics and research.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of the ISCO/ESCO taxonomy and job-ad corpus, and a well-constructed manually curated gold set.
- Clear analysis of the label distribution and the difficulty of the task.

### Deep Learning Model (10 points)
- Sound implementation of **both** the in-context-learning approach and the two-step (continued-pretraining + instruction-tuning) fine-tuned model, with a fair comparison.
- **Hierarchy-aware evaluation** across classification levels.
- Comprehensive documentation and reproducibility.

### Labor-Market Analysis and Report Writing (10 points)
- Depth of the labor-market analysis using the labelled dataset.
- Report writing.
