# Project Title: Steering the Politics of LLMs — Fine-Tuning and Measuring Ideological Shift

## Project Description

This project treats a **generative LLM as a survey respondent** and asks a causal question: can we deliberately move a model's political position by fine-tuning it, and how far? Students first **measure the baseline** political leaning of a base model by administering an established political survey, then fine-tune **two separate copies of the same model** on two corpora of **opposite political leaning** (a left-leaning set and a right-leaning set), and finally **re-administer the same survey** to quantify how each model has shifted. This is a clean pre/post, two-treatment experimental design: same model, same instrument, opposite interventions. Beyond the headline effect, the interesting questions are about **robustness** — does the induced shift survive changes in question wording, survey instrument, or language, or is it superficial? — and about what "steerability" implies for the political neutrality of deployed AI. This project closely follows and extends:
https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0306621&type=printable
https://arxiv.org/abs/2303.17548

## Project Steps

### Part 1: Data Collection and Preliminary Analysis (10 points)

#### Data Collection
- Assemble **two fine-tuning corpora of opposite political leaning**, matched as much as possible in size, genre, and topic so the *leaning* is the main thing that differs. Possible sources:
  - **Party manifestos** — the Manifesto Project (CMP) provides full manifesto texts labelled by party and ideology.
  - **Parliamentary speeches by party** — Open Discourse (German Bundestag), ParlaMint (Europe), or the US Congressional Record.
  - **Partisan media / opinion writing** — left-leaning (e.g. The Atlantic, The Guardian) vs. right-leaning (e.g. National Review, The American Conservative) outlets.
  - **Think-tank publications or political subreddits** as additional sources.
- Choose one or more **measurement instruments** (the "survey") to administer to the models, e.g. the **Political Compass**, **OpinionQA / Pew** political-typology items, **World Values Survey / European Social Survey** questions, or a **Voting Advice Application** such as the **Wahl-O-Mat**. Using **more than one instrument** is encouraged for the robustness analysis.

#### Data Cleaning
- Clean the fine-tuning corpora (strip boilerplate, metadata, speaker tags), handle language, and de-duplicate.
- Check and document **balance** between the two corpora (size in tokens, topic mix), since an imbalance could confound the comparison.
- Format the survey items into a fixed prompt template so the base and fine-tuned models are queried identically.

#### Preliminary Data Analysis and Visualization
- Characterize the two corpora (size, vocabulary, salient topics) and provide simple evidence that they really differ in leaning (e.g. distinctive terms, sentiment on key issues).
- Discuss the difficulty of administering surveys to LLMs (refusals, option ordering, prompt sensitivity) and how you will handle it.

### Part 2: Deep Learning Model (10 points)

#### Build and Fine-tune the Models
- **Baseline measurement:** administer the chosen survey(s) to the **base model** and record its position. Query each item **multiple times** (and ideally with shuffled option order / paraphrases) to estimate not just a point but the **variability** of the response.
- **Two-treatment fine-tuning:** starting from the **same base model**, produce two fine-tuned variants — one trained on the **left-leaning** corpus, one on the **right-leaning** corpus. Continued pretraining (next-token prediction on the partisan text) and/or instruction-style fine-tuning are both reasonable; a lightweight method such as **LoRA / QLoRA** is appropriate given the compute budget. Keep the training setup identical across the two variants.
- Provide detailed, well-commented code available in a repository linked in the report.

#### Model Training and Validation
- Re-administer the **same survey(s)** to both fine-tuned models and **quantify the shift** relative to the base model, with uncertainty (since responses are stochastic).
- The core result is the **comparison: base vs. left-tuned vs. right-tuned**, ideally placed on a 2-D political map or a left–right scale, showing whether the two treatments move the model in **opposite directions**.
- Validate that changes are genuinely political and not just degraded output: spot-check generations for coherence, and watch for increased refusals or off-topic answers.

#### Deployment and Testing
- **Robustness / generalization tests:** does the induced shift hold under **reworded questions**, a **different survey instrument**, or **another language**? Does it transfer to open-ended questions, not just multiple-choice? Report where the shift is stable and where it collapses.
- Optionally study **dose-response**: how the magnitude of the shift depends on the amount of fine-tuning data.

### Part 3: Political Science and Ethics Analysis (10 points)

#### Analysis Using the Models
- Interpret what the results say about the **malleability and neutrality** of LLMs: how easily can a model's apparent political stance be engineered, and on which issues is it most/least movable?
- Relate to debates about bias in deployed AI, persuasion, and the use of LLMs as proxies for human opinion ("silicon sampling") — including the risk of mistaking a steered model for a real population.

#### Presentation and Report
- Summarize the baseline measurement, the symmetric (or asymmetric) effect of the two treatments, and the robustness findings.
- Discuss limitations (survey-on-LLM validity, prompt sensitivity, corpus confounds) and the ethics of deliberately steering and deploying politically biased models.

## Grading Criteria

### Presentation of Data and Preliminary Data Analysis (10 points)
- Well-constructed, balanced pair of opposing-leaning corpora and a clearly operationalized survey instrument.
- Evidence that the two corpora differ in leaning, and clear handling of LLM-survey administration issues.

### Deep Learning Model (10 points)
- Correct pre/post, **two-treatment** design: same base model, identical training setup, opposite corpora.
- Shift quantified **with uncertainty**, and a fair base vs. left vs. right comparison.
- Comprehensive documentation and reproducibility.

### Political Science and Ethics Analysis and Report Writing (10 points)
- Depth of the analysis of steerability, robustness, and what it implies for AI neutrality and silicon sampling.
- Report writing.
