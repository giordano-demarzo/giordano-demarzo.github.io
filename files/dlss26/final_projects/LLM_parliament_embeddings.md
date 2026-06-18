# Project Title: Tracking Political Change with Embeddings of Parliamentary Speech

## Project Description

This project uses **encoder-only language models** (e.g. BERT / Sentence-Transformers) to build vector representations of parliamentary speeches and of the politicians who give them, and then studies how these representations **evolve over time**. By aggregating speech embeddings into a representation for each member of parliament (MP) per time period, students can trace ideological trajectories, detect moments of realignment (such as a party switch or the response to a crisis), and discover the latent topic structure of debate. The central methodological question is **validation**: an embedding space is only useful if its geometry corresponds to something politically meaningful, so students must test whether the representations recover known structure (party membership, established ideology scores, real political events). For similar studies, refer to:
https://www.cambridge.org/core/journals/political-analysis/article/abs/word-embeddings-for-the-analysis-of-ideological-placement-in-parliamentary-corpora/017F0CEA9B3DB6E1B94AC36A509A8A7B


## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Collect parliamentary speech transcripts with speaker, party, and date metadata. Good sources include the **ParlaMint** corpus (comparable parliamentary data across many European countries) and, for Germany, the **Open Discourse** Bundestag corpus.
- Collect external "ground-truth" political measures for validation, such as **expert-survey party positions (Chapel Hill Expert Survey, CHES)**, party manifesto scores (**Manifesto Project / CMP**), or roll-call / voting-based ideal points where available.
- Compile a list of **known events** to look for: documented party switches, leadership changes, coalition formations, and crises (financial crisis, COVID, migration, war).

#### Data Cleaning
- Remove procedural text and interjections, standardize speaker and party identifiers (including over time, as parties merge/rename), and segment speeches into usable units.
- Decide on a unit of analysis (speech, MP-month, MP-year) and how to aggregate, and justify it.

#### Preliminary Data Analysis and Visualization
- Describe the corpus: speeches per party over time, speech length, vocabulary, missing data.
- Provide initial visualizations such as topic frequencies over time and activity by party.

### Part 2: Deep Learning Model (10 points)

#### Build the Embedding Model
- Use an **encoder-only model** to embed speeches. Students may use a pretrained model **off the shelf** and also **fine-tune** it for the domain (e.g. with MLM, contrastive / similarity objective, or by predicting party/speaker as an auxiliary task) — comparing off-the-shelf vs. fine-tuned representations is a natural and recommended comparison.
- Aggregate speech embeddings into **MP-level representations per time period** (e.g. averaging, or a more sophisticated pooling), enabling trajectories through the embedding space.
- For the topic-modeling component, an embedding-based approach is recommended.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- **Validate the embedding space** against external structure: do parties separate? Does a principal axis of the space correlate with CHES/manifesto left–right scores? Can party membership be recovered (e.g. by clustering or a simple classifier on the embeddings)?
- Report quantitative validation (e.g. correlation with expert scores, clustering purity, classification accuracy), not only qualitative plots.

#### Deployment and Testing
- Use the validated representations to **track change over time**: plot MP and party trajectories, and check whether **known events** (party switches, crises) appear as detectable movements or topic shifts.
- Discuss false positives/negatives — movements the model detects that don't correspond to real events, and vice versa.

### Part 3: Political Science Analysis (10 points)

#### Analysis Using the Embedding Model
- Interpret the discovered trajectories and topics: who moved, when, and around what issues? Does the evidence support a substantive story about realignment or crisis response?
- Discuss what embeddings add over, and where they fall short of, classical text-scaling methods (Wordfish, Wordscores).

#### Presentation and Report
- Summarize findings on representation quality, validation, and detected political change.
- Discuss limitations (aggregation choices, confounding by topic/agenda, comparability across time) and applications for computational political science.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Proper handling of parliamentary corpora and external validation data, including speaker/party standardization over time.
- Clear descriptive analysis and visualization of the corpus.

### Deep Learning Model (10 points)
- Sound use of encoder embeddings and MP-level aggregation, ideally with an off-the-shelf vs. fine-tuned comparison.
- **Rigorous, quantitative validation** of the embedding space against external structure.
- Comprehensive documentation and reproducibility.

### Political Science Analysis and Report Writing (10 points)
- Depth of the analysis of political change and topic evolution.
- Report writing.
